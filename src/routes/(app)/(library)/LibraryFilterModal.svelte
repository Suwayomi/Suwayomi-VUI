<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import TriStateSlide from '$lib/components/TriStateSlide.svelte';
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	import {
		RadioGroup,
		RadioItem,
		Tab,
		TabGroup,
		getModalStore,
		localStorageStore
	} from '@skeletonlabs/skeleton';
	import { Meta, display, sort } from '$lib/simpleStores';
	import { enumKeys } from '$lib/util';
	import Slide from '$lib/components/Slide.svelte';
	const modalStore = getModalStore();
	let tabSet = localStorageStore('libraryModalTabs', 0);
</script>

{#if $modalStore[0]}
	<div class="card w-modal space-y-4 rounded-lg p-0 shadow-xl">
		<TabGroup
			justify="justify-center"
			flex="flex"
			class="bg-surface-100-800-token w-full select-none rounded-t-lg focus:outline-0"
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
				<div
					class="flex h-full flex-row items-center justify-center focus:outline-0"
				>
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
				<div class="flex h-full flex-row items-center justify-center">
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
				<div class="flex h-full flex-row items-center justify-center">
					<IconWrapper name="mdi:television-guide" class="text-4xl" />
					<span>Display</span>
				</div>
			</Tab>
			<!-- Tab Panels --->
			<svelte:fragment slot="panel">
				<div class="mx-4 mb-4">
					{#if $tabSet === 0}
						<TriStateSlide
							bind:state={$Meta.Unread}
							label={'Unread'}
							class="w-full p-1 pl-2 hover:variant-glass-surface focus:outline-0"
							labelClass="w-full"
						>
							<span>Unread</span>
						</TriStateSlide>
						<TriStateSlide
							bind:state={$Meta.Downloaded}
							label={'Downloaded'}
							class="w-full p-1 pl-2 hover:variant-glass-surface focus:outline-0"
							labelClass="w-full"
						>
							<span>Downloaded</span>
						</TriStateSlide>
						<TriStateSlide
							bind:state={$Meta.Tracked}
							label={'Tracked'}
							class="w-full p-1 pl-2 hover:variant-glass-surface focus:outline-0"
							labelClass="w-full"
						>
							<span>Tracked</span>
						</TriStateSlide>
					{:else if $tabSet === 1}
						<TriStateSlide
							triState={false}
							bind:checked={$Meta.Asc}
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
							{#each enumKeys(sort) as value}
								<RadioItem
									bind:group={$Meta.Sort}
									class="focus:outline-0"
									name="justify"
									{value}
								>
									{value}
								</RadioItem>
							{/each}
						</RadioGroup>
					{:else if $tabSet === 2}
						<Slide
							bind:checked={$Meta.libraryCategoryTotalCounts}
							class="w-full p-1 pl-2 outline-0 hover:variant-glass-surface"
						>
							Category Total Counts
						</Slide>
						<Slide
							bind:checked={$Meta.downloadsBadge}
							class="w-full p-1 pl-2 outline-0 hover:variant-glass-surface"
							>Downloads Badge</Slide
						>
						<Slide
							bind:checked={$Meta.unreadBadge}
							class="w-full p-1 pl-2 outline-0 hover:variant-glass-surface"
							>Unread Badge</Slide
						>
						<RadioGroup
							rounded="rounded-container-token"
							background="bg-transparent"
							class="focus:outline-0"
							border="border-0"
							display="flex-col"
							active="variant-glass-primary"
						>
							{#each enumKeys(display) as value}
								<RadioItem
									bind:group={$Meta.Display}
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
