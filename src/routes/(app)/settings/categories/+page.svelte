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
	import { actionState } from '$lib/MountTitleAction.svelte';
	import { type ResultOf } from '$lib/gql/graphql';
	import { getCategories } from '$lib/gql/Queries';
	import { getContextClient } from '@urql/svelte';
	import { CategoryTypeFragment } from '$lib/gql/Fragments';
	import { deleteCategory, updateCategoryOrder } from '$lib/gql/Mutations';
	import { queryState } from '$lib/util.svelte';

	actionState.AppBarData('Categories');

	const modalStore = getModalStore();
	const toastStore = getToastStore();
	const client = getContextClient();
	let cats = queryState({
		client,
		query: getCategories
	});

	type catT = ResultOf<typeof CategoryTypeFragment>;

	const Movement = {
		top: 'top',
		up: 'up',
		down: 'down',
		bottom: 'bottom'
	} as const;

	type TMovement = keyof typeof Movement;

	function edit(e: MouseEvent, cat: catT) {
		e.stopPropagation();
		modalStore.trigger({
			type: 'component',
			backdropClasses: '!p-0',
			component: {
				ref: CategoriesEditModal,
				props: { cat }
			}
		});
	}

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

	function move(e: MouseEvent, cat: catT, movement: TMovement) {
		e.stopPropagation();
		if (!cats.data) return;
		switch (movement) {
			case Movement.top:
				if (cat.order !== 1) {
					client
						.mutation(updateCategoryOrder, {
							id: cat.id,
							position: 1
						})
						.toPromise();
				}
				break;
			case Movement.up:
				if (cat.order !== 1) {
					client
						.mutation(updateCategoryOrder, {
							id: cat.id,
							position: cat.order - 1
						})
						.toPromise();
				}
				break;
			case Movement.down:
				if (cat.order !== cats.data.categories.nodes.length - 1) {
					client
						.mutation(updateCategoryOrder, {
							id: cat.id,
							position: cat.order + 1
						})
						.toPromise();
				}
				break;
			default:
				if (cat.order !== cats.data?.categories.nodes.length - 1) {
					client
						.mutation(updateCategoryOrder, {
							id: cat.id,
							position: cats.data.categories.nodes.length - 1
						})
						.toPromise();
				}
				break;
		}
	}

	function addNew(e: MouseEvent) {
		e.stopPropagation();
		modalStore.trigger({
			type: 'component',
			backdropClasses: '!p-0',
			component: {
				ref: CategoriesNewModal
			}
		});
	}
</script>

{#if cats.fetching}
	{#each new Array(5) as _}
		<div
			class="flex h-16 w-full cursor-pointer items-center p-2 text-left hover:variant-glass-surface"
		>
			<div class="placeholder aspect-square h-full w-auto animate-pulse"></div>
			<div class="w-full">
				<div class="placeholder mx-2 max-w-xs animate-pulse"></div>
			</div>
			<div class="flex h-full sm:mr-8">
				{#each new Array(4) as _}
					<div
						class="placeholder aspect-square h-full w-auto animate-pulse"
					></div>
				{/each}
			</div>
			<div class="placeholder aspect-square h-full w-auto animate-pulse"></div>
			<div class="placeholder aspect-square h-full w-auto animate-pulse"></div>
		</div>
		<div class="fixed bottom-2 right-2">
			<div class="placeholder h-16 w-16 animate-pulse rounded-full"></div>
		</div>
	{/each}
{:else if cats.error}
	<div class="whitespace-pre-wrap">
		{JSON.stringify(cats.error, null, 4)}
	</div>
{:else if cats.data?.categories.nodes}
	{#each [...cats.data.categories.nodes].sort( (a, b) => (a.order > b.order ? 1 : -1) ) as cat}
		<button
			onclick={(e) => edit(e, cat)}
			class="flex h-16 w-full cursor-pointer items-center p-2 text-left hover:variant-glass-surface"
		>
			<IconWrapper class="h-full w-auto" name="mdi:theme" />
			<div class="w-full px-2">{cat.name}</div>
			{#if cat.id !== 0}
				<div class="flex h-full sm:mr-8">
					<IconButton
						onclick={(e) => move(e, cat, Movement.top)}
						name="mdi:chevron-double-up"
						class="h-full  w-auto hover:variant-ghost"
					/>
					<IconButton
						onclick={(e) => move(e, cat, Movement.up)}
						name="mdi:chevron-up"
						class="h-full  w-auto hover:variant-ghost"
					/>
					<IconButton
						onclick={(e) => move(e, cat, Movement.down)}
						name="mdi:chevron-down"
						class="h-full  w-auto hover:variant-ghost"
					/>
					<IconButton
						onclick={(e) => move(e, cat, Movement.bottom)}
						name="mdi:chevron-double-down"
						class="h-full  w-auto hover:variant-ghost"
					/>
				</div>
			{/if}
			<TooltipIconButton
				tip="Edit"
				onclick={(e) => edit(e, cat)}
				name="mdi:edit"
				hover="hover:variant-ghost"
			/>
			<TooltipIconButton
				tip={cat.id !== 0
					? 'Delete'
					: `Remove all ${cat.mangas.totalCount} manga from this category for it to not show up in the library`}
				onclick={(e) => {
					if (cat.id !== 0) delCategory(e, cat);
				}}
				name="mdi:delete"
				class={cat.id !== 0 ? '' : 'text-surface-500'}
				hover={cat.id !== 0 ? 'hover:variant-ghost' : ''}
			/>
		</button>
	{/each}
	<IconButton
		onclick={addNew}
		name="mdi:plus"
		hover="hover:variant-glass-primary"
		height="h-16"
		class="variant-filled-primary fixed bottom-2 right-2 rounded-full"
	/>
{/if}
