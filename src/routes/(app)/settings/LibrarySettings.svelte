<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import Slide from '$lib/components/Slide.svelte';
	import { Meta } from '$lib/simpleStores';
	const modalStore = getModalStore();
</script>

{#if $modalStore[0]}
	<div class="card p-0 w-modal shadow-xl space-y-4 rounded-lg max-h-screen">
		<h1 class="h3 pt-4 pl-4">Library settings</h1>
		<div class="pl-4 border-y border-surface-700">
			<div class="max-h-96 overflow-y-auto grid grid-cols-1 gap-1 pr-4">
				<Slide
					bind:checked={$Meta.ignoreFiltersWhenSearching}
					class=" focus:outline-0 p-1 pl-2 hover:variant-glass-surface my-1"
				>
					Ignore Filters When Searching
				</Slide>
			</div>
		</div>
		<div class="p-4" />
	</div>
{/if}
