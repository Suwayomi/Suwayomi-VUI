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
	import ModalTemplate from '$lib/components/ModalTemplate.svelte';
	const modalStore = getModalStore();
</script>

{#if $modalStore[0]}
	<ModalTemplate titleText="Library settings">
		<Slide
			bind:checked={$Meta.ignoreFiltersWhenSearching}
			class="my-1 p-1 pl-2 hover:variant-glass-surface focus:outline-0"
		>
			Ignore Filters When Searching
		</Slide>
	</ModalTemplate>
{/if}
