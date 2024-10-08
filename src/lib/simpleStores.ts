// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { localStorageStore } from '@skeletonlabs/skeleton';
import { queryStore, type OperationResultState } from '@urql/svelte';
import type { ResultOf } from '$lib/gql/graphql';
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
import type { TriState } from './util';

function getObjectEntries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
	return Object.entries(obj) as [keyof T, T[keyof T]][];
}
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
type mangaMeta = typeof mangaMetaDefaults;

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

type globalMeta = typeof trueDefaults;

function GlobalMeta() {
	const Meta = queryStore({
		client,
		query: metas
	});
	const store = localStorageStore('GlobalMeta', trueDefaults);

	if (get(store).mangaUpdatesTracking === undefined) {
		store.update((newStore) => {
			newStore.mangaUpdatesTracking = trueDefaults.mangaUpdatesTracking;
			return newStore;
		});
	}

	Meta.subscribe((queryResult) => {
		store.update((value) => {
			return extractGlobalMeta(value, queryResult);
		});
	});

	function extractGlobalMeta(
		value: typeof trueDefaults,
		queryResult: OperationResultState<ResultOf<typeof metas>>
	): globalMeta {
		const globalMetaCopy = { ...get(store) } as globalMeta;
		const metas = queryResult.data?.metas?.nodes || [];
		getObjectKeys(value).forEach(<T extends keyof globalMeta>(key: T) => {
			const foundMeta = metas.find(
				(node) => node.key.replace('VUI3_', '') === key
			);
			if (foundMeta) {
				globalMetaCopy[key] = JSON.parse(foundMeta.value) as globalMeta[T];
			}
		});
		return globalMetaCopy;
	}

	async function set(val: globalMeta) {
		for (const [key, value] of getObjectEntries(val)) {
			const stringValue = JSON.stringify(value);
			const metaKey = `VUI3_${key}`;
			const existingValue = get(Meta).data?.metas?.nodes.find(
				(e) => e.key === metaKey
			)?.value;

			if (stringValue !== existingValue) {
				try {
					//update early for instant UI updates
					store.update((vall) => {
						(vall[key] as unknown) = value;
						return vall;
					});

					const variables = { key: metaKey, value: stringValue };
					if (stringValue !== JSON.stringify(trueDefaults[key])) {
						await client.mutation(setGlobalMeta, variables).toPromise();
					} else if (existingValue !== undefined) {
						await client.mutation(deleteGlobalMeta, variables).toPromise();
					}
				} catch {}
			}
		}
	}

	async function update(func: (value: globalMeta) => globalMeta) {
		const currentStore = get(store);
		const updatedStore = func(currentStore);
		set(updatedStore);
	}

	return {
		subscribe: store.subscribe,
		set,
		update
	};
}

export const Meta = GlobalMeta();

getObjectKeys(mangaMetaDefaults).forEach((key) => {
	if (get(Meta).mangaMetaDefaults[key] === undefined) {
		Meta.update((old) => {
			const tmp = old;
			tmp.mangaMetaDefaults[key] = mangaMetaDefaults[key] as never;
			return tmp;
		});
	}
});

export function MangaMeta(id: number) {
	const MMeta = queryStore({
		client,
		query: getManga,
		variables: { id }
	});
	const store = writable(get(Meta).mangaMetaDefaults);

	MMeta.subscribe((queryResult) => {
		store.update((value) => {
			return extractMangaMeta(value, queryResult);
		});
	});

	function extractMangaMeta(
		newMeta: mangaMeta,
		queryResult: OperationResultState<ResultOf<typeof getManga>>
	): mangaMeta {
		const clonedStore = { ...get(Meta).mangaMetaDefaults } as mangaMeta;
		const metas = queryResult.data?.manga.meta || [];
		getObjectKeys(newMeta).forEach(<T extends keyof mangaMeta>(key: T) => {
			const matchedMeta = metas.find(
				(meta) => meta.key.replace('VUI3_', '') === key
			);
			if (!matchedMeta) return;
			clonedStore[key] = JSON.parse(matchedMeta.value) as mangaMeta[T];
		});
		return clonedStore;
	}

	async function set(value: mangaMeta) {
		for (const [key, val] of getObjectEntries(value)) {
			const jsonValue = JSON.stringify(val);
			const cacheKey = `VUI3_${key}`;
			const cachedValue = get(MMeta).data?.manga?.meta.find(
				(e) => e.key === cacheKey
			)?.value;

			if (jsonValue !== cachedValue) {
				try {
					//update early for instant UI updates
					store.update((vall) => {
						(vall[key] as unknown) = val;
						return vall;
					});

					const variables = { key: cacheKey, value: jsonValue, id };
					if (val !== get(Meta).mangaMetaDefaults[key]) {
						await client.mutation(setMangaMeta, variables);
					} else if (cachedValue !== undefined) {
						await client.mutation(deleteMangaMeta, variables);
					}
				} catch {}
			}
		}
	}

	async function update(func: (value: mangaMeta) => mangaMeta) {
		const value = get(store);
		const updatedValue = func(value);
		set(updatedValue);
	}

	return {
		subscribe: store.subscribe,
		set,
		update
	};
}
