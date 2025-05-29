<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { actionState } from '$lib/MountTitleAction.svelte';

	import { queryState } from '$lib/util.svelte';
	import { getContextClient } from '@urql/svelte';
	import type { PageData } from './$types';
	import {
		sourceMigrationManga,
		sourceMigrationSource
	} from '$lib/gql/Queries';
	import {
		IntersectionObserverAction,
		MakeSimpleCallback
	} from '$lib/actions/IntersectionObserver.svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import NonLibraryMangaDisplay from '$lib/components/NonLibraryMangaDisplay.svelte';
	import FakeMangaItem from '$lib/components/FakeMangaItem.svelte';
	import { rotate } from '$lib/simpleStores.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	actionState.AppBarData(data.SourceID);
	const client = getContextClient();
	const Manga = queryState({
		client,
		query: sourceMigrationManga,
		variables: { sourceId: data.SourceID }
	});
	const source = queryState({
		client,
		query: sourceMigrationSource,
		variables: { sourceId: data.SourceID }
	});

	$effect(() => {
		if (source.data?.source?.displayName)
			actionState.AppBarData(source.data?.source.displayName);
	});
	let intersecting: SvelteSet<number> = $state(new SvelteSet());
</script>

{#if Manga.fetching}
	<div class="yoy m-2 grid gap-2 {rotate.gridValues}">
		<FakeMangaItem active={true} count={30} />
	</div>
{:else if Manga.error}
	<div class="white-space-pre-wrap">
		{JSON.stringify(Manga.error, null, 4)}
	</div>
{:else if Manga.data}
	<div class="yoy grid {rotate.gridValues} m-2 gap-2">
		{#each Manga.data.mangas.nodes as manga}
			<div
				use:IntersectionObserverAction={{
					root: document.querySelector('#page') ?? undefined,
					rootMargin: `400px 0px 400px 0px`,
					callback: MakeSimpleCallback(intersecting, manga.id)
				}}
				class="aspect-cover"
			>
				<NonLibraryMangaDisplay {manga} {intersecting} />
			</div>
		{/each}
	</div>
{/if}
