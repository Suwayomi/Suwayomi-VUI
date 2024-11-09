<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import {
		RadioGroup,
		RadioItem,
		SlideToggle,
		getModalStore
	} from '@skeletonlabs/skeleton';
	import { ChapterSort, ChapterTitle, gmState } from '$lib/simpleStores.svelte';

	import { enumKeys } from '$lib/util.svelte';
	import TriStateSlide from '$lib/components/TriStateSlide.svelte';
	import ModalTemplate from '$lib/components/ModalTemplate.svelte';
	import Slide from '$lib/components/Slide.svelte';
	const modalStore = getModalStore();
</script>

{#if $modalStore[0]}
	<ModalTemplate titleText="Manga Settings Defaults">
		<Slide
			bind:checked={gmState.DownloadAllChaptersOnAddToLibrary}
			class="my-1 p-1 pl-2 hover:variant-glass-surface focus:outline-0"
		>
			Download all chapters when add manga to library
		</Slide>
		<Slide
			bind:checked={gmState.DeleteAllChaptersOnRemoveFromLibrary}
			class="my-1 p-1 pl-2 hover:variant-glass-surface focus:outline-0"
		>
			Delete all chapters when remove manga from library
		</Slide>
		<Slide
			bind:checked={gmState.RemoveChaptersFromDownloadQueueOnRemoveFromLibrary}
			class="my-1 p-1 pl-2 hover:variant-glass-surface focus:outline-0"
		>
			Remove chapters from download queue when remove manga from library
		</Slide>
		<h2 class="h4 mb-1 border-b border-surface-700">Filters</h2>
		<TriStateSlide
			bind:state={gmState.mangaMetaDefaults.ChapterUnread}
			label={'Unread'}
			class="w-full p-1 pl-2 hover:variant-glass-surface focus:outline-0"
			labelClass="w-full"
		>
			<span>Unread</span>
		</TriStateSlide>
		<TriStateSlide
			bind:state={gmState.mangaMetaDefaults.ChapterDownloaded}
			label={'Downloaded'}
			class="w-full p-1 pl-2 hover:variant-glass-surface focus:outline-0"
			labelClass="w-full"
		>
			<span>Downloaded</span>
		</TriStateSlide>
		<TriStateSlide
			bind:state={gmState.mangaMetaDefaults.ChapterBookmarked}
			label={'Downloaded'}
			class="w-full p-1 pl-2 hover:variant-glass-surface focus:outline-0"
			labelClass="w-full"
		>
			<span>Bookmarked</span>
		</TriStateSlide>
		<h2 class="h4 mb-1 border-b border-surface-700">Sort</h2>
		<TriStateSlide
			triState={false}
			bind:checked={gmState.mangaMetaDefaults.ChapterAsc}
			label={'Ascending'}
			class="w-full p-1 pl-2 hover:variant-glass-surface focus:outline-0"
			labelClass="w-full"
		>
			<span>Ascending</span>
		</TriStateSlide>
		<RadioGroup
			rounded="rounded-container-token"
			background="bg-transparent"
			class="focus:outline-0"
			border="border-0"
			display="flex-col"
			active="variant-glass-primary"
		>
			{#each enumKeys(ChapterSort) as value}
				<RadioItem
					bind:group={gmState.mangaMetaDefaults.ChapterSort}
					class="focus:outline-0"
					name="justify"
					{value}
				>
					{value}
				</RadioItem>
			{/each}
		</RadioGroup>
		<h2 class="h4 mb-1 border-b border-surface-700">Display</h2>
		<button
			class="flex w-full items-center justify-between rounded-full p-1 pl-2 hover:variant-glass-surface focus:outline-0"
			onclick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				gmState.mangaMetaDefaults.showMissingChapters =
					!gmState.mangaMetaDefaults.showMissingChapters;
			}}
		>
			<span>Show Missing Chapters</span>
			<SlideToggle
				name="slide"
				class="focus:outline-0"
				bind:checked={gmState.mangaMetaDefaults.showMissingChapters}
			/>
		</button>
		<button
			class="flex w-full items-center justify-between rounded-full p-1 pl-2 hover:variant-glass-surface focus:outline-0"
			onclick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				gmState.mangaMetaDefaults.ChapterFetchUpload =
					!gmState.mangaMetaDefaults.ChapterFetchUpload;
			}}
		>
			<span>FetchDate/UploadDate</span>
			<SlideToggle
				name="slide"
				class="focus:outline-0"
				bind:checked={gmState.mangaMetaDefaults.ChapterFetchUpload}
			/>
		</button>
		<RadioGroup
			rounded="rounded-container-token"
			background="bg-transparent"
			class="focus:outline-0"
			border="border-0"
			display="flex-col"
			active="variant-glass-primary"
		>
			{#each enumKeys(ChapterTitle) as value}
				<RadioItem
					bind:group={gmState.mangaMetaDefaults.ChapterTitle}
					class="focus:outline-0"
					name="justify"
					{value}
				>
					{value}
				</RadioItem>
			{/each}
		</RadioGroup>
	</ModalTemplate>
{/if}
