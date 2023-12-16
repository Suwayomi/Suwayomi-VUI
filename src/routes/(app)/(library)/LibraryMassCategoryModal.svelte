<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import TriStateSlide from '$lib/components/TriStateSlide.svelte';
	import {
		categories as getCategories,
		type CategoriesQuery,
		type CategoryQuery,
		type GetMangaQuery
	} from '$lib/generated';
	import {
		CategoryDoc,
		GetMangaDoc,
		updateMangasCategories,
		type UpdateMangasCategoriesMutation
	} from '$lib/generated';
	import { ErrorHelp } from '$lib/util';
	import type { ApolloCache, FetchResult } from '@apollo/client';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { selected } from './LibraryStores';
	import { queryParam, ssp } from 'sveltekit-search-params';

	const tab = queryParam('tab', ssp.number(), { pushHistory: false });
	const modalStore = getModalStore();

	let selectedCategories: number[] = [];

	const categories = getCategories({});

	function handelClicked(category: CategoriesQuery['categories']['nodes'][0], e: boolean) {
		if (e) {
			selectedCategories.push(category.id);
			return;
		}
		selectedCategories = selectedCategories.filter((ele) => ele !== category.id);
	}

	function updateMangasCategoriesUpdater(
		cache: ApolloCache<unknown>,
		{ data }: Omit<FetchResult<UpdateMangasCategoriesMutation>, 'context'>,
		selectedCategories: number[]
	) {
		if (!data || !$categories.data.categories.nodes) return;
		const mangaIds = data.updateMangasCategories.mangas.map((manga) => manga.id);
		const defaultCategory = selectedCategories.length === 0 ? [0] : selectedCategories;

		mangaIds.forEach((id) => {
			try {
				const mangaData = structuredClone(
					cache.readQuery<GetMangaQuery>({
						query: GetMangaDoc,
						variables: { id }
					})
				);
				if (!mangaData) return;
				mangaData.manga.categories.nodes = selectedCategories.map((categoryId) => ({
					__typename: 'CategoryType',
					id: categoryId
				}));
				cache.writeQuery({
					query: GetMangaDoc,
					variables: { id },
					data: mangaData
				});
			} catch (error) {}
		});

		const currentCategoryId = $tab ?? 0;
		const currentCategoryData = structuredClone(
			cache.readQuery<CategoryQuery>({
				query: CategoryDoc,
				variables: { id: currentCategoryId }
			})
		);
		if (!currentCategoryData) return;
		const mangas = currentCategoryData.category.mangas.nodes.filter((manga) =>
			mangaIds.includes(manga.id)
		);

		$categories.data.categories.nodes.forEach(({ id }) => {
			try {
				const oldCategoryData = structuredClone(
					cache.readQuery<CategoryQuery>({
						query: CategoryDoc,
						variables: { id }
					})
				);
				if (!oldCategoryData) return;
				if (defaultCategory.includes(id)) {
					const mangasToAdd: CategoryQuery['category']['mangas']['nodes'] = [];
					mangas.forEach((manga) => {
						if (!oldCategoryData.category.mangas.nodes.find((m) => m.id === manga.id)) {
							mangasToAdd.push(manga);
						}
					});
					oldCategoryData.category.mangas.nodes.push(...mangasToAdd);
				} else {
					oldCategoryData.category.mangas.nodes = oldCategoryData.category.mangas.nodes.filter(
						(m) => !mangaIds.includes(m.id)
					);
				}
				cache.writeQuery({
					query: CategoryDoc,
					variables: { id },
					data: oldCategoryData
				});
			} catch {}
		});
	}

	async function handelSubmit() {
		modalStore.close();
		const id = $selected.filter((e) => e).map((e) => e.id);
		ErrorHelp(
			'Failed to change mangas categories',
			updateMangasCategories({
				variables: {
					id,
					addTo: selectedCategories,
					clear: true
				},
				update: (a, b) => updateMangasCategoriesUpdater(a, b, selectedCategories)
			})
		);
	}
</script>

{#if $modalStore[0]}
	<div class="card py-4 w-modal shadow-xl space-y-4 rounded-lg">
		{#if $categories.loading}
			loading...
		{:else if $categories.error}
			Error loading categories: {JSON.stringify($categories.error)}
		{:else if $categories.errors}
			Errors loading categories: {JSON.stringify($categories.errors)}
		{:else}
			<h2 class="text-xl pl-4">Set categories</h2>
			<div class="border-b border-t border-surface-700 p-4">
				{#each $categories.data.categories.nodes
					.filter((e) => e.id !== 0)
					.toSorted((a, b) => (a.order > b.order ? 1 : -1)) as category}
					<div>
						<TriStateSlide
							triState={false}
							checked={false}
							on:changeE={(e) => {
								handelClicked(category, e.detail);
							}}
							class="w-full focus:outline-0 p-1 pl-2 hover:variant-glass-surface"
							labelClass="w-full"
						>
							{category.name}
						</TriStateSlide>
					</div>
				{/each}
			</div>
			<button on:click={handelSubmit} class="btn variant-filled mr-4 float-right">Submit</button>
		{/if}
	</div>
{/if}
