<script lang="ts">
	import type { FilterChangeInput, InputMaybe, Scalars, SourceQuery } from '$lib/generated';
	import { AccordionItem } from '@skeletonlabs/skeleton';
	import CheckBoxFilter from './CheckBoxFilter.svelte';
	import HeaderFilter from './HeaderFilter.svelte';
	import SelectFilter from './SelectFilter.svelte';
	import SeparatorFilter from './SeparatorFilter.svelte';
	import SortFilter from './SortFilter.svelte';
	import TextFilter from './TextFilter.svelte';
	import TriStateFilter from './TriStateFilter.svelte';

	export let filter: Extract<
		SourceQuery['source']['filters'][0],
		{ __typename?: 'GroupFilter' | undefined }
	>;
	export let filters: FilterChangeInput[];
	export let index: number;

	let groupFilters = filters.filter((e) => e.position === index) as {
		groupChange: InputMaybe<FilterChangeInput> | undefined;
		position: Scalars['Int']['input'];
	}[];

	$: fakeFilters = groupFilters
		.map((e) => e.groupChange)
		.filter((e) => e !== undefined) as FilterChangeInput[];

	$: if (fakeFilters.length !== 0) {
		filters = filters.filter((e) => e.position !== index);
		fakeFilters.forEach((e) => {
			filters.push({
				position: index,
				groupChange: e
			});
		});
		filters = filters;
	} else {
		filters = filters.filter((e) => e.position !== index);
	}
</script>

<AccordionItem>
	<svelte:fragment slot="summary">{filter.name}</svelte:fragment>
	<svelte:fragment slot="content">
		<div class="space-y-1 p-1 variant-ghost-surface">
			{#each filter.filters as filte, index}
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
			{/each}
		</div>
	</svelte:fragment>
</AccordionItem>
