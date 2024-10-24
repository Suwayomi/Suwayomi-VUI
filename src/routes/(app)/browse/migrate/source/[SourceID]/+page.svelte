<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { AppBarData } from '$lib/MountTitleAction';
	import IntersectionObserver from '$lib/components/IntersectionObserver.svelte';
	import MangaCard from '$lib/components/MangaCard.svelte';
	import { Meta, display } from '$lib/simpleStores';
	import { gridValues } from '$lib/util';
	import { getContextClient, queryStore } from '@urql/svelte';
	import type { PageData } from './$types';
	import {
		sourceMigrationManga,
		sourceMigrationSource
	} from '$lib/gql/Queries';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	AppBarData(data.SourceID);
	const client = getContextClient();
	const Manga = queryStore({
		client,
		query: sourceMigrationManga,
		variables: { sourceId: data.SourceID }
	});
	const source = queryStore({
		client,
		query: sourceMigrationSource,
		variables: { sourceId: data.SourceID }
	});

	$effect(() => {
		if ($source.data?.source?.displayName)
			AppBarData($source.data?.source.displayName);
	});
</script>

{#if $Manga.fetching}
	<div class="yoy m-2 grid gap-2 {gridValues}">
		{#each new Array(30) as _}
			<div class="aspect-cover w-full">
				<div
					class="placeholder h-full animate-pulse
						{$Meta.Display === display.Compact && 'rounded-lg'}
						{$Meta.Display === display.Comfortable && 'rounded-none rounded-t-lg'}"
				></div>
				{#if $Meta.Display === display.Comfortable}
					<div
						class="placeholder h-12 animate-pulse rounded-none rounded-b-lg px-2 text-center"
					></div>
				{/if}
			</div>
		{/each}
	</div>
{:else if $Manga.error}
	<div class="white-space-pre-wrap">
		{JSON.stringify($Manga.error, null, 4)}
	</div>
{:else if $Manga.data}
	<div class="yoy grid {gridValues} m-2 gap-2">
		{#each $Manga.data.mangas.nodes as manga}
			<IntersectionObserver
				root={document.querySelector('#page') ?? undefined}
				top={400}
				bottom={400}
			>
				{#snippet children({ intersecting })}
					<div class="aspect-cover">
						{#if intersecting}
							<a
								href="/manga/{manga.id}"
								class="h-full cursor-pointer hover:opacity-70"
								tabindex="-1"
							>
								<MangaCard
									thumbnailUrl={manga.thumbnailUrl ?? ''}
									title={manga.title}
									rounded="{$Meta.Display === display.Compact && 'rounded-lg'}
										{$Meta.Display === display.Comfortable && 'rounded-none rounded-t-lg'}"
								>
									{#if $Meta.Display === display.Compact}
										<div
											class="variant-glass absolute bottom-0 left-0 right-0 rounded-b-olg"
										>
											<div
												class="line-clamp-2 h-12 px-2 text-center"
												title={manga.title}
											>
												{manga.title}
											</div>
										</div>
									{/if}
								</MangaCard>
								{#if $Meta.Display === display.Comfortable}
									<div class="variant-glass-surface rounded-b-lg">
										<div
											class="line-clamp-2 h-12 px-2 text-center"
											title={manga.title}
										>
											{manga.title}
										</div>
									</div>
								{/if}
							</a>
						{/if}
					</div>
					{#if !intersecting && $Meta.Display === display.Comfortable}
						<div class="h-12"></div>
					{/if}
				{/snippet}
			</IntersectionObserver>
		{/each}
	</div>
{/if}
