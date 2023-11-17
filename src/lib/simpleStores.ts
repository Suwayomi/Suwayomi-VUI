import { get, writable, type Writable } from 'svelte/store';
import { localStorageStore } from '@skeletonlabs/skeleton';
import type { ComponentType } from 'svelte';
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
import type { TriState } from './util';

export type ComponentWritable<T> =
	| {
			component: ComponentType;
			props?: Record<string, unknown>;
	  }
	| T;

type Themes = (typeof presetConst)[number]['name'];

export const title: Writable<string> = writable('loading...');
export const action: Writable<ComponentWritable<null>> = writable(null);

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
	doPageIndicator: false
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
	unreadbadge: true
};

type globalMeta = typeof trueDefaults;

function GlobalMetaUpdator(cache: ApolloCache<unknown>, key: string, value: string) {
	const { metas: tmp } = structuredClone(
		cache.readQuery({
			query: MetasDoc
		})
	) as MetasQuery;
	tmp.nodes = tmp.nodes.filter((e) => e.key !== key);
	tmp.nodes.push({
		key,
		value
	});
	cache.writeQuery({
		query: MetasDoc,
		data: { metas: tmp }
	});
}

function GlobalMeta() {
	const Meta = metas({});
	const store = localStorageStore('GlobalMeta', trueDefaults);

	Meta.subscribe((e) => {
		store.update((n) => {
			const Ncopy = structuredClone(get(store)) as { [key: string]: unknown };
			(Object.keys(n) as (keyof globalMeta)[]).forEach((ee) => {
				const tmp = e.data.metas?.nodes.find((k) => k.key.replace('VUI3_', '') === ee);
				if (!tmp) return;
				Ncopy[ee] = JSON.parse(tmp.value);
			});
			return Ncopy as globalMeta;
		});
	});

	async function set(val: globalMeta) {
		(Object.entries(val) as [keyof globalMeta, unknown][]).forEach(async (entry) => {
			const value = JSON.stringify(entry[1]);
			const key = `VUI3_${entry[0]}`;
			const tmp = get(Meta).data.metas?.nodes.find((e) => e.key === key)?.value;
			if (value !== tmp)
				try {
					//update before waiting
					GlobalMetaUpdator(cache, key, value);
					if (value !== JSON.stringify(trueDefaults[entry[0]])) {
						//set if not the truedefault value
						await setGlobalMeta({
							variables: { key, value },
							//update after to keep in sync
							update: (a) => GlobalMetaUpdator(a, key, value)
						});
					} else if (tmp !== undefined) {
						//delete if not already undefined
						await deleteGlobalMeta({
							variables: { key: key },
							//update after to keep in sync
							update: (a) => GlobalMetaUpdator(a, key, value)
						});
					}
				} catch {}
		});
	}

	async function update(func: (value: globalMeta) => globalMeta) {
		set(func(get(store)));
	}

	return {
		subscribe: store.subscribe,
		set,
		update
	};
}

export const Meta = GlobalMeta();

function MangaMetaUpdator(cache: ApolloCache<unknown>, key: string, value: string, id: number) {
	const { manga } = structuredClone(
		cache.readQuery({
			query: GetMangaDoc,
			variables: { id }
		})
	) as GetMangaQuery;
	manga.meta = manga.meta.filter((e) => e.key !== key);
	manga.meta.push({
		key,
		value
	});
	cache.writeQuery({
		query: GetMangaDoc,
		data: { manga },
		variables: { id }
	});
}

export function MangaMeta(id: number) {
	const MMeta = getManga({ variables: { id } });
	const store = writable(get(Meta).mangaMetaDefaults);

	MMeta.subscribe((e) => {
		store.update((n) => {
			const Ncopy = structuredClone(get(store)) as { [key: string]: unknown };
			(Object.keys(n) as (keyof mangaMeta)[]).forEach((ee) => {
				const tmp = e.data.manga?.meta.find((k) => k.key.replace('VUI3_', '') === ee);
				if (!tmp) return;
				Ncopy[ee] = JSON.parse(tmp.value);
			});
			return Ncopy as mangaMeta;
		});
	});

	async function set(value: mangaMeta) {
		(Object.entries(value) as [keyof mangaMeta, unknown][]).forEach(async (entry) => {
			const value = JSON.stringify(entry[1]);
			const key = `VUI3_${entry[0]}`;
			const tmp = get(MMeta).data.manga?.meta.find((e) => e.key === key)?.value;
			if (value !== tmp)
				try {
					//update before waiting
					MangaMetaUpdator(cache, key, value, id);
					if (entry[1] !== get(Meta).mangaMetaDefaults[entry[0]]) {
						//set if not the truedefault value
						await setMangaMeta({
							variables: { key, value, id }
							//update after to keep in sync
							// update: (a) => MangaMetaUpdator(a, key, value, id)
						});
					} else if (tmp !== undefined) {
						//delete if not already undefined
						await deleteMangaMeta({
							variables: { key, id }
							//update after to keep in sync
							// update: (a) => MangaMetaUpdator(a, key, value, id)
						});
					}
				} catch {}
		});
	}

	async function update(func: (value: mangaMeta) => mangaMeta) {
		set(func(get(store)));
	}

	return {
		subscribe: store.subscribe,
		set,
		update
	};
}
