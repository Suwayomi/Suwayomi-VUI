<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	import TriStateSlide from '$lib/components/TriStateSlide.svelte';
	import {
		RadioGroup,
		RadioItem,
		SlideToggle,
		Tab,
		TabGroup,
		getModalStore,
		localStorageStore
	} from '@skeletonlabs/skeleton';
	import { ChapterSort, ChapterTitle, MangaMeta } from '$lib/simpleStores';
	import { enumKeys } from '$lib/util';
	const modalStore = getModalStore();
	let tabSet = localStorageStore('libraryModalTabs', 0);
	export let MangaID: number;
	const mangaMeta = MangaMeta(MangaID);
</script>

{#if $modalStore[0]}
	<div class="card p-0 w-modal shadow-xl space-y-4 rounded-lg">
		<TabGroup
			justify="justify-center"
			flex="flex"
			class="bg-surface-100-800-token w-full rounded-t-lg select-none focus:outline-0"
			rounded="rounded-t-lg"
			active="border-b-2 variant-glass-primary"
			regionList="variant-soft-surface focus:outline-0"
			regionPanel="focus:outline-0"
		>
			<Tab
				class="w-1/3 focus:outline-0"
				regionTab="w-full focus:outline-0"
				bind:group={$tabSet}
				name="tab1"
				value={0}
			>
				<div class="flex flex-row justify-center items-center h-full focus:outline-0">
					<IconWrapper name="mdi:filter" class="text-4xl" />
					<span>Filter</span>
				</div>
			</Tab>
			<Tab
				class="w-1/3 focus:outline-0"
				regionTab="w-full focus:outline-0"
				bind:group={$tabSet}
				name="tab2"
				value={1}
			>
				<div class="flex flex-row justify-center items-center h-full">
					<IconWrapper name="mdi:sort" class="text-4xl" />
					<span>Sort</span>
				</div>
			</Tab>
			<Tab
				class="w-1/3 focus:outline-0"
				regionTab="w-full focus:outline-0"
				bind:group={$tabSet}
				name="tab3"
				value={2}
			>
				<div class="flex flex-row justify-center items-center h-full">
					<IconWrapper name="mdi:television-guide" class="text-4xl" />
					<span>Display</span>
				</div>
			</Tab>
			<!-- Tab Panels --->
			<svelte:fragment slot="panel">
				<div class="mx-4 mb-4">
					{#if $tabSet === 0}
						<TriStateSlide
							bind:state={$mangaMeta.ChapterUnread}
							label={'Unread'}
							class="w-full focus:outline-0 p-1 pl-2 hover:variant-glass-surface"
							labelclass="w-full"
						>
							<span>Unread</span>
						</TriStateSlide>
						<TriStateSlide
							bind:state={$mangaMeta.ChapterDownloaded}
							label={'Downloaded'}
							class="w-full focus:outline-0 p-1 pl-2 hover:variant-glass-surface"
							labelclass="w-full"
						>
							<span>Downloaded</span>
						</TriStateSlide>
						<TriStateSlide
							bind:state={$mangaMeta.ChapterBookmarked}
							label={'Downloaded'}
							class="w-full focus:outline-0 p-1 pl-2 hover:variant-glass-surface"
							labelclass="w-full"
						>
							<span>Bookmarked</span>
						</TriStateSlide>
					{:else if $tabSet === 1}
						<TriStateSlide
							tristat={false}
							bind:checked={$mangaMeta.ChapterAsc}
							label={'Ascending'}
							class="w-full focus:outline-0 p-1 pl-2 hover:variant-glass-surface"
							labelclass="w-full"
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
									bind:group={$mangaMeta.ChapterSort}
									class="focus:outline-0"
									name="justify"
									{value}
								>
									{value}
								</RadioItem>
							{/each}
						</RadioGroup>
					{:else}
						<button
							class="w-full focus:outline-0 p-1 pl-2 flex justify-between hover:variant-glass-surface rounded-full items-center"
							on:click|preventDefault|stopPropagation={() =>
								($mangaMeta.ChapterFetchUpload = !$mangaMeta.ChapterFetchUpload)}
						>
							<span>FetchDate/UploadDate</span>
							<SlideToggle
								name="slide"
								class="focus:outline-0"
								bind:checked={$mangaMeta.ChapterFetchUpload}
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
									bind:group={$mangaMeta.ChapterTitle}
									class="focus:outline-0"
									name="justify"
									{value}
								>
									{value}
								</RadioItem>
							{/each}
						</RadioGroup>
					{/if}
				</div>
			</svelte:fragment>
		</TabGroup>
	</div>
{/if}
