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
	import { ChapterSort, ChapterTitle, Meta } from '$lib/simpleStores';
	import { enumKeys } from '$lib/util';
	import TriStateSlide from '$lib/components/TriStateSlide.svelte';
	import ModalTemplate from '$lib/components/ModalTemplate.svelte';
	import Slide from '$lib/components/Slide.svelte';
	const modalStore = getModalStore();
</script>

{#if $modalStore[0]}
	<ModalTemplate title="Manga Settings Defaults">
		<Slide
			bind:checked={$Meta.DownloadAllChaptersOnAddToLibrary}
			class="my-1 p-1 pl-2 hover:variant-glass-surface focus:outline-0"
		>
			Download all chapters when add manga to library
		</Slide>
		<Slide
			bind:checked={$Meta.DeleteAllChaptersOnRemoveFromLibrary}
			class="my-1 p-1 pl-2 hover:variant-glass-surface focus:outline-0"
		>
			Delete all chapters when remove manga from library
		</Slide>
		<Slide
			bind:checked={$Meta.RemoveChaptersFromDownloadQueueOnRemoveFromLibrary}
			class="my-1 p-1 pl-2 hover:variant-glass-surface focus:outline-0"
		>
			Remove chapters from download queue when remove manga from library
		</Slide>
		<h2 class="h4 mb-1 border-b border-surface-700">Filters</h2>
		<TriStateSlide
			bind:state={$Meta.mangaMetaDefaults.ChapterUnread}
			label={'Unread'}
			class="w-full p-1 pl-2 hover:variant-glass-surface focus:outline-0"
			labelClass="w-full"
		>
			<span>Unread</span>
		</TriStateSlide>
		<TriStateSlide
			bind:state={$Meta.mangaMetaDefaults.ChapterDownloaded}
			label={'Downloaded'}
			class="w-full p-1 pl-2 hover:variant-glass-surface focus:outline-0"
			labelClass="w-full"
		>
			<span>Downloaded</span>
		</TriStateSlide>
		<TriStateSlide
			bind:state={$Meta.mangaMetaDefaults.ChapterBookmarked}
			label={'Downloaded'}
			class="w-full p-1 pl-2 hover:variant-glass-surface focus:outline-0"
			labelClass="w-full"
		>
			<span>Bookmarked</span>
		</TriStateSlide>
		<h2 class="h4 mb-1 border-b border-surface-700">Sort</h2>
		<TriStateSlide
			triState={false}
			bind:checked={$Meta.mangaMetaDefaults.ChapterAsc}
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
					bind:group={$Meta.mangaMetaDefaults.ChapterSort}
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
			on:click|preventDefault|stopPropagation={() =>
				($Meta.mangaMetaDefaults.showMissingChapters =
					!$Meta.mangaMetaDefaults.showMissingChapters)}
		>
			<span>Show Missing Chapters</span>
			<SlideToggle
				name="slide"
				class="focus:outline-0"
				bind:checked={$Meta.mangaMetaDefaults.showMissingChapters}
			/>
		</button>
		<button
			class="flex w-full items-center justify-between rounded-full p-1 pl-2 hover:variant-glass-surface focus:outline-0"
			on:click|preventDefault|stopPropagation={() =>
				($Meta.mangaMetaDefaults.ChapterFetchUpload =
					!$Meta.mangaMetaDefaults.ChapterFetchUpload)}
		>
			<span>FetchDate/UploadDate</span>
			<SlideToggle
				name="slide"
				class="focus:outline-0"
				bind:checked={$Meta.mangaMetaDefaults.ChapterFetchUpload}
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
					bind:group={$Meta.mangaMetaDefaults.ChapterTitle}
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
