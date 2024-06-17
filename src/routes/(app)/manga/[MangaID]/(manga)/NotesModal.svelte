<!--
 Copyright (c) 2024 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { MangaMeta } from '$lib/simpleStores';
	import ModalTemplate from '$lib/components/ModalTemplate.svelte';
	const modalStore = getModalStore();

	export let mangaMeta: ReturnType<typeof MangaMeta>;
</script>

{#if $modalStore[0]}
	<ModalTemplate title="Notes">
		<div>
			<textarea
				class="textarea h-40 w-full"
				on:change={(e) => ($mangaMeta.notes = e.currentTarget.value)}
				value={$mangaMeta.notes ?? ''}
			/>
		</div>
	</ModalTemplate>
{/if}
