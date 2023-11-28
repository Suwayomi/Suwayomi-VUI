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
	<div class="card p-0 w-modal shadow-xl space-y-4 rounded-lg max-h-screen">
		<h1 class="h3 pt-4 pl-4">Reader Defaults</h1>
		<div class="pl-4 border-y border-surface-700">
			<div class="max-h-96 overflow-y-auto grid grid-cols-1 gap-1 pr-4">
				<Slide
					class="outline-0 p-1 hover:variant-glass-surface mt-1"
					bind:checked={$Meta.mangaMetaDefaults.Margins}
				>
					Page Margins
				</Slide>
				<Slide
					class="outline-0 p-1 hover:variant-glass-surface"
					bind:checked={$Meta.mangaMetaDefaults.Scale}
				>
					Page Scale
				</Slide>
				<Slide
					class="outline-0 p-1 hover:variant-glass-surface"
					bind:checked={$Meta.mangaMetaDefaults.SmoothScroll}
				>
					Smooth Scroll
				</Slide>
				{#if $Meta.mangaMetaDefaults.ReaderMode !== Mode.Vertical}
					<Slide
						class="outline-0 p-1 hover:variant-glass-surface"
						bind:checked={$Meta.mangaMetaDefaults.Offset}
					>
						Page Offset
					</Slide>
				{/if}
				<label class="pl-3">
					<span>Reader Mode</span>
					<select bind:value={$Meta.mangaMetaDefaults.ReaderMode} class="select">
						{#each enumKeys(Mode) as value}
							<option {value}>{value}</option>
						{/each}
					</select>
				</label>
				<label class="pl-3 mb-2">
					<span>Navigation Layout</span>
					<select bind:value={$Meta.mangaMetaDefaults.NavLayout} class="select">
						{#each enumKeys(Layout) as value}
							<option {value}>{value}</option>
						{/each}
					</select>
				</label>
				<Slide
					class="outline-0 p-1 hover:variant-glass-surface"
					bind:checked={$Meta.mangaMetaDefaults.preLoadNextChapter}
				>
					preload Next Chapter
				</Slide>
				<Slide
					class="outline-0 p-1 hover:variant-glass-surface"
					bind:checked={$Meta.mangaMetaDefaults.mobileFullScreenOnChapterPage}
				>
					mobile Full Screen On Chapter Page
				</Slide>
				<Slide
					class="outline-0 p-1 hover:variant-glass-surface"
					bind:checked={$Meta.mangaMetaDefaults.doPageIndicator}
				>
					Chapter Page Indicator
				</Slide>
			</div>
		</div>
		<div class="p-4" />
	</div>
{/if}
