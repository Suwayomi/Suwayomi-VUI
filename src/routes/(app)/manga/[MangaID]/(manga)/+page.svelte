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
	import { ErrorHelpUntyped } from '$lib/util';
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

		const magna2 = {
			...$manga.data.manga,
			chapters: {
				nodes: data.fetchChapters.chapters,
				totalCount: data.fetchChapters.chapters.length
			}
		};

		console.log(magna2.chapters, $manga.data.manga.chapters.nodes);

		cache.writeQuery({
			query: GetMangaDoc,
			variables: { id: magna2.id },
			data: { manga: magna2 }
		});
	}

	function fetchInfoUpdater(
		cache: ApolloCache<unknown>,
		{ data }: Omit<FetchResult<FetchMangaInfoMutation>, 'context'>
	) {
		if (!data) return;

		const magna = {
			...$manga.data.manga,
			artist: data.fetchManga.manga.artist,
			author: data.fetchManga.manga.author,
			description: data.fetchManga.manga.description,
			downloadCount: data.fetchManga.manga.downloadCount,
			genre: data.fetchManga.manga.genre,
			id: data.fetchManga.manga.id,
			inLibrary: data.fetchManga.manga.inLibrary,
			lastFetchedAt: data.fetchManga.manga.lastFetchedAt,
			meta: data.fetchManga.manga.meta,
			realUrl: data.fetchManga.manga.realUrl,
			source: data.fetchManga.manga.source,
			status: data.fetchManga.manga.status,
			thumbnailUrl: data.fetchManga.manga.thumbnailUrl,
			title: data.fetchManga.manga.title,
			unreadCount: data.fetchManga.manga.unreadCount
		};

		cache.writeQuery({
			query: GetMangaDoc,
			variables: { id: magna.id },
			data: { manga: magna }
		});
	}

	async function fetchchapters() {
		await ErrorHelpUntyped(
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
