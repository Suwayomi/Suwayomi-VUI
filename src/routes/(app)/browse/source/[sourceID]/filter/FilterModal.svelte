<script lang="ts">
	import GroupFilter from './filters/GroupFilter.svelte';
	import TextFilter from './filters/TextFilter.svelte';
	import SortFilter from './filters/SortFilter.svelte';
	import SelectFilter from './filters/SelectFilter.svelte';
	import HeaderFilter from './filters/HeaderFilter.svelte';
	import TriStateFilter from './filters/TriStateFilter.svelte';
	import SeparatorFilter from './filters/SeparatorFilter.svelte';
	import CheckBoxFilter from './filters/CheckBoxFilter.svelte';
	import { Accordion, getModalStore } from '@skeletonlabs/skeleton';
	import type { LayoutData } from '../$types';
	import type { FilterChangeInput } from '$lib/generated.js';
	import { filters as filtersStore } from './stores';
	import type { SvelteComponent } from 'svelte';
	import { queryParam, ssp } from 'sveltekit-search-params';
	export let parent: SvelteComponent;

	const modalStore = getModalStore();
	export let data: LayoutData;
	export let submit: (filterss: FilterChangeInput[], queryy: string) => void;
	const sause = data.sause;

	const queryy = queryParam('q', ssp.string(), { pushHistory: false });

	let query = $queryy ?? '';
	let filters: FilterChangeInput[] = $filtersStore;

	function Search() {
		submit(filters, query);
		parent.onClose();
	}

	function reset() {
		query = '';
		filters = [];
		Search();
	}
</script>

{#if $modalStore[0]}
	<div class="card p-0 w-modal shadow-xl rounded-lg">
		<div class="mt-4 mx-4">
			<input bind:value={query} class="input" title="Search" type="text" placeholder="Search" />
		</div>
		<div class="max-h-96 overflow-y-auto">
			{#each $sause.data.source.filters as filter, index}
				<div class="mt-4 mx-4">
					<Accordion>
						{#if filter.__typename === 'CheckBoxFilter'}
							<CheckBoxFilter {filter} {index} bind:filters />
						{:else if filter.__typename === 'TriStateFilter'}
							<TriStateFilter {filter} {index} bind:filters />
						{:else if filter.__typename === 'SeparatorFilter'}
							<SeparatorFilter />
						{:else if filter.__typename === 'HeaderFilter'}
							<HeaderFilter {filter} />
						{:else if filter.__typename === 'SelectFilter'}
							<SelectFilter {filter} {index} bind:filters />
						{:else if filter.__typename === 'SortFilter'}
							<SortFilter {filter} {index} bind:filters />
						{:else if filter.__typename === 'TextFilter'}
							<TextFilter {filter} {index} bind:filters />
						{:else if filter.__typename === 'GroupFilter'}
							<GroupFilter {filter} {index} bind:filters />
						{/if}
					</Accordion>
				</div>
			{/each}
		</div>
		<div class="m-4 flex justify-between items-center">
			<button class="btn variant-filled-warning" on:click={reset}>Reset</button>
			<button class="btn variant-filled-primary" on:click={Search}>Search</button>
		</div>
	</div>
{/if}
