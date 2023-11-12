<script lang="ts">
	import CategoriesNewModal from './CategoriesNewModal.svelte';
	import CategoriesEditModal from './CategoriesEditModal.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	import { deleteCategory, type CategoriesQuery, updateCategoryOrder } from '$lib/generated';
	import { categories as ogcat } from '$lib/simpleStores';
	import { categories as Getcategories } from '$lib/generated';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { getToastStore } from '$lib/components/Toast/stores';
	const modalStore = getModalStore();
	const toastStore = getToastStore();

	let categories = ogcat;

	type catT = CategoriesQuery['categories']['nodes'][0];

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
				props: { ...cat, defaultt: cat.default }
			}
		});
	}

	function delCategory(e: MouseEvent, cat: catT): void {
		e.stopPropagation();
		toastStore.trigger({
			message: `You are about to delete the ${cat.name} category!`,
			action: {
				label: 'Delete',
				response: async () => {
					await deleteCategory({ variables: { categoryId: cat.id } });
					resetCategorys();
				}
			},
			actionClass: 'btn variant-filled-error',
			background: 'variant-filled-warning'
		});
	}

	function move(e: MouseEvent, cat: catT, movement: Movement) {
		e.stopPropagation();
		switch (movement) {
			case Movement.top:
				if (cat.order !== 1) {
					updateCategoryOrder({ variables: { id: cat.id, position: 1 } });
				}
				break;
			case Movement.up:
				if (cat.order !== 1) {
					updateCategoryOrder({ variables: { id: cat.id, position: cat.order - 1 } });
				}
				break;
			case Movement.down:
				if (cat.order !== $categories.data.categories.nodes.length - 1) {
					updateCategoryOrder({ variables: { id: cat.id, position: cat.order + 1 } });
				}
				break;
			default:
				if (cat.order !== $categories.data.categories.nodes.length - 1) {
					updateCategoryOrder({
						variables: { id: cat.id, position: $categories.data.categories.nodes.length - 1 }
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
				ref: CategoriesNewModal,
				props: { resetCategorys }
			}
		});
	}

	function resetCategorys() {
		categories = Getcategories({
			fetchPolicy: 'cache-and-network',
			nextFetchPolicy: 'cache-first'
		});
	}
</script>

{#if $categories.loading}
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
{:else if $categories.error}
	{JSON.stringify($categories.error)}
{:else if $categories.data.categories.nodes}
	{#each $categories.data.categories.nodes
		.filter((e) => e.id !== 0)
		.sort((a, b) => (a.order > b.order ? 1 : -1)) as cat}
		<button
			on:click={(e) => edit(e, cat)}
			class="text-left flex items-center w-full h-16 hover:variant-glass-surface cursor-pointer p-2"
		>
			<IconWrapper class="h-full w-auto" name="mdi:theme" />
			<div class="w-full px-2">{cat.name}</div>
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
			<IconButton on:click={(e) => edit(e, cat)} name="mdi:edit" class="hover:variant-ghost" />
			<IconButton
				on:click={(e) => delCategory(e, cat)}
				name="mdi:delete"
				class="hover:variant-ghost"
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
