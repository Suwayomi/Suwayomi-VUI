<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { SvelteComponent } from 'svelte';
	import { IncludeOrExclude, updateCategory, type CategoriesQuery } from '$lib/generated';
	import Slide from '$lib/components/Slide.svelte';
	const modalStore = getModalStore();
	export let parent: SvelteComponent;

	export let cat: CategoriesQuery['categories']['nodes'][0];

	let catinput = cat.name;
	let Defaul = cat.default;
	let includeInDownload = cat.includeInDownload === IncludeOrExclude.Include;
	let includeInUpdate = cat.includeInUpdate === IncludeOrExclude.Include;

	function submitChange(): void {
		updateCategory({
			variables: {
				id: cat.id,
				name: catinput,
				default: Defaul,
				includeInDownload: includeInDownload ? IncludeOrExclude.Include : IncludeOrExclude.Exclude,
				includeInUpdate: includeInUpdate ? IncludeOrExclude.Include : IncludeOrExclude.Exclude
			}
		});
		parent.onClose();
	}
</script>

{#if $modalStore[0]}
	<div class="card p-0 w-modal shadow-xl space-y-4 rounded-lg max-h-screen py-4">
		<h1 class="h3 pl-4">Edit category</h1>
		<div class="px-4 border-y border-surface-700">
			<div class="max-h-96 overflow-y-auto grid grid-cols-1 gap-1">
				<label class="label">
					<span class="pl-2">Category name</span>
					<input class="input" type="text" bind:value={catinput} />
				</label>
				<Slide
					labelClass="ml-2"
					bind:checked={Defaul}
					disabled={cat.id == 0}
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
