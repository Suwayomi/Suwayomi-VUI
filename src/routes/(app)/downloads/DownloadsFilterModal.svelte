<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import Slide from '$lib/components/Slide.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { filter, FilterT, type Filter } from './downloadsStores';

	const modalStore = getModalStore();

	function toggleState(value: Filter) {
		if ($filter.has(value)) {
			$filter.delete(value);
		} else {
			$filter.add(value);
		}
		$filter = $filter;
	}
</script>

{#if $modalStore[0]}
	<div class="card w-modal space-y-4 rounded-lg p-4 shadow-xl">
		{#each FilterT as value}
			<Slide
				class="w-full outline-0"
				on:change={() => {
					toggleState(value);
				}}
				checked={!$filter.has(value)}>{value}</Slide
			>
		{/each}
	</div>
{/if}
