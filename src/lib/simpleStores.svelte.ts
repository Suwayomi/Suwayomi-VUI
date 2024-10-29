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
import type { TriState } from './util.svelte';
import { browser } from '$app/environment';
import { untrack } from 'svelte';

// function getObjectEntries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
// 	return Object.entries(obj) as [keyof T, T[keyof T]][];
// }
function getObjectKeys<T extends object>(obj: T): (keyof T)[] {
	return Object.keys(obj) as (keyof T)[];
}

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

export enum sort {
	Unread = 'Unread',
	Alphabetical = 'Alphabetical',
	ID = 'ID',
	'Latest Read' = 'Latest Read',
	'Latest Fetched' = 'Latest Fetched',
	'Latest Uploaded' = 'Latest Uploaded',
	Random = 'Random'
}

export enum display {
	Compact = 'Compact',
	Comfortable = 'Comfortable'
	// List = 'List' // WIP
}

const mangaMetaDefaults = {
	ChapterUnread: 0 as TriState,
	ChapterDownloaded: 0 as TriState,
	ChapterBookmarked: 0 as TriState,
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
	Sort: sort.ID,
	Asc: true,
	Unread: 0 as TriState,
	Downloaded: 0 as TriState,
	Tracked: 0 as TriState,
	mangaMetaDefaults,
	downloadsBadge: true,
	unreadBadge: true,
	mangaUpdatesTracking: {
		enabled: false,
		username: '',
		password: '',
		Authorization: ''
	},
	libraryCategoryTotalCounts: false,
	DownloadAllChaptersOnAddToLibrary: false,
	DeleteAllChaptersOnRemoveFromLibrary: false,
	RemoveChaptersFromDownloadQueueOnRemoveFromLibrary: false
};

// function GlobalMeta() {
// 	const Meta = queryStore({
// 		client,
// 		query: metas
// 	});
// 	const store = localStorageStore('GlobalMeta', trueDefaults);

// 	if (get(store).mangaUpdatesTracking === undefined) {
// 		store.update((newStore) => {
// 			newStore.mangaUpdatesTracking = trueDefaults.mangaUpdatesTracking;
// 			return newStore;
// 		});
// 	}

// 	Meta.subscribe((queryResult) => {
// 		store.update((value) => {
// 			return extractGlobalMeta(value, queryResult);
// 		});
// 	});

// 	function extractGlobalMeta(
// 		value: typeof trueDefaults,
// 		queryResult: OperationResultState<ResultOf<typeof metas>>
// 	): typeof trueDefaults {
// 		const globalMetaCopy = { ...get(store) } as typeof trueDefaults;
// 		const metas = queryResult.data?.metas?.nodes || [];
// 		getObjectKeys(value).forEach(
// 			<T extends keyof typeof trueDefaults>(key: T) => {
// 				const foundMeta = metas.find(
// 					(node) => node.key.replace('VUI3_', '') === key
// 				);
// 				if (foundMeta) {
// 					globalMetaCopy[key] = JSON.parse(
// 						foundMeta.value
// 					) as (typeof trueDefaults)[T];
// 				}
// 			}
// 		);
// 		return globalMetaCopy;
// 	}

// 	async function set(val: typeof trueDefaults) {
// 		for (const [key, value] of getObjectEntries(val)) {
// 			const stringValue = JSON.stringify(value);
// 			const metaKey = `VUI3_${key}`;
// 			const existingValue = get(Meta).data?.metas?.nodes.find(
// 				(e) => e.key === metaKey
// 			)?.value;

// 			if (stringValue !== existingValue) {
// 				try {
// 					//update early for instant UI updates
// 					store.update((vall) => {
// 						(vall[key] as unknown) = value;
// 						return vall;
// 					});

// 					const variables = { key: metaKey, value: stringValue };
// 					if (stringValue !== JSON.stringify(trueDefaults[key])) {
// 						await client.mutation(setGlobalMeta, variables).toPromise();
// 					} else if (existingValue !== undefined) {
// 						await client.mutation(deleteGlobalMeta, variables).toPromise();
// 					}
// 				} catch {}
// 			}
// 		}
// 	}

// 	async function update(
// 		func: (value: typeof trueDefaults) => typeof trueDefaults
// 	) {
// 		const currentStore = get(store);
// 		const updatedStore = func(currentStore);
// 		set(updatedStore);
// 	}

// 	return {
// 		subscribe: store.subscribe,
// 		set,
// 		update
// 	};
// }

// export const Meta = GlobalMeta();

// getObjectKeys(mangaMetaDefaults).forEach((key) => {
// 	if (get(Meta).mangaMetaDefaults[key] === undefined) {
// 		Meta.update((old) => {
// 			const tmp = old;
// 			tmp.mangaMetaDefaults[key] = mangaMetaDefaults[key] as never;
// 			return tmp;
// 		});
// 	}
// });

// export function MangaMeta(id: number) {
// 	const MMeta = queryStore({
// 		client,
// 		query: getManga,
// 		variables: { id }
// 	});
// 	const store = writable(get(Meta).mangaMetaDefaults);

// 	MMeta.subscribe((queryResult) => {
// 		store.update((value) => {
// 			return extractMangaMeta(value, queryResult);
// 		});
// 	});

// 	function extractMangaMeta(
// 		newMeta: typeof mangaMetaDefaults,
// 		queryResult: OperationResultState<ResultOf<typeof getManga>>
// 	): typeof mangaMetaDefaults {
// 		const clonedStore = {
// 			...get(Meta).mangaMetaDefaults
// 		} as typeof mangaMetaDefaults;
// 		const metas = queryResult.data?.manga.meta || [];
// 		getObjectKeys(newMeta).forEach(
// 			<T extends keyof typeof mangaMetaDefaults>(key: T) => {
// 				const matchedMeta = metas.find(
// 					(meta) => meta.key.replace('VUI3_', '') === key
// 				);
// 				if (!matchedMeta) return;
// 				clonedStore[key] = JSON.parse(
// 					matchedMeta.value
// 				) as (typeof mangaMetaDefaults)[T];
// 			}
// 		);
// 		return clonedStore;
// 	}

// 	async function set(value: typeof mangaMetaDefaults) {
// 		for (const [key, val] of getObjectEntries(value)) {
// 			const jsonValue = JSON.stringify(val);
// 			const cacheKey = `VUI3_${key}`;
// 			const cachedValue = get(MMeta).data?.manga?.meta.find(
// 				(e) => e.key === cacheKey
// 			)?.value;

// 			if (jsonValue !== cachedValue) {
// 				try {
// 					//update early for instant UI updates
// 					store.update((vall) => {
// 						(vall[key] as unknown) = val;
// 						return vall;
// 					});

// 					const variables = { key: cacheKey, value: jsonValue, id };
// 					if (val !== get(Meta).mangaMetaDefaults[key]) {
// 						await client.mutation(setMangaMeta, variables);
// 					} else if (cachedValue !== undefined) {
// 						await client.mutation(deleteMangaMeta, variables);
// 					}
// 				} catch {}
// 			}
// 		}
// 	}

// 	async function update(
// 		func: (value: typeof mangaMetaDefaults) => typeof mangaMetaDefaults
// 	) {
// 		const value = get(store);
// 		const updatedValue = func(value);
// 		set(updatedValue);
// 	}

// 	return {
// 		subscribe: store.subscribe,
// 		set,
// 		update
// 	};
// }

class LocalStore<T> {
	value = $state<T>() as T;
	cleanup = () => {};

	constructor(key: string, value: T) {
		this.value = value;

		if (browser) {
			const item = localStorage.getItem(key);
			if (item) this.value = this.#deserialize(item);
		}
		this.cleanup = $effect.root(() => {
			$effect(() => {
				localStorage.setItem(key, this.#serialize(this.value));
			});
		});
	}

	#serialize(value: T): string {
		return JSON.stringify(value);
	}

	#deserialize(item: string): T {
		return JSON.parse(item);
	}
}

function localStore<T>(key: string, value: T) {
	return new LocalStore(key, value);
}

class GMState {
	private store = localStore<typeof trueDefaults>('GlobalMeta', trueDefaults);
	private runningMutations = false;
	private mutations: OperationResultSource<
		| OperationResult<
				ResultOf<typeof setGlobalMeta>,
				VariablesOf<typeof setGlobalMeta>
		  >
		| OperationResult<
				ResultOf<typeof deleteGlobalMeta>,
				VariablesOf<typeof deleteGlobalMeta>
		  >
	>[] = [];
	private unSub = () => {};
	constructor() {
		$effect.root(() => {
			const Meta = queryStore({
				client,
				query: metas
			});

			this.unSub = Meta.subscribe((queryResult) => {
				this.store.value = this.extractGlobalMeta(queryResult);
				if (queryResult.fetching) return;
				this.unSub();
			});
			$effect(() => {
				for (const key of getObjectKeys(trueDefaults)) {
					const stringValue = JSON.stringify(this.store.value[key]);
					const metaKey = `VUI3_g2_${key}`;
					const existingValue = get(Meta).data?.metas?.nodes.find(
						(e) => e.key === metaKey
					)?.value;

					if (stringValue !== existingValue) {
						const variables = { key: metaKey, value: stringValue };
						if (stringValue !== JSON.stringify(trueDefaults[key])) {
							this.mutations.push(client.mutation(setGlobalMeta, variables));
							continue;
						}
						if (existingValue !== undefined) {
							this.mutations.push(client.mutation(deleteGlobalMeta, variables));
							continue;
						}
						if (
							this.store.value[key] === undefined &&
							trueDefaults[key] !== undefined
						) {
							(this.store.value[key] as (typeof trueDefaults)[typeof key]) =
								trueDefaults[key];
						}
					}
				}
				this.startRunMutations();
			});
		});
	}

	private async startRunMutations() {
		if (this.runningMutations) return;
		this.runningMutations = true;
		while (this.mutations.length > 0) {
			const mutation = this.mutations.shift();
			await mutation?.toPromise();
		}
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
					(node) => node.key.replace('VUI3_', '') === key
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
	private pendingMutations: OperationResultSource<
		| OperationResult<
				ResultOf<typeof setMangaMeta>,
				VariablesOf<typeof setMangaMeta>
		  >
		| OperationResult<
				ResultOf<typeof deleteMangaMeta>,
				VariablesOf<typeof deleteMangaMeta>
		  >
	>[] = [];
	cleanup = () => {};

	constructor(id: number) {
		if (id != -1) this.id = id;
		this.cleanup = $effect.root(() => {
			$effect(() => {
				for (const key of getObjectKeys(
					untrack(() => {
						return $state.snapshot(gmState.value.mangaMetaDefaults);
					})
				)) {
					const serializedValue = JSON.stringify(this.store[key]);
					const metaKey = `VUI3_${key}`;
					const storedValue = untrack(() => {
						if (!this.MMeta) return;
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
								this.pendingMutations.push(
									client.mutation(setMangaMeta, mutationVariables)
								);
								return;
							}
							if (storedValue !== undefined) {
								this.pendingMutations.push(
									client.mutation(deleteMangaMeta, mutationVariables)
								);
								return;
							}
							if (
								this.store[key] === undefined &&
								gmState.value.mangaMetaDefaults[key] !== undefined
							) {
								(this.store[key] as (typeof this.store)[typeof key]) =
									gmState.value.mangaMetaDefaults[key];
							}
						});
					}
				}
				this.runPendingMutations();
			});
		});
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
		while (this.pendingMutations.length > 0) {
			const mutation = this.pendingMutations.shift();
			await mutation?.toPromise();
		}
		this.isRunningMutations = false;
	}

	private extractMangaMeta(
		queryResult: OperationResultState<ResultOf<typeof getManga>>
	): typeof mangaMetaDefaults {
		const clonedStore = $state.snapshot(this.store);
		const metas = queryResult.data?.manga.meta || [];
		getObjectKeys($state.snapshot(gmState.value.mangaMetaDefaults)).forEach(
			<T extends keyof typeof mangaMetaDefaults>(key: T) => {
				const matchedMeta = metas.find(
					(meta) => meta.key.replace('VUI3_', '') === key
				);
				if (!matchedMeta) {
					clonedStore[key] = $state.snapshot(gmState.value.mangaMetaDefaults)[
						key
					];
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

export const mmState = new MMState(-1);
