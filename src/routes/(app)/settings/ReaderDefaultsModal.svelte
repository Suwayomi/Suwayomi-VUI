<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import Slide from '$lib/components/Slide.svelte';
	import { gmState, Layout, Mode } from '$lib/simpleStores.svelte';

	import { enumKeys } from '$lib/util.svelte';
	import ModalTemplate from '$lib/components/ModalTemplate.svelte';
	const modalStore = getModalStore();
</script>

{#if $modalStore[0]}
	<ModalTemplate titleText="Reader Defaults">
		<Slide
			class="mt-1 p-1 outline-0 hover:variant-glass-surface"
			bind:checked={gmState.mangaMetaDefaults.Margins}
		>
			Page Margins
		</Slide>
		<Slide
			class="p-1 outline-0 hover:variant-glass-surface"
			bind:checked={gmState.mangaMetaDefaults.Scale}
		>
			Page Scale
		</Slide>
		<Slide
			class="p-1 outline-0 hover:variant-glass-surface"
			bind:checked={gmState.mangaMetaDefaults.SmoothScroll}
		>
			Smooth Scroll
		</Slide>
		{#if gmState.mangaMetaDefaults.ReaderMode !== Mode.Vertical}
			<Slide
				class="p-1 outline-0 hover:variant-glass-surface"
				bind:checked={gmState.mangaMetaDefaults.Offset}
			>
				Page Offset
			</Slide>
		{/if}
		<label class="pl-3">
			<span>Reader Mode</span>
			<select bind:value={gmState.mangaMetaDefaults.ReaderMode} class="select">
				{#each enumKeys(Mode) as value}
					<option {value}>{value}</option>
				{/each}
			</select>
		</label>
		<label class="mb-2 pl-3">
			<span>Navigation Layout</span>
			<select bind:value={gmState.mangaMetaDefaults.NavLayout} class="select">
				{#each enumKeys(Layout) as value}
					<option {value}>{value}</option>
				{/each}
			</select>
		</label>
		<Slide
			class="p-1 outline-0 hover:variant-glass-surface"
			bind:checked={gmState.mangaMetaDefaults.preLoadNextChapter}
		>
			preload Next Chapter
		</Slide>
		<Slide
			class="p-1 outline-0 hover:variant-glass-surface"
			bind:checked={gmState.mangaMetaDefaults.mobileFullScreenOnChapterPage}
		>
			mobile Full Screen On Chapter Page
		</Slide>
		<Slide
			class="p-1 outline-0 hover:variant-glass-surface"
			bind:checked={gmState.mangaMetaDefaults.doPageIndicator}
		>
			Chapter Page Indicator
		</Slide>
	</ModalTemplate>
{/if}
