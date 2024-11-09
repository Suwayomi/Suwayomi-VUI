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
import { writable } from 'svelte/store';
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

// do not make a key named "id" it will break the state
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

const metaKeyBase = 'VUI3_';

class LocalStore<T> {
	private val = $state<T>() as T;
	private key = '';

	constructor(key: string, value: T) {
		this.val = value;
		this.key = key;
		if (browser) {
			const item = localStorage.getItem(this.key);
			if (item) this.val = this.#deserialize(item);
		}
	}

	#serialize(value: T): string {
		return JSON.stringify(value);
	}

	#deserialize(item: string): T {
		return JSON.parse(item);
	}

	get value() {
		return this.val;
	}

	set value(value: T) {
		this.val = value;
		localStorage.setItem(this.key, this.#serialize(value));
	}
}

function localStore<T>(key: string, value: T) {
	return new LocalStore(key, value);
}

function GMState() {
	const store = localStore<typeof trueDefaults>('GlobalMeta', trueDefaults);
	let runningMutations = false;
	const mutations: Map<
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
	let unSub = () => {};
	const Meta = queryStore({
		client,
		query: metas
	});

	async function startRunMutations() {
		if (runningMutations) return;
		runningMutations = true;
		let prom: Promise<unknown> | undefined = undefined;
		while (mutations.size > 0) {
			const key = Array.from(mutations.keys())[0];
			const mutation = mutations.get(key);
			mutations.delete(key);
			prom = mutation?.toPromise();
			await prom;
		}
		await prom;
		runningMutations = false;
	}

	function extractGlobalMeta(
		queryResult: OperationResultState<ResultOf<typeof metas>>
	): typeof trueDefaults {
		const globalMetaCopy = $state.snapshot(store.value);
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
	unSub = Meta.subscribe((queryResult) => {
		store.value = extractGlobalMeta(queryResult);
		if (queryResult.fetching) return;
		unSub();
	});

	const ret = {} as typeof trueDefaults;

	getObjectKeys(trueDefaults).forEach((key) => {
		Object.defineProperty(ret, key, {
			get: function () {
				if (store.value[key] === undefined) {
					(store.value[key] as unknown) = trueDefaults[key];
				}
				return store.value[key];
			},
			set: function (value: (typeof trueDefaults)[typeof key]) {
				(store.value[key] as unknown) = value;
				const stringValue = JSON.stringify(value);
				if (stringValue !== JSON.stringify(trueDefaults[key])) {
					mutations.set(
						key,
						client.mutation(setGlobalMeta, {
							key: metaKeyBase + key,
							value: stringValue
						})
					);
					startRunMutations();
					return;
				}
				mutations.set(
					key,
					client.mutation(deleteGlobalMeta, { key: metaKeyBase + key })
				);
				startRunMutations();
			}
		});
	});

	return ret;
}

export const gmState = GMState();

function MMState() {
	let _id: number = -1;
	let store = $state<typeof mangaMetaDefaults>(gmState.mangaMetaDefaults);
	let unSub = () => {};
	let MMeta: OperationResultStore<ResultOf<typeof getManga>> | null = null;
	let isRunningMutations = false;
	const mutations: Map<
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
	async function runPendingMutations() {
		if (isRunningMutations) return;
		isRunningMutations = true;
		let prom: Promise<unknown> | undefined = undefined;
		while (mutations.size > 0) {
			const key = Array.from(mutations.keys())[0];
			const mutation = mutations.get(key);
			mutations.delete(key);
			prom = mutation?.toPromise();
			await prom;
		}
		await prom;
		isRunningMutations = false;
	}

	function extractMangaMeta(
		queryResult: OperationResultState<ResultOf<typeof getManga>>
	): typeof mangaMetaDefaults {
		const clonedStore = $state.snapshot(store);
		const metas = queryResult.data?.manga.meta || [];
		const Defaults = $state.snapshot(gmState.mangaMetaDefaults);
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

	const ret = {
		set id(val: number) {
			_id = val;
			unSub();
			MMeta = queryStore({
				client,
				query: getManga,
				variables: { id: val }
			});
			unSub = MMeta.subscribe((queryResult) => {
				store = extractMangaMeta(queryResult);
				if (queryResult.fetching) return;
				unSub();
			});
		},
		get id() {
			return _id;
		}
	} as typeof mangaMetaDefaults & { id: number };

	getObjectKeys(mangaMetaDefaults).forEach((key) => {
		Object.defineProperty(ret, key, {
			get: function () {
				if (store[key] === undefined) {
					(store[key] as unknown) = gmState.mangaMetaDefaults[key];
				}
				return store[key];
			},
			set: function (value: (typeof mangaMetaDefaults)[typeof key]) {
				(store[key] as unknown) = value;
				const serializedValue = JSON.stringify(value);
				if (
					serializedValue !== JSON.stringify(gmState.mangaMetaDefaults[key])
				) {
					mutations.set(
						key + _id,
						client.mutation(setMangaMeta, {
							key: metaKeyBase + key,
							value: serializedValue,
							id: _id
						})
					);
					runPendingMutations();
					return;
				}
				mutations.set(
					key + _id,
					client.mutation(deleteMangaMeta, {
						key: metaKeyBase + key,
						id: _id
					})
				);
				runPendingMutations();
			}
		});
	});

	return ret;
}

export const mmState = MMState();
