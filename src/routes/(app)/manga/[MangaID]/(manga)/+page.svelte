<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { AppBarData } from '$lib/MountTitleAction';
	import { ErrorHelpUntyped } from '$lib/util';
	import type { PageData } from './$types';
	import InfoSide from './InfoSide.svelte';
	import MangaActions from './MangaActions.svelte';
	import ChaptersSide from './chaptersSide.svelte';
	import { MangaMeta } from '$lib/simpleStores';
	import { getContextClient, queryStore } from '@urql/svelte';
	import { getManga } from '$lib/gql/Queries';
	import { fetchMangaChapters, fetchMangaInfo } from '$lib/gql/Mutations';

	export let data: PageData;

	const mangaMeta = MangaMeta(data.MangaID);

	const client = getContextClient();
	const manga = queryStore({
		client,
		query: getManga,
		variables: { id: data.MangaID }
	});

	async function fetchChapters() {
		await ErrorHelpUntyped(
			'Failed to refresh manga',
			client.mutation(fetchMangaInfo, { id: data.MangaID }).toPromise(),
			client.mutation(fetchMangaChapters, { id: data.MangaID }).toPromise()
		);
	}

	$: if ($manga.data?.manga?.lastFetchedAt === '0') {
		fetchChapters();
	}

	$: $manga.data?.manga,
		AppBarData($manga.data?.manga?.title || 'Manga', {
			component: MangaActions,
			props: {
				manga: $manga.data?.manga,
				fetchChapters
			}
		});
</script>

<div class="block md:relative md:flex md:h-full">
	<InfoSide {manga} MangaID={data.MangaID} />
	<ChaptersSide {manga} MangaID={data.MangaID} {mangaMeta} />
</div>
