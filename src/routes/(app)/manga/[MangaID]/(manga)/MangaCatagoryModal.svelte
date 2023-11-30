<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { getToastStore } from '$lib/components/Toast/stores';
	import TriStateSlide from '$lib/components/TriStateSlide.svelte';
	import {
		CategoryDoc,
		GetMangaDoc,
		categories as getGetCategories,
		updateMangaCategories,
		type CategoriesQuery,
		type CategoryQuery,
		type GetMangaQuery,
		type UpdateMangaCategoriesMutation
	} from '$lib/generated';
	import { ErrorHelp } from '$lib/util';
	import type { ApolloCache, FetchResult } from '@apollo/client';
	import { getModalStore } from '@skeletonlabs/skeleton';

	export let manga: GetMangaQuery['manga'];

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	const getCategories = getGetCategories({});

	$: categories = $getCategories.data.categories?.nodes
		?.filter((e) => e.id !== 0)
		.toSorted((a, b) => (a.order > b.order ? 1 : -1));

	let MangaCategories = manga.categories.nodes?.map((e) => e.id) ?? [];

	let selectedCategories: number[] = [...MangaCategories];

	function handelClicked(category: CategoriesQuery['categories']['nodes'][0], e: boolean) {
		if (e) {
			selectedCategories.push(category.id);
			return;
		}
		selectedCategories = selectedCategories.filter((ele) => ele !== category.id);
	}

	function updateMangaCategoriesUpdate(
		cache: ApolloCache<unknown>,
		{ data }: Omit<FetchResult<UpdateMangaCategoriesMutation>, 'context'>
	): void {
		if (!data?.updateMangaCategories.manga.categories.nodes) return;
		const nodes = data.updateMangaCategories.manga.categories.nodes;

		const errors: Error[] = [];

		//// update this mangas categories
		try {
			const magna = structuredClone(manga);
			magna.categories.nodes = nodes;

			cache.writeQuery({
				query: GetMangaDoc,
				variables: { id: manga.id },
				data: { manga: magna }
			});
		} catch (e) {
			if (e instanceof Error) errors.push(e);
		}

		//// update the categories in library
		try {
			const oldNodes = manga.categories.nodes;
			if (!oldNodes) return;
			try {
				const currentManga: CategoryQuery['category']['mangas']['nodes'][0] = {
					id: manga.id,
					title: manga.title,
					inLibrary: manga.inLibrary,
					thumbnailUrl: manga.thumbnailUrl,
					unreadCount: manga.unreadCount,
					downloadCount: manga.downloadCount,
					lastReadChapter: manga.lastReadChapter,
					chapters: manga.chapters
				};
				// add to categories that now have it
				nodes.forEach((newNode) => {
					if (oldNodes.find((oldNode) => oldNode.id === newNode.id)) return;
					try {
						const { category } = structuredClone(
							cache.readQuery({
								query: CategoryDoc,
								variables: { id: newNode.id }
							})
						) as CategoryQuery;

						category.mangas.nodes.push(currentManga);

						cache.writeQuery({
							query: CategoryDoc,
							variables: { id: newNode.id },
							data: { category }
						});
					} catch {}
				});
				// add to 0 if now in default
				if (nodes.length === 0 && oldNodes.length > 0) {
					try {
						const { category } = structuredClone(
							cache.readQuery({
								query: CategoryDoc,
								variables: { id: 0 }
							})
						) as CategoryQuery;

						category.mangas.nodes.push(currentManga);

						cache.writeQuery({
							query: CategoryDoc,
							variables: { id: 0 },
							data: { category }
						});
					} catch {}
				}
			} catch {}

			//remove from categories that no longer have it
			oldNodes.forEach((oldNode) => {
				if (nodes.find((newNode) => oldNode.id === newNode.id)) return;
				try {
					const { category } = structuredClone(
						cache.readQuery({
							query: CategoryDoc,
							variables: { id: oldNode.id }
						})
					) as CategoryQuery;

					category.mangas.nodes = category.mangas.nodes.filter((e) => e.id !== manga.id);

					cache.writeQuery({
						query: CategoryDoc,
						variables: { id: oldNode.id },
						data: { category }
					});
				} catch {}
			});
			// remove from 0 if no longer in default
			if (oldNodes.length === 0 && nodes.length > 0) {
				//remove from default
				try {
					const { category } = structuredClone(
						cache.readQuery({
							query: CategoryDoc,
							variables: { id: 0 }
						})
					) as CategoryQuery;

					category.mangas.nodes = category.mangas.nodes.filter((e) => e.id !== manga.id);

					cache.writeQuery({
						query: CategoryDoc,
						variables: { id: 0 },
						data: { category }
					});
				} catch {}
			}
		} catch {}

		if (errors.length > 0) {
			console.error(errors);
			throw new Error('check console');
		}
	}

	async function handelSubmit() {
		modalStore.close();
		if (selectedCategories.toSorted().join(',') !== MangaCategories.toSorted().join(',')) {
			ErrorHelp(
				'Failed to change mangas categories',
				updateMangaCategories({
					variables: {
						id: manga.id,
						addTo: selectedCategories,
						clear: true
					},
					update: updateMangaCategoriesUpdate
				}),
				toastStore
			);
		}
	}
</script>

{#if $modalStore[0] && categories && MangaCategories}
	<div class="card p-0 w-modal shadow-xl space-y-4 rounded-lg max-h-screen py-4">
		<h1 class="h3 pl-4">Set categories</h1>
		<div class="pl-4 border-y border-surface-700">
			<div class="max-h-96 overflow-y-auto grid grid-cols-1 gap-1">
				{#each categories as Category}
					<TriStateSlide
						triState={false}
						checked={MangaCategories.includes(Category.id)}
						on:changeE={(e) => {
							handelClicked(Category, e.detail);
						}}
						class="outline-0 p-1 pl-2 hover:variant-glass-surface"
						labelClass="w-full"
					>
						{Category.name}
					</TriStateSlide>
				{/each}
			</div>
		</div>
		<button on:click={handelSubmit} class="btn variant-filled mr-4 float-right">Submit</button>
	</div>
{/if}
