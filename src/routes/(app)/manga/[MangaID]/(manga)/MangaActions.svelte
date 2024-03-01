<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import TooltipIconButton from '$lib/components/TooltipIconButton.svelte';
	import MangaCatagoryModal from './MangaCatagoryModal.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { type ResultOf } from '$lib/gql/graphql';
	import type { getManga } from '$lib/gql/Queries';

	export let manga: ResultOf<typeof getManga>['manga'] | undefined;
	export let fetchChapters: () => Promise<void>;

	const modalStore = getModalStore();

	let loading = false;

	async function refreshManga() {
		loading = true;
		await fetchChapters();
		loading = false;
	}
</script>

<div class="h-full flex">
	<TooltipIconButton
		placement="bottom"
		tip="Refresh Manga"
		tipclass="z-20"
		name="mdi:refresh"
		hover={loading ? '' : 'hover:variant-glass-surface'}
		class="text-surface-700 dark:text-surface-300 {loading && 'animate-spin'}"
		on:click={refreshManga}
	/>

	{#if manga?.inLibrary}
		<TooltipIconButton
			class="text-surface-700 dark:text-surface-300"
			placement="bottom"
			tip="Change Categories"
			offset={{ crossAxis: -68 }}
			name="mdi:tag"
			tipclass="z-20"
			on:click={() =>
				modalStore.trigger({
					type: 'component',
					component: {
						ref: MangaCatagoryModal,
						props: {
							manga: manga
						}
					}
				})}
		/>
	{/if}
</div>
