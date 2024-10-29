<!--
 Copyright (c) 2024 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { mmState } from '$lib/simpleStores.svelte';
	import ModalTemplate from '$lib/components/ModalTemplate.svelte';
	const modalStore = getModalStore();

	mmState.value.notes;
</script>

{#if $modalStore[0]}
	<ModalTemplate titleText="Notes">
		<div>
			<textarea
				class="textarea h-40 w-full"
				onchange={(e) => (mmState.value.notes = e.currentTarget.value)}
				value={mmState.value.notes ?? ''}
			></textarea>
		</div>
	</ModalTemplate>
{/if}
