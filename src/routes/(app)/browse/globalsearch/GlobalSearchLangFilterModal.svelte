<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import Slide from '$lib/components/Slide.svelte';
	import {
		Tab,
		TabGroup,
		getModalStore,
		localStorageStore
	} from '@skeletonlabs/skeleton';
	import type { Writable } from 'svelte/store';
	import { FindLangName } from '../languages';
	import { SpecificSourceFilter } from '../BrowseStores';
	import { type ResultOf } from '$lib/gql/graphql';
	import type { getSources } from '$lib/gql/Queries';
	const modalStore = getModalStore();
	export let langs: Set<string>;
	export let langFilter: Writable<Set<string>>;
	export let rawSources: ResultOf<typeof getSources>['sources']['nodes'];
	const tabSet = localStorageStore<number>('browseTabSet', 0);

	$: LangFilteredSources = rawSources?.filter((source) => {
		if (
			$langFilter.has('pinned') &&
			source.meta.find((e) => e.key === 'pinned')
		) {
			return true;
		}
		if (!$langFilter.has(source.lang)) return false;
		return true;
	});
</script>

{#if $modalStore[0]}
	<TabGroup
		justify="justify-center"
		flex="flex"
		class="card bg-surface-100-800-token w-modal flex max-h-dvh w-full select-none flex-col space-y-4 rounded-lg rounded-t-lg p-0 shadow-xl focus:outline-0"
		rounded="rounded-t-lg"
		active="border-b-2 variant-glass-primary"
		regionList="variant-soft-surface focus:outline-0 shrink-0"
		regionPanel="focus:outline-0 max-h-full overflow-y-auto"
	>
		<Tab bind:group={$tabSet} name="tab1" value={0}>Languages</Tab>
		<Tab bind:group={$tabSet} name="tab2" value={1}>Sources</Tab>
		<!-- Tab Panels --->
		<svelte:fragment slot="panel">
			{#if $tabSet === 0}
				<div class="grid grid-cols-1 gap-1 pr-4">
					{#each langs as lang}
						<Slide
							class="p-1 pl-2 outline-0 hover:variant-glass-surface"
							on:changeE={(e) => {
								if (e.detail) {
									$langFilter.add(lang);
									$langFilter = $langFilter;
									return;
								}
								$langFilter.delete(lang);
								$langFilter = $langFilter;
							}}
							checked={$langFilter.has(lang)}
						>
							{FindLangName(lang)}
						</Slide>
					{/each}
				</div>
			{:else if $tabSet === 1 && LangFilteredSources}
				<div class="grid grid-cols-1 gap-1 pr-4">
					{#each LangFilteredSources as sourc}
						{@const source = sourc}
						<Slide
							class="p-1 pl-2 outline-0 hover:variant-glass-surface"
							on:changeE={(e) => {
								if (e.detail) {
									$SpecificSourceFilter.add(source.id);
									$SpecificSourceFilter = $SpecificSourceFilter;
									return;
								}
								$SpecificSourceFilter.delete(source.id);
								$SpecificSourceFilter = $SpecificSourceFilter;
							}}
							checked={$SpecificSourceFilter.has(source.id)}
						>
							{source.displayName}
						</Slide>
					{/each}
				</div>
			{/if}
		</svelte:fragment>
	</TabGroup>
{/if}
