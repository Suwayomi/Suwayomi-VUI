<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import Slide from '$lib/components/Slide.svelte';
	import { Layout, Meta, Mode } from '$lib/simpleStores';
	import { enumKeys } from '$lib/util';
	const modalStore = getModalStore();
</script>

{#if $modalStore[0]}
	<div class="card w-modal max-h-screen space-y-4 rounded-lg p-0 shadow-xl">
		<h1 class="h3 pl-4 pt-4">Reader Defaults</h1>
		<div class="border-y border-surface-700 pl-4">
			<div class="grid max-h-96 grid-cols-1 gap-1 overflow-y-auto pr-4">
				<Slide
					class="mt-1 p-1 outline-0 hover:variant-glass-surface"
					bind:checked={$Meta.mangaMetaDefaults.Margins}
				>
					Page Margins
				</Slide>
				<Slide
					class="p-1 outline-0 hover:variant-glass-surface"
					bind:checked={$Meta.mangaMetaDefaults.Scale}
				>
					Page Scale
				</Slide>
				<Slide
					class="p-1 outline-0 hover:variant-glass-surface"
					bind:checked={$Meta.mangaMetaDefaults.SmoothScroll}
				>
					Smooth Scroll
				</Slide>
				{#if $Meta.mangaMetaDefaults.ReaderMode !== Mode.Vertical}
					<Slide
						class="p-1 outline-0 hover:variant-glass-surface"
						bind:checked={$Meta.mangaMetaDefaults.Offset}
					>
						Page Offset
					</Slide>
				{/if}
				<label class="pl-3">
					<span>Reader Mode</span>
					<select
						bind:value={$Meta.mangaMetaDefaults.ReaderMode}
						class="select"
					>
						{#each enumKeys(Mode) as value}
							<option {value}>{value}</option>
						{/each}
					</select>
				</label>
				<label class="mb-2 pl-3">
					<span>Navigation Layout</span>
					<select bind:value={$Meta.mangaMetaDefaults.NavLayout} class="select">
						{#each enumKeys(Layout) as value}
							<option {value}>{value}</option>
						{/each}
					</select>
				</label>
				<Slide
					class="p-1 outline-0 hover:variant-glass-surface"
					bind:checked={$Meta.mangaMetaDefaults.preLoadNextChapter}
				>
					preload Next Chapter
				</Slide>
				<Slide
					class="p-1 outline-0 hover:variant-glass-surface"
					bind:checked={$Meta.mangaMetaDefaults.mobileFullScreenOnChapterPage}
				>
					mobile Full Screen On Chapter Page
				</Slide>
				<Slide
					class="p-1 outline-0 hover:variant-glass-surface"
					bind:checked={$Meta.mangaMetaDefaults.doPageIndicator}
				>
					Chapter Page Indicator
				</Slide>
			</div>
		</div>
		<div class="p-4" />
	</div>
{/if}
