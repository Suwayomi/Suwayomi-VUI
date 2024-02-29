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

	export let data: PageData;

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

	$: if ($source.data?.source?.displayName)
		AppBarData($source.data?.source.displayName);
</script>

{#if $Manga.fetching}
	<div class="yoy grid m-2 gap-2 {gridValues}">
		{#each new Array(30) as _}
			<div class="aspect-cover w-full">
				<div
					class="placeholder animate-pulse h-full
						{$Meta.Display === display.Compact && 'rounded-lg'}
						{$Meta.Display === display.Comfortable && 'rounded-none rounded-t-lg'}"
				/>
				{#if $Meta.Display === display.Comfortable}
					<div
						class="placeholder animate-pulse px-2 h-12 text-center rounded-none rounded-b-lg"
					/>
				{/if}
			</div>
		{/each}
	</div>
{:else if $Manga.error}
	<div class="white-space-pre-wrap">
		{JSON.stringify($Manga.error, null, 4)}
	</div>
{:else if $Manga.data}
	<div class="yoy grid {gridValues} gap-2 m-2">
		{#each $Manga.data.mangas.nodes as manga}
			<IntersectionObserver
				let:intersecting
				root={document.querySelector('#page') ?? undefined}
				top={400}
				bottom={400}
			>
				<div class="aspect-cover">
					{#if intersecting}
						<a
							href="/manga/{manga.id}"
							class="hover:opacity-70 cursor-pointer h-full"
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
										class="absolute bottom-0 left-0 right-0 variant-glass rounded-b-olg"
									>
										<div
											class="line-clamp-2 px-2 h-12 text-center"
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
										class="line-clamp-2 px-2 h-12 text-center"
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
					<div class="h-12" />
				{/if}
			</IntersectionObserver>
		{/each}
	</div>
{/if}
