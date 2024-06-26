<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import IconButton from '$lib/components/IconButton.svelte';
	import Slide from '$lib/components/Slide.svelte';
	import { enumKeys } from '$lib/util';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { ViewNav, chapterTitle, mangaTitle } from './chapterStores';
	import { Layout, MangaMeta, Mode } from '$lib/simpleStores';
	import { onMount } from 'svelte';
	const drawerStore = getDrawerStore();
	const mangaMeta = MangaMeta($drawerStore.meta.id);
	onMount(() => {
		if (
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent
			) &&
			$mangaMeta.mobileFullScreenOnChapterPage
		) {
			document.exitFullscreen();
		}
		return () => {
			if (
				/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
					navigator.userAgent
				) &&
				$mangaMeta.mobileFullScreenOnChapterPage
			) {
				document.documentElement.requestFullscreen();
			}
		};
	});
</script>

{#if mangaMeta}
	<div class="flex flex-col p-4">
		<div class="mb-4 flex justify-end border-b border-surface-500 pb-4">
			<IconButton
				tabindex={999}
				name="mdi:chevron-left"
				height="h-16"
				on:click={() => {
					history.back();
					drawerStore.close();
				}}
			/>
		</div>
		<h1 class="h2 my-2 line-clamp-3 pl-4">{$mangaTitle}</h1>
		<h2 class="h3 mt-4 border-y border-surface-500 p-4">{$chapterTitle}</h2>
		<div class="my-2 flex flex-col space-y-2">
			<Slide
				tabindex={0}
				class="p-1 hover:variant-glass-surface"
				bind:checked={$mangaMeta.Margins}
			>
				Page Margins
			</Slide>
			<Slide
				class="p-1 hover:variant-glass-surface"
				bind:checked={$mangaMeta.Scale}
			>
				Page Scale
			</Slide>
			<Slide
				class="p-1 hover:variant-glass-surface"
				bind:checked={$mangaMeta.SmoothScroll}
			>
				Smooth Scroll
			</Slide>
			{#if $mangaMeta.ReaderMode !== Mode.Vertical}
				<Slide
					class="p-1 hover:variant-glass-surface"
					bind:checked={$mangaMeta.Offset}
				>
					Page Offset
				</Slide>
			{/if}
			<label class="pl-3">
				<span>Reader Mode</span>
				<select bind:value={$mangaMeta.ReaderMode} class="select">
					{#each enumKeys(Mode) as value}
						<option {value}>{value}</option>
					{/each}
				</select>
			</label>
			<Slide class="p-1 hover:variant-glass-surface" bind:checked={$ViewNav}>
				View Navigation Layout
			</Slide>
			<label class="pl-3">
				<span>Navigation Layout</span>
				<select bind:value={$mangaMeta.NavLayout} class="select">
					{#each enumKeys(Layout) as value}
						<option {value}>{value}</option>
					{/each}
				</select>
			</label>
		</div>
	</div>
{/if}
