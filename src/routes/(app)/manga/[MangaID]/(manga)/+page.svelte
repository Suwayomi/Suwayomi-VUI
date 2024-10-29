<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { AppBarData } from '$lib/MountTitleAction';
	import { ErrorHelpUntyped } from '$lib/util.svelte';
	import type { PageData } from './$types';
	import InfoSide from './InfoSide.svelte';
	import MangaActions from './MangaActions.svelte';
	import ChaptersSide from './chaptersSide.svelte';
	import { mmState } from '$lib/simpleStores.svelte';
	import { getContextClient } from '@urql/svelte';
	import { fetchMangaChapters, fetchMangaInfo } from '$lib/gql/Mutations';
	import { untrack } from 'svelte';
	import { manga, setMangaId } from './mangaStores.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	mmState.id = data.MangaID;
	const client = getContextClient();
	setMangaId(data.MangaID);

	async function fetchChapters() {
		await ErrorHelpUntyped(
			'Failed to refresh manga',
			client.mutation(fetchMangaInfo, { id: data.MangaID }).toPromise(),
			client.mutation(fetchMangaChapters, { id: data.MangaID }).toPromise()
		);
	}

	$effect(() => {
		if (manga.value?.data?.manga?.lastFetchedAt === '0') {
			untrack(fetchChapters);
		}
	});

	$effect(() => {
		AppBarData(manga.value?.data?.manga?.title || 'Manga', {
			component: MangaActions,
			props: {
				fetchChapters
			}
		});
	});
</script>

<div class="block md:relative md:flex md:h-full">
	<InfoSide MangaID={data.MangaID} />
	<ChaptersSide MangaID={data.MangaID} />
</div>
