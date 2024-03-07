<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { SvelteComponent } from 'svelte';
	import Slide from '$lib/components/Slide.svelte';
	import type { ResultOf } from '$lib/gql/graphql';
	import type { CategoryTypeFragment } from '$lib/gql/Fragments';
	import { getContextClient } from '@urql/svelte';
	import { updateCategory } from '$lib/gql/Mutations';
	const modalStore = getModalStore();
	export let parent: SvelteComponent;

	export let cat: ResultOf<typeof CategoryTypeFragment>;

	let catinput = cat.name;
	let Defaul = cat.default;
	let includeInDownload = cat.includeInDownload === 'INCLUDE';
	let includeInUpdate = cat.includeInUpdate === 'INCLUDE';
	const client = getContextClient();

	function submitChange(): void {
		client
			.mutation(updateCategory, {
				id: cat.id,
				name: catinput,
				default: Defaul,
				includeInDownload: includeInDownload ? 'INCLUDE' : 'EXCLUDE',
				includeInUpdate: includeInUpdate ? 'INCLUDE' : 'EXCLUDE'
			})
			.toPromise();
		parent.onClose();
	}
</script>

{#if $modalStore[0]}
	<div
		class="card w-modal max-h-screen space-y-4 rounded-lg p-0 py-4 shadow-xl"
	>
		<h1 class="h3 pl-4">Edit category</h1>
		<div class="border-y border-surface-700 px-4">
			<div class="grid max-h-96 grid-cols-1 gap-1 overflow-y-auto">
				<label class="label">
					<span class="pl-2">Category name</span>
					<input class="input" type="text" bind:value={catinput} />
				</label>
				<Slide
					labelClass="ml-2"
					bind:checked={Defaul}
					disabled={cat.id == 0}
					class="w-full p-1 hover:variant-glass-surface focus:outline-0"
				>
					<div class="w-full">
						Default category when adding new manga to the library
					</div>
				</Slide>
				<Slide
					labelClass="ml-2"
					bind:checked={includeInUpdate}
					class="w-full p-1 hover:variant-glass-surface focus:outline-0"
				>
					<div class="w-full">Include category in automatic updates</div>
				</Slide>
				<Slide
					labelClass="ml-2"
					bind:checked={includeInDownload}
					class="w-full p-1 hover:variant-glass-surface focus:outline-0"
				>
					<div class="w-full">
						Include category in downloads from automatic updates
					</div>
				</Slide>
			</div>
		</div>
		<div class="flex w-full justify-end pr-2">
			<button on:click={submitChange} class="variant-filled btn">Submit</button>
		</div>
	</div>
{/if}
