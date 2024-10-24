<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

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
	import { filters as filtersStore } from './stores';
	import { untrack, type SvelteComponent } from 'svelte';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import type { VariablesOf } from '$lib/gql/graphql';
	import type { fetchSourceManga } from '$lib/gql/Mutations';
	import { getContextClient, queryStore } from '@urql/svelte';
	import { getSource } from '$lib/gql/Queries';
	import ModalTemplate from '$lib/components/ModalTemplate.svelte';

	interface Props {
		parent: SvelteComponent;
		data: LayoutData;
		submit: (
			filterss: VariablesOf<typeof fetchSourceManga>['filters'],
			queryy: string
		) => void;
	}

	let { parent, data, submit }: Props = $props();

	const modalStore = getModalStore();
	const sause2 = queryStore({
		client: getContextClient(),
		query: getSource,
		variables: {
			id: data.sourceID
		}
	});

	let sauce = $derived.by(() => {
		untrack(() => {
			sause2.pause();
		});
		const _ = [$sause2];
		const tmp = untrack(() => {
			sause2.resume();
			return $state.snapshot($sause2).data?.source;
		});
		return tmp;
	});

	const queryy = queryParam('q', ssp.string(), { pushHistory: false });

	let query = $state($queryy ?? '');
	let filters: VariablesOf<typeof fetchSourceManga>['filters'] =
		$state($filtersStore);

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
	<ModalTemplate>
		{#snippet title()}
			<div class="mx-4 mt-4">
				<input
					bind:value={query}
					class="input"
					title="Search"
					type="text"
					placeholder="Search"
				/>
			</div>
		{/snippet}
		{#snippet children()}
			{#if sauce?.filters}
				{#each sauce.filters as filter, index}
					<div class="mx-4 mt-4">
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
			{/if}
		{/snippet}
		{#snippet footer()}
			<div class="flex items-center justify-between px-4 pb-4">
				<button class="variant-filled-warning btn" onclick={reset}>
					Reset
				</button>
				<button class="variant-filled-primary btn" onclick={Search}>
					Search
				</button>
			</div>
		{/snippet}
	</ModalTemplate>
{/if}
