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
	import ModalTemplate from '$lib/components/ModalTemplate.svelte';

	export let manga: ResultOf<typeof getManga>['manga'] | undefined;
	const client = getContextClient();
	const modalStore = getModalStore();
	const getCategories = queryStore({ client, query: GetCategories });

	$: categories = $getCategories.data?.categories?.nodes
		?.filter((e) => e.id !== 0)
		.sort((a, b) => (a.order > b.order ? 1 : -1));

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
			[...selectedCategories].sort().join(',') !==
			[...MangaCategories].sort().join(',')
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
	<ModalTemplate title="Set categories">
		<svelte:fragment>
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
		</svelte:fragment>
		<svelte:fragment slot="footer">
			<div class="flex items-center justify-end px-4 pb-4">
				<button on:click={handelSubmit} class="variant-filled btn">
					Submit
				</button>
			</div>
		</svelte:fragment>
	</ModalTemplate>
{/if}
