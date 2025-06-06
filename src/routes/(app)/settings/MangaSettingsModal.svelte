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

	import { enumEntries } from '$lib/util.svelte';
	import Switch from '$lib/components/switch.svelte';
	import ModalTemplate from '$lib/components/ModalTemplate.svelte';
	import Slide from '$lib/components/Slide.svelte';
	import ThreeStateSwitchCustom from '$lib/components/ThreeStateSwitchCustom.svelte';
	const modalStore = getModalStore();
</script>

{#if $modalStore[0]}
	<ModalTemplate titleText="Manga Settings Defaults">
		<Slide
			bind:checked={gmState.value.DownloadAllChaptersOnAddToLibrary}
			class="my-1 p-1 pl-2 hover:variant-glass-surface focus:outline-0"
		>
			Download all chapters when add manga to library
		</Slide>
		<Slide
			bind:checked={gmState.value.DeleteAllChaptersOnRemoveFromLibrary}
			class="my-1 p-1 pl-2 hover:variant-glass-surface focus:outline-0"
		>
			Delete all chapters when remove manga from library
		</Slide>
		<Slide
			bind:checked={
				gmState.value.RemoveChaptersFromDownloadQueueOnRemoveFromLibrary
			}
			class="my-1 p-1 pl-2 hover:variant-glass-surface focus:outline-0"
		>
			Remove chapters from download queue when remove manga from library
		</Slide>
		<h2 class="h4 mb-1 border-b border-surface-700">Filters</h2>
		<ThreeStateSwitchCustom
			bind:state={gmState.value.mangaMetaDefaults.ChapterUnread}
			label={'Unread'}
			class="w-full p-1 pl-2 hover:variant-glass-surface focus:outline-0"
			labelClass="w-full"
		>
			<span>Unread</span>
		</ThreeStateSwitchCustom>
		<ThreeStateSwitchCustom
			bind:state={gmState.value.mangaMetaDefaults.ChapterDownloaded}
			label={'Downloaded'}
			class="w-full p-1 pl-2 hover:variant-glass-surface focus:outline-0"
			labelClass="w-full"
		>
			<span>Downloaded</span>
		</ThreeStateSwitchCustom>
		<ThreeStateSwitchCustom
			bind:state={gmState.value.mangaMetaDefaults.ChapterBookmarked}
			label={'Downloaded'}
			class="w-full p-1 pl-2 hover:variant-glass-surface focus:outline-0"
			labelClass="w-full"
		>
			<span>Bookmarked</span>
		</ThreeStateSwitchCustom>
		<h2 class="h4 mb-1 border-b border-surface-700">Sort</h2>
		<Switch
			triState={false}
			bind:checked={gmState.value.mangaMetaDefaults.ChapterAsc}
			label={'Ascending'}
			class="w-full p-1 pl-2 hover:variant-glass-surface focus:outline-0"
			labelClass="w-full"
		>
			<span>Ascending</span>
		</Switch>
		<RadioGroup
			rounded="rounded-container-token"
			background="bg-transparent"
			class="focus:outline-0"
			border="border-0"
			display="flex-col"
			active="variant-glass-primary"
		>
			{#each enumEntries(ChapterSort) as [value, _]}
				<RadioItem
					bind:group={gmState.value.mangaMetaDefaults.ChapterSort}
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
				gmState.value.mangaMetaDefaults.showMissingChapters =
					!gmState.value.mangaMetaDefaults.showMissingChapters;
			}}
		>
			<span>Show Missing Chapters</span>
			<SlideToggle
				name="slide"
				class="focus:outline-0"
				bind:checked={gmState.value.mangaMetaDefaults.showMissingChapters}
			/>
		</button>
		<button
			class="flex w-full items-center justify-between rounded-full p-1 pl-2 hover:variant-glass-surface focus:outline-0"
			onclick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				gmState.value.mangaMetaDefaults.ChapterFetchUpload =
					!gmState.value.mangaMetaDefaults.ChapterFetchUpload;
			}}
		>
			<span>FetchDate/UploadDate</span>
			<SlideToggle
				name="slide"
				class="focus:outline-0"
				bind:checked={gmState.value.mangaMetaDefaults.ChapterFetchUpload}
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
			{#each enumEntries(ChapterTitle) as [value, _]}
				<RadioItem
					bind:group={gmState.value.mangaMetaDefaults.ChapterTitle}
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
