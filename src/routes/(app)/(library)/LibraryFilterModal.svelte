<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import Switch from '$lib/components/switch.svelte';
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	import {
		RadioGroup,
		RadioItem,
		Tab,
		TabGroup,
		getModalStore,
		localStorageStore
	} from '@skeletonlabs/skeleton';
	import {
		categoryFilterMetas,
		display,
		gmState,
		sort
	} from '$lib/simpleStores.svelte';

	import { enumEntries } from '$lib/util.svelte';
	import Slide from '$lib/components/Slide.svelte';
	import ThreeStateSwitchCustom from '$lib/components/ThreeStateSwitchCustom.svelte';
	const modalStore = getModalStore();
	let tabSetArch = localStorageStore('libraryModalTabsArch', 0);
	let tabSet = localStorageStore('libraryModalTabs', 0);
	type props = {
		tab: number;
	};
	let { tab }: props = $props();
	const {
		unread,
		Downloaded,
		Tracked,
		Ascending,
		sortOptions,
		libraryCategoryTotalCounts,
		downloadsBadge,
		unreadBadge,
		displayOptions,
		unreadUseDefault,
		DownloadedUseDefault,
		TrackedUseDefault,
		AscendingUseDefault,
		sortOptionsUseDefault,
		libraryCategoryTotalCountsUseDefault,
		downloadsBadgeUseDefault,
		unreadBadgeUseDefault,
		displayOptionsUseDefault
	} = categoryFilterMetas(tab);
</script>

{#if $modalStore[0]}
	<div class="card w-modal rounded-lg p-0 shadow-xl">
		<TabGroup
			justify="justify-center"
			flex="flex"
			class="bg-surface-100-800-token w-full select-none !space-y-1 rounded-t-lg focus:outline-0"
			rounded="rounded-t-lg"
			active="border-b-2 variant-glass-primary"
			regionList="variant-soft-surface focus:outline-0 rounded-t-lg"
			regionPanel="focus:outline-0"
		>
			<Tab
				class="w-1/2 focus:outline-0"
				regionTab="w-full focus:outline-0"
				bind:group={$tabSetArch}
				name="tab0"
				value={0}
			>
				<div
					class="flex h-full flex-row items-center justify-center focus:outline-0"
				>
					<IconWrapper name="mdi:filter" class="text-4xl" />
					<span>Per Category</span>
				</div>
			</Tab>
			<Tab
				class="w-1/2 focus:outline-0"
				regionTab="w-full focus:outline-0"
				bind:group={$tabSetArch}
				name="tab1"
				value={1}
			>
				<div
					class="flex h-full flex-row items-center justify-center focus:outline-0"
				>
					<IconWrapper name="mdi:filter" class="text-4xl" />
					<span>Default</span>
				</div>
			</Tab>
			<svelte:fragment slot="panel">
				<div class="">
					{#if $tabSetArch === 0}
						<!-- per category -->
						<TabGroup
							justify="justify-center"
							flex="flex"
							class="bg-surface-100-800-token w-full select-none focus:outline-0"
							rounded=""
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
										<ThreeStateSwitchCustom
											title="shift click to toggle per or default"
											onclick={(e: MouseEvent) => {
												if (e.shiftKey) {
													e.preventDefault();
													e.stopPropagation();
													unreadUseDefault.value = !unreadUseDefault.value;
												}
											}}
											bind:state={unread.value}
											label={'Unread'}
											class="w-full p-1 pl-2 hover:variant-glass-surface focus:outline-0 
											{unreadUseDefault.value && 'opacity-20'}"
											labelClass="w-full flex-1"
										>
											<span>Unread</span>
										</ThreeStateSwitchCustom>
										<ThreeStateSwitchCustom
											title="shift click to toggle per or default"
											onclick={(e: MouseEvent) => {
												if (e.shiftKey) {
													e.preventDefault();
													e.stopPropagation();
													DownloadedUseDefault.value = !DownloadedUseDefault.value;
												}
											}}
											bind:state={Downloaded.value}
											label={'Downloaded'}
											class="w-full p-1 pl-2 hover:variant-glass-surface focus:outline-0
											{DownloadedUseDefault.value && 'opacity-20'}"
											labelClass="w-full"
										>
											<span>Downloaded</span>
										</ThreeStateSwitchCustom>
										<ThreeStateSwitchCustom
											title="shift click to toggle per or default"
											onclick={(e: MouseEvent) => {
												if (e.shiftKey) {
													e.preventDefault();
													e.stopPropagation();
													TrackedUseDefault.value = !TrackedUseDefault.value;
												}
											}}
											bind:state={Tracked.value}
											label={'Tracked'}
											class="w-full p-1 pl-2 hover:variant-glass-surface focus:outline-0
											{TrackedUseDefault.value && 'opacity-20'}"
											labelClass="w-full"
										>
											<span>Tracked</span>
										</ThreeStateSwitchCustom>
									{:else if $tabSet === 1}
										<Switch
											title="shift click to toggle per or default"
											triState={false}
											bind:checked={Ascending.value}
											label={'Ascending'}
											class="w-full p-1 pl-2 hover:variant-glass-surface focus:outline-0
											{AscendingUseDefault.value && 'opacity-20'}"
											onclick={(e: MouseEvent) => {
												if (e.shiftKey) {
													e.preventDefault();
													e.stopPropagation();
													AscendingUseDefault.value = !AscendingUseDefault.value;
												}
											}}
											labelClass="w-full"
										>
											<span>Ascending</span>
										</Switch>
										<RadioGroup
											rounded="rounded-container-token"
											background="bg-transparent"
											class="focus:outline-0
											{sortOptionsUseDefault.value && 'opacity-20'}"
											border="border-0"
											display="flex-col"
											active="variant-glass-primary"
										>
											{#each enumEntries(sort) as [value, name]}
												<RadioItem
													title="shift click to toggle per or default"
													bind:group={sortOptions.value}
													class="focus:outline-0"
													name="justify"
													{value}
													onclick={(e: MouseEvent) => {
														if (e.shiftKey) {
															e.preventDefault();
															e.stopPropagation();
															sortOptionsUseDefault.value = !sortOptionsUseDefault.value;
														}
													}}
												>
													{name}
												</RadioItem>
											{/each}
										</RadioGroup>
									{:else if $tabSet === 2}
										<Switch
											title="shift click to toggle per or default"
											bind:checked={libraryCategoryTotalCounts.value}
											class="w-full p-1 pl-2 outline-0 hover:variant-glass-surface
											{libraryCategoryTotalCountsUseDefault.value && 'opacity-20'}"
											onclick={(e: MouseEvent) => {
												if (e.shiftKey) {
													e.preventDefault();
													e.stopPropagation();
													libraryCategoryTotalCountsUseDefault.value = !libraryCategoryTotalCountsUseDefault.value;
												}
											}}
										>
											Category Total Counts
										</Switch>
										<Switch
											title="shift click to toggle per or default"
											bind:checked={downloadsBadge.value}
											class="w-full p-1 pl-2 outline-0 hover:variant-glass-surface
											{downloadsBadgeUseDefault.value && 'opacity-20'}"
											onclick={(e: MouseEvent) => {
												if (e.shiftKey) {
													e.preventDefault();
													e.stopPropagation();
													downloadsBadgeUseDefault.value = !downloadsBadgeUseDefault.value;
												}
											}}
										>
											Downloads Badge
										</Switch>
										<Switch
											title="shift click to toggle per or default"
											bind:checked={unreadBadge.value}
											class="w-full p-1 pl-2 outline-0 hover:variant-glass-surface
											{unreadBadgeUseDefault.value && 'opacity-20'}"
											onclick={(e: MouseEvent) => {
												if (e.shiftKey) {
													e.preventDefault();
													e.stopPropagation();
													unreadBadgeUseDefault.value = !unreadBadgeUseDefault.value;
												}
											}}
										>
											Unread Badge
										</Switch>
										<RadioGroup
											rounded="rounded-container-token"
											background="bg-transparent"
											class="focus:outline-0
											{displayOptionsUseDefault.value && 'opacity-20'}"
											border="border-0"
											display="flex-col"
											active="variant-glass-primary"
										>
											{#each enumEntries(display) as [value, name]}
												<RadioItem
													title="shift click to toggle per or default"
													bind:group={displayOptions.value}
													class="focus:outline-0"
													name="justify"
													{value}
													onclick={(e: MouseEvent) => {
														if (e.shiftKey) {
															e.preventDefault();
															e.stopPropagation();
															displayOptionsUseDefault.value = !displayOptionsUseDefault.value;
														}
													}}
												>
													{name}
												</RadioItem>
											{/each}
										</RadioGroup>
									{/if}
								</div>
							</svelte:fragment>
						</TabGroup>
					{:else if $tabSetArch === 1}
						<!-- defaults -->
						<TabGroup
							justify="justify-center"
							flex="flex"
							class="bg-surface-100-800-token w-full select-none focus:outline-0"
							rounded=""
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
										<ThreeStateSwitchCustom
											onclick={(e: MouseEvent) => {
												if (e.shiftKey) {
													e.preventDefault();
													e.stopPropagation();
													unreadUseDefault.value = !unreadUseDefault.value;
												}
											}}
											bind:state={gmState.value.Unread}
											label={'Unread'}
											class="w-full p-1 pl-2 hover:variant-glass-surface focus:outline-0 
											{!unreadUseDefault.value && 'opacity-20'}"
											labelClass="w-full flex-1"
										>
											<span>Unread</span>
										</ThreeStateSwitchCustom>
										<ThreeStateSwitchCustom
											onclick={(e: MouseEvent) => {
												if (e.shiftKey) {
													e.preventDefault();
													e.stopPropagation();
													DownloadedUseDefault.value = !DownloadedUseDefault.value;
												}
											}}
											bind:state={gmState.value.Downloaded}
											label={'Downloaded'}
											class="w-full p-1 pl-2 hover:variant-glass-surface focus:outline-0
											{!DownloadedUseDefault.value && 'opacity-20'}"
											labelClass="w-full"
										>
											<span>Downloaded</span>
										</ThreeStateSwitchCustom>
										<ThreeStateSwitchCustom
											onclick={(e: MouseEvent) => {
												if (e.shiftKey) {
													e.preventDefault();
													e.stopPropagation();
													TrackedUseDefault.value = !TrackedUseDefault.value;
												}
											}}
											bind:state={gmState.value.Tracked}
											label={'Tracked'}
											class="w-full p-1 pl-2 hover:variant-glass-surface focus:outline-0
											{!TrackedUseDefault.value && 'opacity-20'}"
											labelClass="w-full"
										>
											<span>Tracked</span>
										</ThreeStateSwitchCustom>
									{:else if $tabSet === 1}
										<Switch
											triState={false}
											bind:checked={gmState.value.Asc}
											label={'Ascending'}
											class="w-full p-1 pl-2 hover:variant-glass-surface focus:outline-0
											{!AscendingUseDefault.value && 'opacity-20'}"
											labelClass="w-full"
											onclick={(e: MouseEvent) => {
												if (e.shiftKey) {
													e.preventDefault();
													e.stopPropagation();
													AscendingUseDefault.value = !AscendingUseDefault.value;
												}
											}}
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
											{#each enumEntries(sort) as [value, name]}
												<RadioItem
													bind:group={gmState.value.Sort}
													class="focus:outline-0
													{!sortOptionsUseDefault.value && 'opacity-20'}"
													name="justify"
													{value}
													onclick={(e: MouseEvent) => {
														if (e.shiftKey) {
															e.preventDefault();
															e.stopPropagation();
															sortOptionsUseDefault.value = !sortOptionsUseDefault.value;
														}
													}}
												>
													{name}
												</RadioItem>
											{/each}
										</RadioGroup>
									{:else if $tabSet === 2}
										<Slide
											bind:checked={gmState.value.libraryCategoryTotalCounts}
											class="w-full p-1 pl-2 outline-0 hover:variant-glass-surface
											{!libraryCategoryTotalCountsUseDefault.value && 'opacity-20'}"
											onclick={(e: MouseEvent) => {
												if (e.shiftKey) {
													e.preventDefault();
													e.stopPropagation();
													libraryCategoryTotalCountsUseDefault.value = !libraryCategoryTotalCountsUseDefault.value;
												}
											}}
										>
											Category Total Counts
										</Slide>
										<Slide
											bind:checked={gmState.value.downloadsBadge}
											class="w-full p-1 pl-2 outline-0 hover:variant-glass-surface
											{!downloadsBadgeUseDefault.value && 'opacity-20'}"
											onclick={(e: MouseEvent) => {
												if (e.shiftKey) {
													e.preventDefault();
													e.stopPropagation();
													downloadsBadgeUseDefault.value = !downloadsBadgeUseDefault.value;
												}
											}}
											>Downloads Badge</Slide
										>
										<Slide
											bind:checked={gmState.value.unreadBadge}
											class="w-full p-1 pl-2 outline-0 hover:variant-glass-surface
											{!unreadBadgeUseDefault.value && 'opacity-20'}"
											onclick={(e: MouseEvent) => {
												if (e.shiftKey) {
													e.preventDefault();
													e.stopPropagation();
													unreadBadgeUseDefault.value = !unreadBadgeUseDefault.value;
												}
											}}
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
											{#each enumEntries(display) as [value, name]}
												<RadioItem
													bind:group={gmState.value.Display}
													class="focus:outline-0
													{!displayOptionsUseDefault.value && 'opacity-20'}"
													name="justify"
													{value}
													onclick={(e: MouseEvent) => {
														if (e.shiftKey) {
															e.preventDefault();
															e.stopPropagation();
															displayOptionsUseDefault.value = !displayOptionsUseDefault.value;
														}
													}}
												>
													{name}
												</RadioItem>
											{/each}
										</RadioGroup>
									{/if}
								</div>
							</svelte:fragment>
						</TabGroup>
					{/if}
				</div>
			</svelte:fragment>
		</TabGroup>
	</div>
{/if}
