// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

// import { localStorageStore } from '@skeletonlabs/skeleton';
import {
	queryStore,
	type OperationResult,
	type OperationResultSource,
	type OperationResultState,
	type OperationResultStore
} from '@urql/svelte';
import type { ResultOf, VariablesOf } from '$lib/gql/graphql';
import { get, writable } from 'svelte/store';
import type { ToastStore } from './components/Toast/types';
import {
	deleteGlobalMeta,
	deleteMangaMeta,
	setGlobalMeta,
	setMangaMeta
} from './gql/Mutations';
import { getManga, metas } from './gql/Queries';
import { client } from './gql/graphqlClient';
import type { presetConst } from './presets';
import { getObjectKeys, type TriState } from './util.svelte';
import { browser } from '$app/environment';
import { untrack } from 'svelte';

export const toastStore = writable<ToastStore | null>(null);

type Themes = (typeof presetConst)[number]['name'];

export enum ChapterTitle {
	'Source Title' = 'Source Title',
	'Chapter Number' = 'Chapter Number'
}

export enum ChapterSort {
	Source = 'Source',
	'Fetched Date' = 'Fetched Date',
	'Upload Date' = 'Upload Date'
}

export enum Mode {
	Vertical = 'Vertical',
	single = 'single',
	RTL = 'RTL',
	LTR = 'LTR'
}

export enum Layout {
	L = 'L',
	RAL = 'RAL',
	Kindle = 'Kindle',
	Edge = 'Edge'
}

export const sort = {
	Unread: 'Unread',
	Alphabetical: 'Alphabetical',
	ID: 'ID',
	Added: 'Latest Added',
	Read: 'Latest Read',
	Fetched: 'Latest Fetched',
	Uploaded: 'Latest Uploaded',
	Random: 'Random'
} as const;

export enum display {
	Compact = 'Compact',
	Comfortable = 'Comfortable'
	// List = 'List' // WIP
}

// do not make a key named "id" it will break the state
const mangaMetaDefaults = {
	ChapterUnread: 'intermediate' as TriState,
	ChapterDownloaded: 'intermediate' as TriState,
	ChapterBookmarked: 'intermediate' as TriState,
	ChapterSort: ChapterSort.Source,
	ChapterAsc: false,
	ChapterFetchUpload: false,
	ChapterTitle: ChapterTitle['Source Title'],
	Margins: false,
	Scale: false,
	Offset: false,
	SmoothScroll: true,
	ReaderMode: Mode.Vertical,
	NavLayout: Layout.L,
	preLoadNextChapter: true,
	mobileFullScreenOnChapterPage: true,
	doPageIndicator: false as boolean | undefined,
	notes: '' as string | undefined,
	showMissingChapters: false as boolean | undefined,
	groupPartials: [] as string[] | undefined
};

const trueDefaults = {
	nsfw: true,
	ignoreFiltersWhenSearching: false,
	theme: 'skeleton' as Themes,
	dark: true,
	Display: display.Compact,
	Sort: 'ID' as keyof typeof sort,
	Asc: true,
	Unread: 'intermediate' as TriState,
	Downloaded: 'intermediate' as TriState,
	Tracked: 'intermediate' as TriState,
	mangaMetaDefaults,
	downloadsBadge: true,
	unreadBadge: true,
	libraryCategoryTotalCounts: false,
	DownloadAllChaptersOnAddToLibrary: false,
	DeleteAllChaptersOnRemoveFromLibrary: false,
	RemoveChaptersFromDownloadQueueOnRemoveFromLibrary: false
};

const metaKeyBase = 'VUI3_';

type json<T> = {
	stringify: (value: T) => string;
	parse: (value: string) => T;
};

export class LocalStore<T> {
	value = $state<T>() as T;
	private key = '';
	private serializer: json<T> = JSON;

	constructor(key: string, value: T, serializer: json<T> = JSON) {
		this.value = value;
		this.key = key;
		this.serializer = serializer;
		if (browser) {
			const item = localStorage.getItem(this.key);
			if (item) this.value = this.deserialize(item);
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(key, this.serialize(this.value));
				});
			});
		}
	}

	private serialize(value: T): string {
		return this.serializer.stringify(value);
	}

	private deserialize(item: string): T {
		return this.serializer.parse(item);
	}
}

export function localStore<T>(
	key: string,
	value: T,
	serializer: json<T> = JSON
) {
	return new LocalStore(key, value, serializer);
}

function convertOldTriState(value: unknown): TriState {
	switch (value) {
		case 0:
			return 'intermediate';
		case 1:
			return 'on';
		case 2:
			return 'off';
	}
	return value as TriState;
}

class GMState {
	private store = localStore<typeof trueDefaults>('GlobalMeta', trueDefaults);
	private runningMutations = false;
	private mutations: Map<
		string,
		OperationResultSource<
			| OperationResult<
					ResultOf<typeof setGlobalMeta>,
					VariablesOf<typeof setGlobalMeta>
			  >
			| OperationResult<
					ResultOf<typeof deleteGlobalMeta>,
					VariablesOf<typeof deleteGlobalMeta>
			  >
		>
	> = new Map();
	private unSub = () => {};
	constructor() {
		$effect.root(() => {
			const Meta = queryStore({
				client,
				query: metas
			});

			this.unSub = Meta.subscribe((queryResult) => {
				this.store.value = this.extractGlobalMeta(queryResult);
				this.fixOldTriStates();
				if (queryResult.fetching) return;
				this.traverse(this.store.value, trueDefaults);
				this.unSub();
			});
			$effect(() => {
				for (const key of getObjectKeys(trueDefaults)) {
					const stringValue = JSON.stringify(this.store.value[key]);
					const metaKey = metaKeyBase + key;
					const existingValue = get(Meta).data?.metas?.nodes.find(
						(e) => e.key === metaKey
					)?.value;

					if (stringValue !== existingValue) {
						const variables = { key: metaKey, value: stringValue };
						if (stringValue !== JSON.stringify(trueDefaults[key])) {
							this.mutations.set(
								key,
								client.mutation(setGlobalMeta, variables)
							);
							continue;
						}
						if (existingValue !== undefined) {
							this.mutations.set(
								key,
								client.mutation(deleteGlobalMeta, variables)
							);
							continue;
						}
					}
				}
				this.startRunMutations();
			});
		});
	}

	private fixOldTriStates() {
		if ([0, 1, 2].includes(this.store.value.Tracked as unknown as number))
			this.store.value.Tracked = convertOldTriState(
				this.store.value.Tracked as unknown
			);
		if ([0, 1, 2].includes(this.store.value.Unread as unknown as number))
			this.store.value.Tracked = convertOldTriState(
				this.store.value.Tracked as unknown
			);
		if ([0, 1, 2].includes(this.store.value.Downloaded as unknown as number))
			this.store.value.Tracked = convertOldTriState(
				this.store.value.Tracked as unknown
			);
		if (
			[0, 1, 2].includes(
				this.store.value.mangaMetaDefaults
					.ChapterBookmarked as unknown as number
			)
		)
			this.store.value.mangaMetaDefaults.ChapterBookmarked = convertOldTriState(
				this.store.value.mangaMetaDefaults.ChapterBookmarked as unknown
			);
		if (
			[0, 1, 2].includes(
				this.store.value.mangaMetaDefaults
					.ChapterDownloaded as unknown as number
			)
		)
			this.store.value.mangaMetaDefaults.ChapterDownloaded = convertOldTriState(
				this.store.value.mangaMetaDefaults.ChapterDownloaded as unknown
			);
		if (
			[0, 1, 2].includes(
				this.store.value.mangaMetaDefaults.ChapterUnread as unknown as number
			)
		)
			this.store.value.mangaMetaDefaults.ChapterUnread = convertOldTriState(
				this.store.value.mangaMetaDefaults.ChapterUnread as unknown
			);
	}

	private async startRunMutations() {
		if (this.runningMutations) return;
		this.runningMutations = true;
		let prom: Promise<unknown> | undefined = undefined;
		while (this.mutations.size > 0) {
			const key = Array.from(this.mutations.keys())[0];
			const mutation = this.mutations.get(key);
			this.mutations.delete(key);
			prom = mutation?.toPromise();
			await prom;
		}
		await prom;
		this.runningMutations = false;
	}

	private extractGlobalMeta(
		queryResult: OperationResultState<ResultOf<typeof metas>>
	): typeof trueDefaults {
		const globalMetaCopy = $state.snapshot(this.store.value);
		const metas = queryResult.data?.metas?.nodes || [];
		getObjectKeys(trueDefaults).forEach(
			<T extends keyof typeof trueDefaults>(key: T) => {
				const foundMeta = metas.find(
					(node) => node.key.replace(metaKeyBase, '') === key
				);
				if (!foundMeta) {
					globalMetaCopy[key] = trueDefaults[key];
					return;
				}
				globalMetaCopy[key] = JSON.parse(
					foundMeta.value
				) as (typeof trueDefaults)[T];
			}
		);
		return globalMetaCopy;
	}

	private isRecord(obj: unknown): obj is Record<string, unknown> {
		return obj === Object(obj);
	}

	private traverse<T extends Record<string, unknown>>(value: T, defaults: T) {
		const vals: [Record<string, unknown>, Record<string, unknown>][] = [
			[value, defaults]
		];
		while (vals.length > 0) {
			const [valu, defaulte] = vals.shift()!;
			Object.keys(value).forEach((key: keyof Record<string, unknown>) => {
				if (valu[key] === undefined) {
					valu[key] = defaulte[key];
				}
				if (this.isRecord(valu[key]) && this.isRecord(defaulte[key]))
					vals.push([valu[key], defaulte[key]]);
			});
		}
	}

	get value() {
		return this.store.value;
	}

	set value(val: typeof trueDefaults) {
		this.store.value = val;
	}
}

export const gmState = new GMState();

class MMState {
	private _id: number = -1;
	private store = $state<typeof mangaMetaDefaults>(
		gmState.value.mangaMetaDefaults
	);
	private unSub = () => {};
	private MMeta: OperationResultStore<ResultOf<typeof getManga>> | null = null;
	private isRunningMutations = false;
	private mutations: Map<
		string,
		OperationResultSource<
			| OperationResult<
					ResultOf<typeof setMangaMeta>,
					VariablesOf<typeof setMangaMeta>
			  >
			| OperationResult<
					ResultOf<typeof deleteMangaMeta>,
					VariablesOf<typeof deleteMangaMeta>
			  >
		>
	> = new Map();

	constructor() {
		$effect.root(() => {
			$effect(() => {
				for (const key of getObjectKeys(
					untrack(() => {
						return $state.snapshot(gmState.value.mangaMetaDefaults);
					})
				)) {
					const serializedValue = JSON.stringify(this.store[key]);
					const metaKey = metaKeyBase + key;
					const storedValue = untrack(() => {
						if (!this.MMeta) return;
						this.traverse(this.store, gmState.value.mangaMetaDefaults);
						return get(this.MMeta).data?.manga?.meta.find(
							(e) => e.key === metaKey
						)?.value;
					});
					if (serializedValue !== storedValue) {
						const mutationVariables = {
							key: metaKey,
							value: serializedValue,
							id: this._id
						};
						untrack(() => {
							if (
								serializedValue !==
								JSON.stringify(gmState.value.mangaMetaDefaults[key])
							) {
								this.mutations.set(
									key + this.id,
									client.mutation(setMangaMeta, mutationVariables)
								);
								return;
							}
							if (storedValue !== undefined) {
								this.mutations.set(
									key + this.id,
									client.mutation(deleteMangaMeta, mutationVariables)
								);
								return;
							}
						});
					}
				}
				this.runPendingMutations();
			});
		});
	}

	private isRecord(obj: unknown): obj is Record<string, unknown> {
		return obj === Object(obj);
	}

	private traverse(
		value: Record<string, unknown>,
		defaults: Record<string, unknown>
	) {
		const val2 = $state.snapshot(value);
		const vals: [Record<string, unknown>, Record<string, unknown>][] = [
			[val2, defaults]
		];
		while (vals.length > 0) {
			const [valu, defaulte] = vals.shift()!;
			Object.keys(value).forEach((key: keyof Record<string, unknown>) => {
				if (valu[key] === undefined) {
					valu[key] = defaulte[key];
				}
				if (this.isRecord(valu[key]) && this.isRecord(defaulte[key]))
					vals.push([valu[key], defaulte[key]]);
			});
		}
		value = val2;
	}

	get value() {
		return this.store;
	}

	set value(val: typeof mangaMetaDefaults) {
		this.store = val;
	}

	set id(val: number) {
		this._id = val;
		this.unSub();
		this.MMeta = queryStore({
			client,
			query: getManga,
			variables: { id: val }
		});
		this.unSub = this.MMeta.subscribe((queryResult) => {
			this.store = this.extractMangaMeta(queryResult);
			if (queryResult.fetching) return;
			this.unSub();
		});
	}

	private async runPendingMutations() {
		if (this.isRunningMutations) return;
		this.isRunningMutations = true;
		let prom: Promise<unknown> | undefined = undefined;
		while (this.mutations.size > 0) {
			const key = Array.from(this.mutations.keys())[0];
			const mutation = this.mutations.get(key);
			this.mutations.delete(key);
			prom = mutation?.toPromise();
			await prom;
		}
		await prom;
		this.isRunningMutations = false;
	}

	private extractMangaMeta(
		queryResult: OperationResultState<ResultOf<typeof getManga>>
	): typeof mangaMetaDefaults {
		const clonedStore = $state.snapshot(this.store);
		const metas = queryResult.data?.manga.meta || [];
		const Defaults = $state.snapshot(gmState.value.mangaMetaDefaults);
		getObjectKeys(Defaults).forEach(
			<T extends keyof typeof mangaMetaDefaults>(key: T) => {
				const matchedMeta = metas.find(
					(meta) => meta.key.replace(metaKeyBase, '') === key
				);
				if (!matchedMeta) {
					clonedStore[key] = Defaults[key];
					return;
				}
				clonedStore[key] = JSON.parse(
					matchedMeta.value
				) as (typeof mangaMetaDefaults)[T];
			}
		);
		return clonedStore;
	}
}

export const mmState = new MMState();
