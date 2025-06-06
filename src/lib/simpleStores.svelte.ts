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
	setCategoryMeta,
	setGlobalMeta,
	setMangaMeta
} from './gql/Mutations';
import { getCategory, getManga, metas } from './gql/Queries';
import { client } from './gql/graphqlClient';
import type { presetConst } from './presets';
import { getObjectKeys, type TriState } from './util.svelte';
import { browser } from '$app/environment';
import { untrack } from 'svelte';
import type { CssClasses } from '@skeletonlabs/skeleton';

export const toastStore = writable<ToastStore | null>(null);

type Themes = (typeof presetConst)[number]['name'];

export const ChapterTitle = {
	'Source Title': 'Source Title',
	'Chapter Number': 'Chapter Number'
} as const;

export type TChapterTitle = keyof typeof ChapterTitle;

export const ChapterSort = {
	Source: 'Source',
	'Fetched Date': 'Fetched Date',
	'Upload Date': 'Upload Date'
} as const;

export type TChapterSort = keyof typeof ChapterSort;

export const Mode = {
	Vertical: 'Vertical',
	single: 'single',
	RTL: 'RTL',
	LTR: 'LTR'
} as const;

export type TMode = keyof typeof Mode;

export const Layout = {
	L: 'L',
	RAL: 'RAL',
	Kindle: 'Kindle',
	Edge: 'Edge'
} as const;

export type TLayout = keyof typeof Layout;

export const sort = {
	Unread: 'Unread',
	Alphabetical: 'Alphabetical',
	Artist: 'Artist',
	Author: 'Author',
	ID: 'ID',
	Added: 'Latest Added',
	Read: 'Latest Read',
	Fetched: 'Latest Fetched',
	Uploaded: 'Latest Uploaded',
	Random: 'Random'
} as const;

export type TSort = keyof typeof sort;

export const display = {
	Compact: 'Compact',
	Comfortable: 'Comfortable'
	// List: 'List' // WIP
} as const;

export type TDisplay = keyof typeof display;

// do not make a key named "id" it will break the state
const mangaMetaDefaults = {
	ChapterUnread: 'intermediate' as TriState,
	ChapterDownloaded: 'intermediate' as TriState,
	ChapterBookmarked: 'intermediate' as TriState,
	ChapterSort: ChapterSort.Source as TChapterSort,
	ChapterAsc: false,
	ChapterFetchUpload: false,
	ChapterTitle: ChapterTitle['Source Title'] as TChapterTitle,
	Margins: false,
	Scale: false,
	Offset: false,
	SmoothScroll: true,
	ReaderMode: Mode.Vertical as TMode,
	NavLayout: Layout.L as TLayout,
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
	Display: display.Compact as TDisplay,
	Sort: 'ID' as TSort,
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
	RemoveChaptersFromDownloadQueueOnRemoveFromLibrary: false,
	SourceFilter: [] as string[],
	migrateDownloadNew: true,
	migratedoChapters: true,
	migratedoCategories: true,
	migratedoTracking: true,
	migratedoNotes: true,
	migratedeleteDownloaded: true,
	highlightMangadexDmca: false
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
	private store = localStore('GlobalMeta', trueDefaults);
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
				if (queryResult.fetching) return;
				this.store.value = this.extractGlobalMeta(queryResult);
				this.fixOldTriStates();
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
		if (this.store.value === val) return;
		this.store.value = val;
	}
}

export const gmState = new GMState();

class MMState {
	#id: number = -1;
	#store = $state<typeof mangaMetaDefaults>(gmState.value.mangaMetaDefaults);
	#unSub = () => {};
	#MMeta: OperationResultStore<ResultOf<typeof getManga>> | null = null;
	#isRunningMutations = false;
	#mutations: Map<
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
	#cleanup = () => {};

	constructor() {
		this.#cleanup = $effect.root(() => {
			$effect(() => {
				for (const key of getObjectKeys(
					untrack(() => {
						return $state.snapshot(gmState.value.mangaMetaDefaults);
					})
				)) {
					const serializedValue = JSON.stringify(this.#store[key]);
					const metaKey = metaKeyBase + key;
					const storedValue = untrack(() => {
						if (!this.#MMeta) return;
						this.traverse(this.#store, gmState.value.mangaMetaDefaults);
						return get(this.#MMeta).data?.manga?.meta.find(
							(e) => e.key === metaKey
						)?.value;
					});
					if (serializedValue !== storedValue) {
						const mutationVariables = {
							key: metaKey,
							value: serializedValue,
							id: this.#id
						};
						untrack(() => {
							if (
								serializedValue !==
								JSON.stringify(gmState.value.mangaMetaDefaults[key])
							) {
								this.#mutations.set(
									key + this.#id,
									client.mutation(setMangaMeta, mutationVariables)
								);
								return;
							}
							if (storedValue !== undefined) {
								this.#mutations.set(
									key + this.#id,
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
		return this.#store;
	}

	set value(val: typeof mangaMetaDefaults) {
		if (this.#store === val) return;
		this.#store = val;
	}

	set id(val: number) {
		if (this.#id === val) return;
		this.#id = val;
		this.#unSub();
		this.#MMeta = queryStore({
			client,
			query: getManga,
			variables: { id: val }
		});
		this.#unSub = this.#MMeta.subscribe((queryResult) => {
			if (queryResult.fetching) return;
			this.#store = this.extractMangaMeta(queryResult);
			this.#unSub();
		});
	}

	private async runPendingMutations() {
		if (this.#isRunningMutations) return;
		this.#isRunningMutations = true;
		let prom: Promise<unknown> | undefined = undefined;
		while (this.#mutations.size > 0) {
			const key = Array.from(this.#mutations.keys())[0];
			const mutation = this.#mutations.get(key);
			this.#mutations.delete(key);
			prom = mutation?.toPromise();
			await prom;
		}
		await prom;
		this.#isRunningMutations = false;
	}

	private extractMangaMeta(
		queryResult: OperationResultState<ResultOf<typeof getManga>>
	): typeof mangaMetaDefaults {
		const clonedStore = $state.snapshot(this.#store);
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

	get cleanup() {
		return this.#cleanup;
	}
}

export const mmState = new MMState();

class categoryMetaStoreSingle<T> {
	private key: string;
	value = $state<T>() as T;
	private id = -1;
	private serializer: json<T> = JSON;
	private writeOver = false;
	private item!: LocalStore<T>;

	constructor(key: string, value: T, serializer: json<T> = JSON) {
		this.key = key;
		this.value = value;
		this.serializer = serializer;
		this.setId(0);
		$effect.root(() => {
			$effect(() => {
				const _ = this.value;
				untrack(() => {
					if (this.serialize(this.value) === this.serialize(this.item.value))
						return;
					this.writeOver = false;
					this.item.value = $state.snapshot(this.value) as T;
					client
						.mutation(setCategoryMeta, {
							id: this.id,
							key: this.StoreKey(),
							value: this.serialize(this.value)
						})
						.toPromise();
				});
			});
			return;
		});
	}

	private StoreKey() {
		return `VUI3_${this.id}_${this.key}`;
	}

	public setId(id: number) {
		if (this.id === id) return;
		this.id = id;
		if (!browser) return;
		const key = this.StoreKey();
		this.item = localStore(key, this.value, this.serializer);
		this.value = $state.snapshot(this.item.value) as T;
		this.writeOver = true;
		const data = queryStore({
			client,
			query: getCategory,
			variables: { id }
		});
		let unSubscribe = () => {};
		new Promise((resolve) => {
			unSubscribe = data.subscribe((e) => {
				if (!e.data?.category) return;
				const val = e.data.category.meta.find(
					(meta) => meta.key === key
				)?.value;

				if (
					val &&
					this.writeOver &&
					val !== this.serialize(this.value) &&
					id === this.id
				) {
					this.value = this.deserialize(val);
				}
				resolve(true);
			});
			setTimeout(() => {
				resolve(true);
			}, 10000);
		}).then(() => {
			unSubscribe();
		});
	}

	private serialize(value: T): string {
		return this.serializer.stringify(value);
	}

	private deserialize(item: string): T {
		return this.serializer.parse(item);
	}
}

function CategoryMetaStore<T>(
	key: string,
	value: T,
	serializer: json<T> = JSON
) {
	return new categoryMetaStoreSingle<T>(key, value, serializer);
}

const CategoryMetaStoreItems = {
	Unread: CategoryMetaStore(
		'Unread',
		'intermediate' as 'on' | 'intermediate' | 'off'
	),
	UnreadUseDefault: CategoryMetaStore<boolean>('UnreadDefault', true),
	Downloaded: CategoryMetaStore(
		'Downloaded',
		'intermediate' as 'on' | 'intermediate' | 'off'
	),
	DownloadedUseDefault: CategoryMetaStore<boolean>('DownloadedDefault', true),
	Tracked: CategoryMetaStore(
		'Tracked',
		'intermediate' as 'on' | 'intermediate' | 'off'
	),
	TrackedUseDefault: CategoryMetaStore<boolean>('TrackedDefault', true),
	Ascending: CategoryMetaStore('Ascending', false as boolean),
	AscendingUseDefault: CategoryMetaStore<boolean>('AscendingDefault', true),
	Sort: CategoryMetaStore('Sort', 'ID' as keyof typeof sort),
	SortUseDefault: CategoryMetaStore<boolean>('SortDefault', true),
	TotalCounts: CategoryMetaStore('TotalCounts', true),
	TotalCountsUseDefault: CategoryMetaStore<boolean>('TotalCountsDefault', true),
	DownloadsBadge: CategoryMetaStore('DownloadsBadge', true),
	DownloadsBadgeUseDefault: CategoryMetaStore<boolean>(
		'DownloadsBadgeDefault',
		true
	),
	UnreadBadge: CategoryMetaStore('UnreadBadge', true),
	UnreadBadgeUseDefault: CategoryMetaStore<boolean>('UnreadBadgeDefault', true),
	Display: CategoryMetaStore('Display', display.Compact),
	DisplayUseDefault: CategoryMetaStore<boolean>('DisplayDefault', true),
	SourceFilter: CategoryMetaStore('SourceFilter', [] as string[]),
	SourceFilterUseDefault: CategoryMetaStore<boolean>(
		'SourceFilterDefault',
		true
	)
} as const;

export function categoryFilterMetas(id: number) {
	Object.values(CategoryMetaStoreItems).forEach((e) => e.setId(id));
	return CategoryMetaStoreItems;
}

export function categoryFilterMetasReadOnly(id: number) {
	const {
		Unread,
		UnreadUseDefault,
		Downloaded,
		DownloadedUseDefault,
		Tracked,
		TrackedUseDefault,
		Ascending,
		AscendingUseDefault,
		Sort,
		SortUseDefault,
		TotalCounts,
		TotalCountsUseDefault,
		DownloadsBadge,
		DownloadsBadgeUseDefault,
		UnreadBadge,
		UnreadBadgeUseDefault,
		Display,
		DisplayUseDefault,
		SourceFilter,
		SourceFilterUseDefault
	} = untrack(() => categoryFilterMetas(id));

	let value = {
		Unread: UnreadUseDefault.value ? gmState.value.Unread : Unread.value,
		Downloaded: DownloadedUseDefault.value
			? gmState.value.Downloaded
			: Downloaded.value,
		Tracked: TrackedUseDefault.value ? gmState.value.Tracked : Tracked.value,
		Ascending: AscendingUseDefault.value ? gmState.value.Asc : Ascending.value,
		Sort: SortUseDefault.value ? gmState.value.Sort : Sort.value,
		TotalCounts: TotalCountsUseDefault.value
			? gmState.value.libraryCategoryTotalCounts
			: TotalCounts.value,
		DownloadsBadge: DownloadsBadgeUseDefault.value
			? gmState.value.downloadsBadge
			: DownloadsBadge.value,
		UnreadBadge: UnreadBadgeUseDefault.value
			? gmState.value.unreadBadge
			: UnreadBadge.value,
		Display: DisplayUseDefault.value ? gmState.value.Display : Display.value,
		SourceFilter: SourceFilterUseDefault.value
			? gmState.value.SourceFilter
			: SourceFilter.value
	};

	$effect(() => {
		value = {
			Unread: UnreadUseDefault.value ? gmState.value.Unread : Unread.value,
			Downloaded: DownloadedUseDefault.value
				? gmState.value.Downloaded
				: Downloaded.value,
			Tracked: TrackedUseDefault.value ? gmState.value.Tracked : Tracked.value,
			Ascending: AscendingUseDefault.value
				? gmState.value.Asc
				: Ascending.value,
			Sort: SortUseDefault.value ? gmState.value.Sort : Sort.value,
			TotalCounts: TotalCountsUseDefault.value
				? gmState.value.libraryCategoryTotalCounts
				: TotalCounts.value,
			DownloadsBadge: DownloadsBadgeUseDefault.value
				? gmState.value.downloadsBadge
				: DownloadsBadge.value,
			UnreadBadge: UnreadBadgeUseDefault.value
				? gmState.value.unreadBadge
				: UnreadBadge.value,
			Display: DisplayUseDefault.value ? gmState.value.Display : Display.value,
			SourceFilter: SourceFilterUseDefault.value
				? gmState.value.SourceFilter
				: SourceFilter.value
		};
	});

	// no idea why $derived doesnt work here but $effect does

	// let value = $derived({
	// 	Unread: UnreadUseDefault.value ? gmState.value.Unread : Unread.value,
	// 	Downloaded: DownloadedUseDefault.value
	// 		? gmState.value.Downloaded
	// 		: Downloaded.value,
	// 	Tracked: TrackedUseDefault.value ? gmState.value.Tracked : Tracked.value,
	// 	Ascending: AscendingUseDefault.value ? gmState.value.Asc : Ascending.value,
	// 	Sort: SortUseDefault.value ? gmState.value.Sort : Sort.value,
	// 	TotalCounts: TotalCountsUseDefault.value
	// 		? gmState.value.libraryCategoryTotalCounts
	// 		: TotalCounts.value,
	// 	DownloadsBadge: DownloadsBadgeUseDefault.value
	// 		? gmState.value.downloadsBadge
	// 		: DownloadsBadge.value,
	// 	UnreadBadge: UnreadBadgeUseDefault.value
	// 		? gmState.value.unreadBadge
	// 		: UnreadBadge.value,
	// 	Display: DisplayUseDefault.value ? gmState.value.Display : Display.value,
	// 	SourceFilter: SourceFilterUseDefault.value
	// 		? gmState.value.SourceFilter
	// 		: SourceFilter.value
	// })

	return { value };
}

class rotation {
	private v: 0 | 90 | 180 | 270 = $state(0);
	private rotateClassMap: Record<number, CssClasses> = {
		0: 'w-dvw h-dvh',
		90: 'w-[100dvh] h-[100dvw] overflow-hidden rotate-90',
		180: 'w-dvw h-dvh overflow-hidden rotate-180',
		270: 'w-[100dvh] h-[100dvw] overflow-hidden rotate-[270deg]'
	};
	public gridValues = $state(
		'xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-8 3xl:grid-cols-10'
	);
	constructor() {
		switch (localStorage.getItem('rotation')) {
			case '0':
				this.value = 0;
				break;
			case '90':
				this.value = 90;
				break;
			case '180':
				this.value = 180;
				break;
			case '270':
				this.value = 270;
				break;
			default:
				this.value = 0;
		}
	}
	public left() {
		if (this.v === 0) {
			this.value = 270;
		} else {
			this.value -= 90;
		}
	}
	public right() {
		if (this.v === 270) {
			this.value = 0;
		} else {
			this.value += 90;
		}
	}
	private get value() {
		return this.v;
	}
	private set value(v: 0 | 90 | 180 | 270) {
		this.v = v;
		localStorage.setItem('rotation', v.toString());
		document.body.className = this.rotateClassMap[v];
		if (v === 0 || v === 180)
			this.gridValues =
				'xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-8 3xl:grid-cols-10';
		else
			this.gridValues =
				'h-xs:grid-cols-2 h-sm:grid-cols-3 h-md:grid-cols-4 h-lg:grid-cols-5 h-xl:grid-cols-7 h-2xl:grid-cols-8 h-3xl:grid-cols-10';
	}
}

export const rotate = new rotation();
