<script lang="ts">
	import { getToastStore } from '$lib/components/Toast/stores';
	import TriStateSlide from '$lib/components/TriStateSlide.svelte';
	import type { CategoriesQuery, CategoryQuery, GetMangaQuery } from '$lib/generated';
	import {
		CategoryDoc,
		GetMangaDoc,
		updateMangasCategories,
		type UpdateMangasCategoriesMutation
	} from '$lib/generated';
	import { categories } from '$lib/simpleStores';
	import { Errorhelp } from '$lib/util';
	import type { ApolloCache, FetchResult } from '@apollo/client';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { selected } from './LibraryStores';
	import { queryParam, ssp } from 'sveltekit-search-params';

	const tab = queryParam('tab', ssp.number());
	const modalStore = getModalStore();
	const toastStore = getToastStore();

	let selectedCategories: number[] = [];

	function handelclicked(category: CategoriesQuery['categories']['nodes'][0], e: boolean) {
		if (e) {
			selectedCategories.push(category.id);
			return;
		}
		selectedCategories = selectedCategories.filter((ele) => ele !== category.id);
	}

	function updateMangasCategoriesUpdator(
		cache: ApolloCache<unknown>,
		{ data }: Omit<FetchResult<UpdateMangasCategoriesMutation>, 'context'>,
		selectedCategories: number[]
	) {
		if (!data || !$categories.data.categories.nodes) return;
		const mangaids = data.updateMangasCategories.mangas.map((e) => e.id);

		// try set each mangas own categories
		mangaids.forEach((e) => {
			try {
				const { manga } = cache.readQuery({
					query: GetMangaDoc,
					variables: { id: e }
				}) as GetMangaQuery;
				manga.categories.nodes = selectedCategories.map((ee) => {
					return {
						__typename: 'CategoryType',
						id: ee
					};
				});
				cache.writeQuery({
					query: GetMangaDoc,
					variables: { id: e },
					data: { manga }
				});
			} catch (error) {}
		});

		let selected = selectedCategories;
		if (selected.length === 0) {
			selected = [0];
		}

		const { category: currentCategory } = cache.readQuery({
			query: CategoryDoc,
			variables: { id: $tab ?? 0 }
		}) as CategoryQuery;
		const mangas = currentCategory.mangas.nodes.filter((e) => mangaids.includes(e.id));

		$categories.data.categories.nodes.forEach((oldCategoryID) => {
			try {
				const { category: oldCategory } = cache.readQuery({
					query: CategoryDoc,
					variables: { id: oldCategoryID.id }
				}) as CategoryQuery;
				if (selected.includes(oldCategoryID.id)) {
					const mangatoadd: CategoryQuery['category']['mangas']['nodes'] = [];
					mangas.forEach((manga) => {
						if (!oldCategory.mangas.nodes.find((e) => e.id === manga.id)) {
							mangatoadd.push(manga);
						}
					});
					oldCategory.mangas.nodes.push(...mangatoadd);
					cache.writeQuery({
						query: CategoryDoc,
						variables: { id: oldCategoryID.id },
						data: { category: oldCategory }
					});
				} else {
					oldCategory.mangas.nodes = oldCategory.mangas.nodes.filter(
						(e) => !mangaids.includes(e.id)
					);
					cache.writeQuery({
						query: CategoryDoc,
						variables: { id: oldCategoryID.id },
						data: { category: oldCategory }
					});
				}
			} catch {}
		});
	}

	async function handelSubmit() {
		modalStore.close();
		const id = $selected.filter((e) => e).map((e) => e.id);
		Errorhelp(
			'Failed to change mangas categories',
			updateMangasCategories({
				variables: {
					id,
					addTo: selectedCategories,
					clear: true
				},
				update: (a, b) => updateMangasCategoriesUpdator(a, b, selectedCategories)
			}),
			toastStore
		);
	}
</script>

{#if $modalStore[0]}
	<div class="card py-4 w-modal shadow-xl space-y-4 rounded-lg">
		{#if $categories.loading}
			loading...
		{:else if $categories.error}
			Error loading categories: {JSON.stringify($categories.error)}
		{:else}
			<h2 class="text-xl pl-4">Set categories</h2>
			<div class="border-b border-t border-surface-700 p-4">
				{#each $categories.data.categories.nodes
					.filter((e) => e.id !== 0)
					.sort((a, b) => (a.order > b.order ? 1 : -1)) as category}
					<div>
						<TriStateSlide
							tristat={false}
							checked={false}
							on:changee={(e) => {
								handelclicked(category, e.detail);
							}}
							class="w-full focus:outline-0 p-1 pl-2 hover:variant-glass-surface"
							labelclass="w-full"
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
