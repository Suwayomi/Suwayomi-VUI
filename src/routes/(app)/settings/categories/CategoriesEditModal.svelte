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
	import ModalTemplate from '$lib/components/ModalTemplate.svelte';
	const modalStore = getModalStore();

	interface Props {
		parent: SvelteComponent;
		cat: ResultOf<typeof CategoryTypeFragment>;
	}

	let { parent, cat }: Props = $props();

	let catinput = $state(cat.name);
	let Defaul = $state(cat.default);
	let includeInDownload = $state(cat.includeInDownload === 'INCLUDE');
	let includeInUpdate = $state(cat.includeInUpdate === 'INCLUDE');
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
	<ModalTemplate titleText="Edit category">
		{#snippet children()}
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
		{/snippet}
		{#snippet footer()}
			<div class="flex w-full justify-end pb-4 pr-2">
				<button onclick={submitChange} class="variant-filled btn">
					Submit
				</button>
			</div>
		{/snippet}
	</ModalTemplate>
{/if}
