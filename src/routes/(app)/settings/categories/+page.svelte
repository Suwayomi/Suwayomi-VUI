<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import CategoriesNewModal from './CategoriesNewModal.svelte';
	import CategoriesEditModal from './CategoriesEditModal.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { getToastStore } from '$lib/components/Toast/stores';
	import TooltipIconButton from '$lib/components/TooltipIconButton.svelte';
	import { AppBarData } from '$lib/MountTitleAction';
	import { type ResultOf } from 'gql.tada';
	import { getCategories } from '$lib/gql/Queries';
	import { getContextClient, queryStore } from '@urql/svelte';
	import { CategoryTypeFragment } from '$lib/gql/Fragments';
	import { deleteCategory, updateCategoryOrder } from '$lib/gql/Mutations';

	AppBarData('Categories');

	const modalStore = getModalStore();
	const toastStore = getToastStore();
	const client = getContextClient();
	let cats = queryStore({
		client,
		query: getCategories
	});

	type catT = ResultOf<typeof CategoryTypeFragment>;

	enum Movement {
		top = 'top',
		up = 'up',
		down = 'down',
		bottom = 'bottom'
	}

	function edit(e: MouseEvent, cat: catT) {
		e.stopPropagation();
		modalStore.trigger({
			type: 'component',
			component: {
				ref: CategoriesEditModal,
				props: { cat }
			}
		});
	}

	// function deleteCategoryUpdater(
	// 	cache: ApolloCache<unknown>,
	// 	{ data }: Omit<FetchResult<DeleteCategoryMutation>, 'context'>
	// ) {
	// 	if (!data) return;
	// 	const categoriesData = structuredClone(
	// 		cache.readQuery<CategoriesQuery>({
	// 			query: CategoriesDoc
	// 		})
	// 	);
	// 	if (!categoriesData) return;
	// 	categoriesData.categories.nodes = categoriesData.categories.nodes.filter(
	// 		(e) => e.id !== data.deleteCategory.category?.id
	// 	);

	// 	cache.writeQuery({
	// 		query: CategoriesDoc,
	// 		data: categoriesData
	// 	});
	// }

	function delCategory(e: MouseEvent, cat: catT): void {
		e.stopPropagation();
		toastStore.trigger({
			message: `You are about to delete the ${cat.name} category!`,
			action: {
				label: 'Delete',
				response: () => {
					client.mutation(deleteCategory, { categoryId: cat.id }).toPromise();
					// deleteCategory({ variables: { categoryId: cat.id }, update: deleteCategoryUpdater });
				}
			},
			actionClass: 'btn variant-filled-error',
			background: 'variant-filled-warning'
		});
	}

	function move(e: MouseEvent, cat: catT, movement: Movement) {
		e.stopPropagation();
		if (!$cats.data) return;
		switch (movement) {
			case Movement.top:
				if (cat.order !== 1) {
					client.mutation(updateCategoryOrder, {
						id: cat.id,
						position: 1
					});
				}
				break;
			case Movement.up:
				if (cat.order !== 1) {
					client.mutation(updateCategoryOrder, {
						id: cat.id,
						position: cat.order - 1
					});
				}
				break;
			case Movement.down:
				if (cat.order !== $cats.data.categories.nodes.length - 1) {
					client.mutation(updateCategoryOrder, {
						id: cat.id,
						position: cat.order + 1
					});
				}
				break;
			default:
				if (cat.order !== $cats.data?.categories.nodes.length - 1) {
					client.mutation(updateCategoryOrder, {
						id: cat.id,
						position: $cats.data.categories.nodes.length - 1
					});
				}
				break;
		}
	}

	function addNew(e: MouseEvent) {
		e.stopPropagation();
		modalStore.trigger({
			type: 'component',
			component: {
				ref: CategoriesNewModal
			}
		});
	}
</script>

{#if $cats.fetching}
	{#each new Array(5) as _}
		<div
			class="text-left flex items-center w-full h-16 hover:variant-glass-surface cursor-pointer p-2"
		>
			<div class="placeholder animate-pulse h-full aspect-square w-auto" />
			<div class=" w-full">
				<div class="placeholder animate-pulse max-w-xs mx-2" />
			</div>
			<div class="sm:mr-8 h-full flex">
				{#each new Array(4) as _}
					<div class="placeholder animate-pulse h-full aspect-square w-auto" />
				{/each}
			</div>
			<div class="placeholder animate-pulse h-full aspect-square w-auto" />
			<div class="placeholder animate-pulse h-full aspect-square w-auto" />
		</div>
		<div class="fixed bottom-2 right-2">
			<div class="placeholder animate-pulse h-16 w-16 rounded-full" />
		</div>
	{/each}
{:else if $cats.error}
	<div class="whitespace-pre-wrap">
		{JSON.stringify($cats.error, null, 4)}
	</div>
{:else if $cats.data?.categories.nodes}
	{#each $cats.data.categories.nodes.toSorted( (a, b) => (a.order > b.order ? 1 : -1) ) as cat}
		<button
			on:click={(e) => edit(e, cat)}
			class="text-left flex items-center w-full h-16 hover:variant-glass-surface cursor-pointer p-2"
		>
			<IconWrapper class="h-full w-auto" name="mdi:theme" />
			<div class="w-full px-2">{cat.name}</div>
			{#if cat.id !== 0}
				<div class="sm:mr-8 h-full flex">
					<IconButton
						on:click={(e) => move(e, cat, Movement.top)}
						name="mdi:chevron-double-up"
						class="hover:variant-ghost  h-full w-auto"
					/>
					<IconButton
						on:click={(e) => move(e, cat, Movement.up)}
						name="mdi:chevron-up"
						class="hover:variant-ghost  h-full w-auto"
					/>
					<IconButton
						on:click={(e) => move(e, cat, Movement.down)}
						name="mdi:chevron-down"
						class="hover:variant-ghost  h-full w-auto"
					/>
					<IconButton
						on:click={(e) => move(e, cat, Movement.bottom)}
						name="mdi:chevron-double-down"
						class="hover:variant-ghost  h-full w-auto"
					/>
				</div>
			{/if}
			<TooltipIconButton
				tip="Edit"
				on:click={(e) => edit(e, cat)}
				name="mdi:edit"
				hover="hover:variant-ghost"
			/>
			<TooltipIconButton
				tip={cat.id !== 0
					? 'Delete'
					: `Remove all ${cat.mangas.totalCount} manga from this category for it to not show up in the library`}
				on:click={(e) => {
					if (cat.id !== 0) delCategory(e, cat);
				}}
				name="mdi:delete"
				class={cat.id !== 0 ? '' : 'text-surface-500'}
				hover={cat.id !== 0 ? 'hover:variant-ghost' : ''}
			/>
		</button>
	{/each}
	<IconButton
		on:click={addNew}
		name="mdi:plus"
		hover="hover:variant-glass-primary"
		height="h-16"
		class="variant-filled-primary rounded-full fixed bottom-2 right-2"
	/>
{/if}
