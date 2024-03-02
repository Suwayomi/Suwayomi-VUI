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

	export let filter: Extract<
		ResultOf<typeof getSource>['source']['filters'][0],
		{ __typename?: 'GroupFilter' | undefined }
	>;
	export let filters: VariablesOf<typeof fetchSourceManga>['filters'];
	export let index: number;

	let groupFilters = filters?.filter((e) => e.position === index) as {
		groupChange:
			| NonNullable<VariablesOf<typeof fetchSourceManga>['filters']>[0]
			| undefined;
		position: number;
	}[];

	$: fakeFilters = groupFilters
		.map((e) => e.groupChange)
		.filter((e) => e) as NonNullable<
		VariablesOf<typeof fetchSourceManga>['filters']
	>;

	$: if (fakeFilters.length !== 0) {
		filters = filters?.filter((e) => e.position !== index) ?? [];
		fakeFilters.forEach((e) => {
			if (!filters) filters = [];
			filters.push({
				position: index,
				groupChange: e
			});
		});
		filters = filters;
	} else {
		filters = filters?.filter((e) => e.position !== index);
	}
</script>

<AccordionItem>
	<svelte:fragment slot="summary">{filter.name}</svelte:fragment>
	<svelte:fragment slot="content">
		<div class="space-y-1 p-1 variant-ghost-surface">
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
	</svelte:fragment>
</AccordionItem>
