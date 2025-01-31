<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { queryParam, ssp } from 'sveltekit-search-params';
	import type { LayoutData } from '../$types';
	import { filtersState } from './stores.svelte';
	import Grid from '../Grid.svelte';
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import FilterModal from './FilterModal.svelte';
	import type { fetchSourceManga } from '$lib/gql/Mutations';
	import type { VariablesOf } from '$lib/gql/graphql';
	import { getContextClient } from '@urql/svelte';
	import { getSource } from '$lib/gql/Queries';
	import { OTT, queryState } from '$lib/util.svelte';

	const modalStore = getModalStore();

	interface Props {
		data: LayoutData;
	}

	let { data }: Props = $props();

	if (filtersState.filtersSause !== data.sourceID) {
		filtersState.filters = [];
	}
	filtersState.filtersSause = data.sourceID;

	let sause = $derived.by(() => {
		return OTT([data.sourceID], () =>
			queryState({
				client: getContextClient(),
				query: getSource,
				variables: {
					id: data.sourceID
				}
			})
		);
	});

	const query = queryParam('q', ssp.string(), { pushHistory: false });

	function doSearch() {
		queryfilter.query = $query ?? '';
	}

	let queryfilter = $state({
		query: $query === '' ? undefined : ($query ?? undefined),
		filters: filtersState.filters?.length ? filtersState.filters : undefined
	});

	function submit(
		filterss: VariablesOf<typeof fetchSourceManga>['filters'],
		queryy: string
	) {
		queryfilter = {
			query: queryy === '' ? undefined : (queryy ?? undefined),
			filters: filterss?.length ? filterss : undefined
		};
		$query = queryy === '' ? null : (queryy ?? null);
		filtersState.filters = filterss?.length ? filterss : [];
	}
	$effect(doSearch);
</script>

<Grid
	filters={queryfilter.filters}
	query={queryfilter.query}
	{data}
	type="SEARCH"
/>

{#if sause?.data?.source}
	<button
		onclick={() => {
			modalStore.trigger({
				type: 'component',
				backdropClasses: '!p-0',
				component: { ref: FilterModal, props: { data, submit } }
			});
		}}
		class="variant-filled-primary btn fixed bottom-4 right-4 h-12 hover:bg-primary-500/70"
	>
		<IconWrapper name="mdi:filter-outline" class="h-full w-auto" />
		Filter
	</button>
{/if}
