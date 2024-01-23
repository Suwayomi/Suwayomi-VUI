<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import Slide from '$lib/components/Slide.svelte';
	import {
		CategoriesDoc,
		type CategoriesQuery,
		createCategory,
		type CreateCategoryMutation,
		IncludeOrExclude
	} from '$lib/generated';
	import type { ApolloCache, FetchResult } from '@apollo/client';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { SvelteComponent } from 'svelte';

	const modalStore = getModalStore();

	export let parent: SvelteComponent;

	let catinput = '';
	let Defaul = false;
	let includeInDownload = true;
	let includeInUpdate = true;

	function createCategoryUpdater(
		cache: ApolloCache<unknown>,
		{ data }: Omit<FetchResult<CreateCategoryMutation>, 'context'>
	) {
		if (!data) return;
		const categoriesData = structuredClone(
			cache.readQuery<CategoriesQuery>({
				query: CategoriesDoc
			})
		);
		if (!categoriesData) return;
		categoriesData.categories.nodes.push(data.createCategory.category);

		cache.writeQuery({
			query: CategoriesDoc,
			data: categoriesData
		});
	}

	async function submitChange(): Promise<void> {
		createCategory({
			variables: {
				name: catinput,
				default: Defaul,
				includeInDownload: includeInDownload ? IncludeOrExclude.Include : IncludeOrExclude.Exclude,
				includeInUpdate: includeInUpdate ? IncludeOrExclude.Include : IncludeOrExclude.Exclude
			},
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
					<input class="input" type="text" bind:value={catinput} />
				</label>
				<Slide
					labelClass="ml-2"
					bind:checked={Defaul}
					class="w-full focus:outline-0 p-1 hover:variant-glass-surface"
				>
					<div class="w-full">Default category when adding new manga to the library</div>
				</Slide>
				<Slide
					labelClass="ml-2"
					bind:checked={includeInUpdate}
					class="w-full focus:outline-0 p-1 hover:variant-glass-surface"
				>
					<div class="w-full">Include category in automatic updates</div>
				</Slide>
				<Slide
					labelClass="ml-2"
					bind:checked={includeInDownload}
					class="w-full focus:outline-0 p-1 hover:variant-glass-surface"
				>
					<div class="w-full">Include category in downloads from automatic updates</div>
				</Slide>
			</div>
		</div>
		<div class="pr-2 w-full flex justify-end">
			<button on:click={submitChange} class="btn variant-filled">Submit</button>
		</div>
	</div>
{/if}
