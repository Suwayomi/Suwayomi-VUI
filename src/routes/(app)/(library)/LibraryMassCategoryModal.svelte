<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import TriStateSlide from '$lib/components/TriStateSlide.svelte';
	import { ErrorHelp } from '$lib/util';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { selected } from './LibraryStores';
	import { getContextClient, queryStore } from '@urql/svelte';
	import { updateMangasCategories } from '$lib/gql/Mutations';
	import { getCategories } from '$lib/gql/Queries';
	import { type ResultOf } from '$lib/gql/graphql';
	import { CategoryTypeFragment } from '$lib/gql/Fragments';

	const client = getContextClient();
	const modalStore = getModalStore();

	let selectedCategories: number[] = [];

	const categories = queryStore({
		client,
		query: getCategories
	});

	function handelClicked(
		category: ResultOf<typeof CategoryTypeFragment>,
		e: boolean
	) {
		if (e) {
			selectedCategories.push(category.id);
			return;
		}
		selectedCategories = selectedCategories.filter(
			(ele) => ele !== category.id
		);
	}

	async function handelSubmit() {
		modalStore.close();
		const id = $selected.filter((e) => e).map((e) => e.id);
		ErrorHelp(
			'Failed to change mangas categories',
			client
				.mutation(
					updateMangasCategories,
					{
						id,
						addTo: selectedCategories,
						clear: true
					},
					undefined
				)
				.toPromise()
		);
	}
</script>

{#if $modalStore[0]}
	<div class="card w-modal space-y-4 rounded-lg py-4 shadow-xl">
		{#if $categories.fetching}
			loading...
		{:else if $categories.error}
			<div class="whitespace-pre-wrap">
				Error loading categories: {JSON.stringify($categories.error, null, 4)}
			</div>
		{:else if $categories.data}
			{@const nodes = $categories.data.categories.nodes}
			<h2 class="pl-4 text-xl">Set categories</h2>
			<div class="border-b border-t border-surface-700 p-4">
				{#each nodes
					.filter((e) => e.id !== 0)
					.sort((a, b) => (a.order > b.order ? 1 : -1)) as category}
					<div>
						<TriStateSlide
							triState={false}
							checked={false}
							on:changeE={(e) => {
								handelClicked(category, e.detail);
							}}
							class="w-full p-1 pl-2 hover:variant-glass-surface focus:outline-0"
							labelClass="w-full"
						>
							{category.name}
						</TriStateSlide>
					</div>
				{/each}
			</div>
			<button
				on:click={handelSubmit}
				class="variant-filled btn float-right mr-4">Submit</button
			>
		{/if}
	</div>
{/if}
