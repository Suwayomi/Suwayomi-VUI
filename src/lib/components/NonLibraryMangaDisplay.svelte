<!--
 Copyright (c) 2025 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { display, gmState } from '$lib/simpleStores.svelte';
	import MangaCard from './ImageCard.svelte';
	import type { SvelteSet } from 'svelte/reactivity';

	interface Props {
		manga: {
			id: number;
			title: string;
			inLibrary?: boolean;
			thumbnailUrl: string | null;
		};
		intersecting: SvelteSet<unknown>;
	}

	let { manga, intersecting }: Props = $props();
</script>

{#if intersecting.has(manga.id)}
	<a
		href="/manga/{manga.id}"
		class="h-full cursor-pointer hover:opacity-70"
		tabindex="-1"
	>
		<MangaCard
			thumbnailUrl={manga.thumbnailUrl ?? ''}
			title={manga.title}
			rounded="{gmState.value.Display === display.Compact && 'rounded-lg'}
                        {gmState.value.Display === display.Comfortable &&
				'rounded-none rounded-t-lg'}"
		>
			{#if gmState.value.Display === display.Compact}
				<div
					class="variant-glass absolute bottom-0 left-0 right-0 rounded-b-olg"
				>
					<div class="line-clamp-2 h-12 px-2 text-center" title={manga.title}>
						{manga.title}
					</div>
				</div>
			{/if}
			{#if manga.inLibrary}
				<div class="variant-filled-primary badge absolute right-1 top-1">
					In Library
				</div>
			{/if}
		</MangaCard>
		{#if gmState.value.Display === display.Comfortable}
			<div class="variant-glass-surface rounded-b-lg">
				<div class="line-clamp-2 h-12 px-2 text-center" title={manga.title}>
					{manga.title}
				</div>
			</div>
		{/if}
	</a>
{:else}
	<div class="aspect-cover w-full"></div>
	{#if gmState.value.Display === display.Comfortable}
		<div class="h-12"></div>
	{/if}
{/if}
