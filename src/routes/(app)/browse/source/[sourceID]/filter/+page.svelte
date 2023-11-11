<script lang="ts">
	import { FetchSourceMangaType, type FilterChangeInput } from '$lib/generated';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import type { LayoutData } from '../$types';
	import { filters, filtersSause } from './stores';
	import Grid from '../Grid.svelte';
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import FilterModal from './FilterModal.svelte';

	const modalStore = getModalStore();

	export let data: LayoutData;

	if ($filtersSause !== data.sourceID) {
		$filters = [];
	}
	$filtersSause = data.sourceID;

	const sause = data.sause;
	const query = queryParam('q', ssp.string(), { pushHistory: false });

	let queryfilter = {
		query: $query === '' ? undefined : $query ?? undefined,
		filters: $filters.length ? $filters : undefined
	};

	function submit(filterss: FilterChangeInput[], queryy: string) {
		queryfilter = {
			query: queryy === '' ? undefined : queryy ?? undefined,
			filters: filterss.length ? filterss : undefined
		};
		$query = queryy === '' ? null : queryy ?? null;
		$filters = filterss.length ? filterss : [];
	}
</script>

<Grid
	filters={queryfilter.filters}
	query={queryfilter.query}
	{data}
	type={FetchSourceMangaType.Search}
/>

{#if $sause.data.source}
	<button
		on:click={() => {
			modalStore.trigger({
				type: 'component',
				component: { ref: FilterModal, props: { data, submit } }
			});
		}}
		class="btn variant-filled-primary hover:bg-primary-500/70 fixed bottom-4 right-4 h-12"
	>
		<IconWrapper name="mdi:filter-outline" class="w-auto h-full" />
		Filter
	</button>
{/if}
