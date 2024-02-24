<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import Slide from '$lib/components/Slide.svelte';
	import type { SourcesQuery } from '$lib/generated';
	import { Tab, TabGroup, getModalStore, localStorageStore } from '@skeletonlabs/skeleton';
	import type { Writable } from 'svelte/store';
	import { FindLangName } from '../languages';
	import { SpecificSourceFilter } from '../BrowseStores';
	const modalStore = getModalStore();
	export let langs: Set<string>;
	export let langFilter: Writable<Set<string>>;
	export let rawSources: SourcesQuery['sources']['nodes'] | undefined;
	const tabSet = localStorageStore<number>('browseTabSet', 0);

	$: LangFilteredSources = rawSources?.filter((source) => {
		console.log(source.lang, $langFilter);
		if ($langFilter.has('pinned') && source.meta.find((e) => e.key === 'pinned')) {
			return true;
		}
		if (!$langFilter.has(source.lang)) return false;
		return true;
	});
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
			<Tab bind:group={$tabSet} name="tab1" value={0}>Languages</Tab>
			<Tab bind:group={$tabSet} name="tab2" value={1}>Sources</Tab>
			<!-- Tab Panels --->
			<svelte:fragment slot="panel">
				{#if $tabSet === 0}
					<div class="max-h-96 overflow-y-auto grid grid-cols-1 gap-1 pr-4">
						{#each langs as lang}
							<Slide
								class="outline-0 p-1 pl-2 hover:variant-glass-surface"
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
					<div class="max-h-96 overflow-y-auto grid grid-cols-1 gap-1 pr-4">
						{#each LangFilteredSources as lang}
							<Slide
								class="outline-0 p-1 pl-2 hover:variant-glass-surface"
								on:changeE={(e) => {
									if (e.detail) {
										$SpecificSourceFilter.add(lang.id);
										$SpecificSourceFilter = $SpecificSourceFilter;
										return;
									}
									$SpecificSourceFilter.delete(lang.id);
									$SpecificSourceFilter = $SpecificSourceFilter;
								}}
								checked={$SpecificSourceFilter.has(lang.id)}
							>
								{lang.displayName}
							</Slide>
						{/each}
					</div>
				{/if}
			</svelte:fragment>
		</TabGroup>
	</div>
{/if}
