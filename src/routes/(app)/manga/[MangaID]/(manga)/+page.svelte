<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { AppBarData } from '$lib/MountTitleAction';
	import { getToastStore } from '$lib/components/Toast/stores';
	import {
		GetMangaDoc,
		fetchMangaChapters,
		fetchMangaInfo,
		getManga,
		type FetchMangaChaptersMutation,
		type FetchMangaInfoMutation
	} from '$lib/generated';
	import { ErrorhelpUntyped } from '$lib/util';
	import type { ApolloCache, FetchResult } from '@apollo/client';
	import type { PageData } from './$types';
	import InfoSide from './InfoSide.svelte';
	import MangaActions from './MangaActions.svelte';
	import ChaptersSide from './chaptersSide.svelte';
	import { MangaMeta } from '$lib/simpleStores';

	export let data: PageData;

	const mangaMeta = MangaMeta(data.MangaID);

	const toastStore = getToastStore();
	const manga = getManga({
		variables: { id: data.MangaID },
		fetchPolicy: 'cache-first',
		nextFetchPolicy: 'cache-only'
	});

	function fetchChaptersUpdater(
		cache: ApolloCache<unknown>,
		{ data }: Omit<FetchResult<FetchMangaChaptersMutation>, 'context'>
	) {
		if (!data) return;

		const magna = structuredClone($manga.data.manga);

		magna.chapters.totalCount = data.fetchChapters.chapters.length;
		magna.chapters.nodes = data.fetchChapters.chapters;

		cache.writeQuery({
			query: GetMangaDoc,
			variables: { id: magna.id },
			data: { manga: magna }
		});
	}

	function fetchInfoUpdater(
		cache: ApolloCache<unknown>,
		{ data }: Omit<FetchResult<FetchMangaInfoMutation>, 'context'>
	) {
		if (!data) return;

		const magna = structuredClone($manga.data.manga);

		magna.artist = data.fetchManga.manga.artist;
		magna.author = data.fetchManga.manga.author;
		magna.description = data.fetchManga.manga.description;
		magna.downloadCount = data.fetchManga.manga.downloadCount;
		magna.genre = data.fetchManga.manga.genre;
		magna.id = data.fetchManga.manga.id;
		magna.inLibrary = data.fetchManga.manga.inLibrary;
		magna.lastFetchedAt = data.fetchManga.manga.lastFetchedAt;
		magna.meta = data.fetchManga.manga.meta;
		magna.realUrl = data.fetchManga.manga.realUrl;
		magna.source = data.fetchManga.manga.source;
		magna.status = data.fetchManga.manga.status;
		magna.thumbnailUrl = data.fetchManga.manga.thumbnailUrl;
		magna.title = data.fetchManga.manga.title;
		magna.unreadCount = data.fetchManga.manga.unreadCount;

		cache.writeQuery({
			query: GetMangaDoc,
			variables: { id: magna.id },
			data: { manga: magna }
		});
	}

	async function fetchchapters() {
		await ErrorhelpUntyped(
			'Failed to refresh manga',
			toastStore,
			fetchMangaInfo({ variables: { id: data.MangaID }, update: fetchInfoUpdater }),
			fetchMangaChapters({
				variables: { id: data.MangaID },
				update: fetchChaptersUpdater
			})
		);
	}

	manga.subscribe((e) => {
		if (e.data.manga?.lastFetchedAt === '0') {
			fetchchapters();
		}
	});

	$: $manga.data.manga,
		AppBarData($manga.data.manga?.title || 'Manga', {
			component: MangaActions,
			props: {
				manga: $manga.data.manga,
				fetchchapters
			}
		});
</script>

<div class="block md:flex md:relative md:h-full">
	<InfoSide {manga} MangaID={data.MangaID} {mangaMeta} />
	<ChaptersSide manga={$manga} MangaID={data.MangaID} {mangaMeta} />
</div>
