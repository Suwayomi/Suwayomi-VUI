<script lang="ts">
	import TooltipIconButton from '$lib/components/TooltipIconButton.svelte';
	import MangaCatagoryModal from './MangaCatagoryModal.svelte';
	import type { GetMangaQuery } from '$lib/generated';
	import { getModalStore } from '@skeletonlabs/skeleton';

	export let manga: GetMangaQuery['manga'];
	export let fetchchapters: () => Promise<void>;

	const modalStore = getModalStore();

	let loading = false;

	async function refreshManga() {
		loading = true;
		await fetchchapters();
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
