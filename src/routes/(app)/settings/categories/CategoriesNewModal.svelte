<script lang="ts">
	import Slide from '$lib/components/Slide.svelte';
	import {
		CategoriesDoc,
		type CategoriesQuery,
		createCategory,
		type CreateCategoryMutation
	} from '$lib/generated';
	import type { ApolloCache, FetchResult } from '@apollo/client';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { SvelteComponent } from 'svelte';
	import { writable } from 'svelte/store';

	const modalStore = getModalStore();

	export let parent: SvelteComponent;

	$: catinput = writable('');
	$: Defaul = writable(false);

	function createCategoryUpdater(
		cache: ApolloCache<unknown>,
		{ data }: Omit<FetchResult<CreateCategoryMutation>, 'context'>
	) {
		if (!data) return;
		const { categories } = structuredClone(
			cache.readQuery({
				query: CategoriesDoc
			})
		) as CategoriesQuery;

		categories.nodes.push(data.createCategory.category);

		cache.writeQuery({
			query: CategoriesDoc,
			data: { categories }
		});
	}

	async function submitChange(): Promise<void> {
		createCategory({
			variables: { name: $catinput, default: $Defaul },
			update: createCategoryUpdater
		});
		parent.onClose();
	}
</script>

{#if $modalStore[0]}
	<div class="card p-0 w-modal shadow-xl space-y-4 rounded-lg max-h-screen py-4">
		<h1 class="h3 pl-4">New category</h1>
		<div class="px-4 border-y border-surface-700">
			<div class="max-h-96 overflow-y-auto grid grid-cols-1 gap-1">
				<label class="label">
					<span class="pl-2">Category name</span>
					<input class="input" type="text" bind:value={$catinput} />
				</label>
				<Slide
					labelclass="ml-2"
					bind:checked={$Defaul}
					class="w-full focus:outline-0 p-1 hover:variant-glass-surface"
				>
					<div class="w-full">Default category when adding new manga to the library</div>
				</Slide>
			</div>
		</div>
		<div class="pr-2 w-full flex justify-end">
			<button on:click={submitChange} class="btn variant-filled">Submit</button>
		</div>
	</div>
{/if}
