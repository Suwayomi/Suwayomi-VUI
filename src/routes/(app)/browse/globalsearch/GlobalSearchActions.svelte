<script lang="ts">
	import Search from '$lib/components/Search.svelte';
	import TooltipIconButton from '$lib/components/TooltipIconButton.svelte';
	import type { SourcesQuery } from '$lib/generated';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { langfilt } from '../BrowseStores';
	import GlobalSearchLangfilterModal from './GlobalSearchLangfilterModal.svelte';
	import { page } from '$app/stores';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import IconWrapper from '$lib/components/IconWrapper.svelte';

	export let rawSources: SourcesQuery['sources'] | undefined;
	export let langs: Set<string>;

	const modalStore = getModalStore();
</script>

<div class="h-full flex">
	<Search />
	{#if $page.url.pathname.includes('/browse/migrate/manga/')}
		<Tooltip tip="open migrating manga" class="cursor-pointer h-full hover:variant-glass-surface">
			<a
				class="aspect-square h-full w-auto"
				href={$page.url.pathname.replace('/browse/migrate', '')}
			>
				<IconWrapper name="mdi:step-backward" class="w-auto h-full p-2" />
			</a>
		</Tooltip>
	{/if}
	<TooltipIconButton
		on:click={() => {
			modalStore.trigger({
				type: 'component',
				component: {
					ref: GlobalSearchLangfilterModal,
					props: { langs, langfilt, rawSources }
				}
			});
		}}
		tipclass="z-20"
		tip="Language Filters"
		name="mdi:translate"
	/>
</div>
