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
			...data.fetchManga.manga
		};

		console.log(magna, $manga.data.manga, data.fetchManga.manga);

		cache.writeQuery({
			query: GetMangaDoc,
			variables: { id: magna.id },
			data: { manga: magna }
		});
	}

	async function fetchChapters() {
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

	$: if ($manga.data.manga?.lastFetchedAt === '0') {
		fetchChapters();
	}

	$: $manga.data.manga,
		AppBarData($manga.data.manga?.title || 'Manga', {
			component: MangaActions,
			props: {
				manga: $manga.data.manga,
				fetchChapters
			}
		});
</script>

<div class="block md:flex md:relative md:h-full">
	<InfoSide {manga} MangaID={data.MangaID} {mangaMeta} />
	<ChaptersSide manga={$manga} MangaID={data.MangaID} {mangaMeta} />
</div>
