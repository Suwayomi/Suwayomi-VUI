// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { get, writable } from 'svelte/store';
import { localStorageStore } from '@skeletonlabs/skeleton';
import {
	metas,
	MetasDoc,
	setGlobalMeta,
	type MetasQuery,
	deleteGlobalMeta,
	deleteMangaMeta,
	setMangaMeta,
	getManga,
	GetMangaDoc,
	type GetMangaQuery
} from './generated';
import type { presetConst } from './presets';
import type { ApolloCache } from '@apollo/client';
import { cache } from './apollo';
import { getObjectEntries, getObjectKeys, type TriState } from './util';
import type { ApolloQueryResult } from '@apollo/client';
import type { ToastStore } from './components/Toast/types';

export const toastStore = writable<ToastStore | null>();

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
	doPageIndicator: false,
	mangaUpdatesSeriesID: null as null | number
};
type mangaMeta = typeof mangaMetaDefaults;

export enum sort {
	Unread = 'Unread',
	Alphabetical = 'Alphabetical',
	'Last Read' = 'Last Read',
	ID = 'ID'
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
	mangaMetaDefaults,
	downloadsBadge: true,
	unreadBadge: true,
	mangaUpdatesTracking: {
		enabled: false,
		username: '',
		password: '',
		Authorization: ''
	}
};

type globalMeta = typeof trueDefaults;

function GlobalMetaUpdater(cache: ApolloCache<unknown>, key: string, value: string) {
	const metasData = structuredClone(
		cache.readQuery<MetasQuery>({
			query: MetasDoc
		})
	);
	if (!metasData) return;
	const filteredNodes = metasData.metas.nodes.filter((e) => e.key !== key);
	const updatedNode = {
		key,
		value
	};

	const updatedMetas = {
		...metas,
		nodes: [...filteredNodes, updatedNode]
	};

	cache.writeQuery({
		query: MetasDoc,
		data: { metas: updatedMetas }
	});
}

function GlobalMeta() {
	const Meta = metas({});
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
		queryResult: ApolloQueryResult<MetasQuery>
	): globalMeta {
		const globalMetaCopy = { ...get(store) } as globalMeta;
		const metas = queryResult.data?.metas?.nodes || [];
		getObjectKeys(value).forEach(<T extends keyof globalMeta>(key: T) => {
			const foundMeta = metas.find((node) => node.key.replace('VUI3_', '') === key);
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
			const existingValue = get(Meta).data.metas?.nodes.find((e) => e.key === metaKey)?.value;

			if (stringValue !== existingValue) {
				try {
					GlobalMetaUpdater(cache, metaKey, stringValue);

					const variables = { key: metaKey, value: stringValue };
					const update = (a: ApolloCache<unknown>) => GlobalMetaUpdater(a, metaKey, stringValue);

					if (stringValue !== JSON.stringify(trueDefaults[key])) {
						await setGlobalMeta({ variables, update });
					} else if (existingValue !== undefined) {
						await deleteGlobalMeta({ variables, update });
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

function MangaMetaUpdater(cache: ApolloCache<unknown>, key: string, value: string, id: number) {
	const query = GetMangaDoc;
	const { manga } = {
		...cache.readQuery<GetMangaQuery>({
			query,
			variables: { id }
		})
	};
	if (!manga) return;

	const updatedMeta = manga.meta.filter((e) => e.key !== key);
	updatedMeta.push({
		key,
		value
	});

	const updatedManga = { ...manga, meta: updatedMeta };

	cache.writeQuery({
		query,
		data: { manga: updatedManga },
		variables: { id }
	});
}

export function MangaMeta(id: number) {
	const MMeta = getManga({ variables: { id } });
	const store = writable(get(Meta).mangaMetaDefaults);

	if (get(store).mangaUpdatesSeriesID === undefined) {
		store.update((n) => {
			n.mangaUpdatesSeriesID = mangaMetaDefaults.mangaUpdatesSeriesID;
			return n;
		});
	}

	MMeta.subscribe((queryResult) => {
		store.update((value) => {
			return extractMangaMeta(value, queryResult);
		});
	});

	function extractMangaMeta(
		newMeta: mangaMeta,
		queryResult: ApolloQueryResult<GetMangaQuery>
	): mangaMeta {
		const clonedStore = { ...get(store) } as mangaMeta;
		const metas = queryResult.data.manga?.meta || [];
		getObjectKeys(newMeta).forEach(<T extends keyof mangaMeta>(key: T) => {
			const matchedMeta = metas.find((meta) => meta.key.replace('VUI3_', '') === key);
			if (!matchedMeta) return;
			clonedStore[key] = JSON.parse(matchedMeta.value) as mangaMeta[T];
		});
		return clonedStore;
	}

	async function set(value: mangaMeta) {
		for (const [key, val] of getObjectEntries(value)) {
			const jsonValue = JSON.stringify(val);
			const cacheKey = `VUI3_${key}`;
			const cachedValue = get(MMeta).data.manga?.meta.find((e) => e.key === cacheKey)?.value;

			if (jsonValue !== cachedValue) {
				try {
					MangaMetaUpdater(cache, cacheKey, jsonValue, id);

					const variables = { key: cacheKey, value: jsonValue, id };

					if (val !== get(Meta).mangaMetaDefaults[key]) {
						await setMangaMeta({ variables });
					} else if (cachedValue !== undefined) {
						await deleteMangaMeta({ variables });
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
