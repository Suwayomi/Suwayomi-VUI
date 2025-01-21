<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { AccordionItem } from '@skeletonlabs/skeleton';
	import CheckBoxFilter from './CheckBoxFilter.svelte';
	import HeaderFilter from './HeaderFilter.svelte';
	import SelectFilter from './SelectFilter.svelte';
	import SeparatorFilter from './SeparatorFilter.svelte';
	import SortFilter from './SortFilter.svelte';
	import TextFilter from './TextFilter.svelte';
	import TriStateFilter from './TriStateFilter.svelte';
	import type { ResultOf, VariablesOf } from '$lib/gql/graphql';
	import type { getSource } from '$lib/gql/Queries';
	import type { fetchSourceManga } from '$lib/gql/Mutations';
	import { OTT } from '$lib/util.svelte';

	interface Props {
		filter: Extract<
			ResultOf<typeof getSource>['source']['filters'][number],
			{ __typename: 'GroupFilter' }
		>;
		filters: VariablesOf<typeof fetchSourceManga>['filters'];
		index: number;
	}

	let { filter, filters = $bindable(), index }: Props = $props();

	let groupFilters = filters?.filter((e) => e.position === index) as {
		groupChange:
			| NonNullable<VariablesOf<typeof fetchSourceManga>['filters']>[0]
			| undefined;
		position: number;
	}[];

	let fakeFilters: NonNullable<
		VariablesOf<typeof fetchSourceManga>['filters']
	> = $state([]);
	$effect(() => {
		fakeFilters = groupFilters
			.map((e) => e.groupChange)
			.filter((e) => e) as NonNullable<
			VariablesOf<typeof fetchSourceManga>['filters']
		>;
	});

	$effect(() => {
		OTT([fakeFilters], () => {
			if (fakeFilters.length !== 0) {
				filters = filters?.filter((e) => e.position !== index) ?? [];

				fakeFilters.forEach((e) => {
					if (!filters) {
						filters = [];
					}
					filters!.push({
						position: index,
						groupChange: e
					});
				});
			} else {
				filters = filters?.filter((e) => e.position !== index);
			}
		});
	});
</script>

<AccordionItem>
	{#snippet summary()}
		{filter.name}
	{/snippet}
	{#snippet content()}
		<div class="variant-ghost-surface space-y-1 p-1">
			{#each filter.filters as filte, index}
				{#if '__typename' in filte}
					{#if filte.__typename === 'CheckBoxFilter'}
						<CheckBoxFilter filter={filte} {index} bind:filters={fakeFilters} />
					{:else if filte.__typename === 'TriStateFilter'}
						<TriStateFilter filter={filte} {index} bind:filters={fakeFilters} />
					{:else if filte.__typename === 'SeparatorFilter'}
						<SeparatorFilter />
					{:else if filte.__typename === 'HeaderFilter'}
						<HeaderFilter filter={filte} />
					{:else if filte.__typename === 'SelectFilter'}
						<SelectFilter filter={filte} {index} bind:filters={fakeFilters} />
					{:else if filte.__typename === 'SortFilter'}
						<SortFilter filter={filte} {index} bind:filters={fakeFilters} />
					{:else if filte.__typename === 'TextFilter'}
						<TextFilter filter={filte} {index} bind:filters={fakeFilters} />
					{/if}
				{/if}
			{/each}
		</div>
	{/snippet}
</AccordionItem>
