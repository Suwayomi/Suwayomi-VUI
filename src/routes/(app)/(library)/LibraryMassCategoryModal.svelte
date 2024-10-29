<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import TriStateSlide from '$lib/components/TriStateSlide.svelte';
	import { ErrorHelp, queryState } from '$lib/util.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { selected } from './LibraryStores';
	import { getContextClient } from '@urql/svelte';
	import { updateMangasCategories } from '$lib/gql/Mutations';
	import { getCategories } from '$lib/gql/Queries';
	import { type ResultOf } from '$lib/gql/graphql';
	import { CategoryTypeFragment } from '$lib/gql/Fragments';
	import ModalTemplate from '$lib/components/ModalTemplate.svelte';
	const client = getContextClient();
	const modalStore = getModalStore();

	let selectedCategories: number[] = [];

	const categories = queryState({
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
	<ModalTemplate titleText="Set Categories">
		{#snippet children()}
			{#if categories.value.fetching}
				loading...
			{:else if categories.value.error}
				<div class="whitespace-pre-wrap">
					Error loading categories: {JSON.stringify(
						categories.value.error,
						null,
						4
					)}
				</div>
			{:else if categories.value.data}
				{@const nodes = categories.value.data.categories.nodes}
				{#each nodes
					.filter((e) => e.id !== 0)
					.sort((a, b) => (a.order > b.order ? 1 : -1)) as category}
					<div>
						<TriStateSlide
							triState={false}
							checked={false}
							onchange={(e) => {
								handelClicked(category, e);
							}}
							class="w-full p-1 pl-2 hover:variant-glass-surface focus:outline-0"
							labelClass="w-full"
						>
							{category.name}
						</TriStateSlide>
					</div>
				{/each}
			{/if}
		{/snippet}
		{#snippet footer()}
			<div class="flex items-center justify-end px-4 pb-4">
				<button
					onclick={handelSubmit}
					class="variant-filled btn float-right mr-4"
				>
					Submit
				</button>
			</div>
		{/snippet}
	</ModalTemplate>
{/if}
