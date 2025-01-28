<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import {
		ErrorHelp,
		getObjectEntries,
		queryState,
		type TriState
	} from '$lib/util.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { selectState } from './LibraryStores.svelte';
	import { getContextClient } from '@urql/svelte';
	import { updateMangasCategories } from '$lib/gql/Mutations';
	import { getCategories } from '$lib/gql/Queries';
	import ModalTemplate from '$lib/components/ModalTemplate.svelte';
	import ThreeStateSwitchCustom from '$lib/components/ThreeStateSwitchCustom.svelte';
	const client = getContextClient();
	const modalStore = getModalStore();

	const categories = queryState({
		client,
		query: getCategories
	});

	const CategoriesState: Record<number, TriState | undefined> = $state({});

	$effect(() => {
		categories.value.data?.categories.nodes.forEach((e) => {
			CategoriesState[e.id] = 'intermediate';
		});
	});

	function addRemove() {
		const addTo: number[] = [];
		const removeFrom: number[] = [];
		getObjectEntries(CategoriesState).forEach(([id, value]) => {
			switch (value) {
				case 'on':
					addTo.push(Number(id));
					break;
				case 'off':
					removeFrom.push(Number(id));
					break;
				default:
					break;
			}
		});
		return {
			addTo,
			removeFrom
		};
	}

	async function handelSubmit() {
		modalStore.close();
		const id = selectState.selectedIds();
		ErrorHelp(
			'Failed to change mangas categories',
			client
				.mutation(
					updateMangasCategories,
					{
						id,
						...addRemove()
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
			{:else if categories.value.data && Object.keys(CategoriesState).length}
				{@const nodes = categories.value.data.categories.nodes}
				{#each nodes
					.filter((e) => e.id !== 0)
					.sort((a, b) => (a.order > b.order ? 1 : -1)) as category}
					<div>
						<ThreeStateSwitchCustom
							bind:state={CategoriesState[category.id]}
							class="w-full p-1 pl-2 hover:variant-glass-surface focus:outline-0"
							labelClass="w-full"
						>
							{category.name}
						</ThreeStateSwitchCustom>
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
