<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import TriStateSlide from '$lib/components/TriStateSlide.svelte';
	import { CategoryTypeFragment } from '$lib/gql/Fragments';
	import { updateMangaCategories } from '$lib/gql/Mutations';
	import {
		getCategories as GetCategories,
		type getManga
	} from '$lib/gql/Queries';
	import { ErrorHelp } from '$lib/util';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { getContextClient, queryStore } from '@urql/svelte';
	import { type ResultOf } from '$lib/gql/graphql';

	export let manga: ResultOf<typeof getManga>['manga'] | undefined;
	const client = getContextClient();
	const modalStore = getModalStore();
	const getCategories = queryStore({ client, query: GetCategories });

	$: categories = $getCategories.data?.categories?.nodes
		?.filter((e) => e.id !== 0)
		.toSorted((a, b) => (a.order > b.order ? 1 : -1));

	let MangaCategories = manga?.categories.nodes?.map((e) => e.id) ?? [];

	let selectedCategories: number[] = [...MangaCategories];

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
		if (
			selectedCategories.toSorted().join(',') !==
			MangaCategories.toSorted().join(',')
		) {
			ErrorHelp(
				'Failed to change mangas categories',
				client
					.mutation(updateMangaCategories, {
						id: manga!.id,
						addTo: selectedCategories,
						clear: true
					})
					.toPromise()
			);
		}
	}
</script>

{#if $modalStore[0] && categories && MangaCategories}
	<div
		class="card w-modal max-h-screen space-y-4 rounded-lg p-0 py-4 shadow-xl"
	>
		<h1 class="h3 pl-4">Set categories</h1>
		<div class="border-y border-surface-700 pl-4">
			<div class="grid max-h-96 grid-cols-1 gap-1 overflow-y-auto">
				{#each categories as Category}
					<TriStateSlide
						triState={false}
						checked={MangaCategories.includes(Category.id)}
						on:changeE={(e) => {
							handelClicked(Category, e.detail);
						}}
						class="p-1 pl-2 outline-0 hover:variant-glass-surface"
						labelClass="w-full"
					>
						{Category.name}
					</TriStateSlide>
				{/each}
			</div>
		</div>
		<button on:click={handelSubmit} class="variant-filled btn float-right mr-4"
			>Submit</button
		>
	</div>
{/if}
