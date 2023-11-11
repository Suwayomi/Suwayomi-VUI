<script lang="ts">
	import Search from '$lib/components/Search.svelte';
	import TooltipIconButton from '$lib/components/TooltipIconButton.svelte';
	import type { SourcesQuery } from '$lib/generated';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { langfilt } from '../BrowseStores';
	import GlobalSearchLangfilterModal from './GlobalSearchLangfilterModal.svelte';

	export let rawSources: SourcesQuery['sources'] | undefined;
	export let langs: Set<string>;

	const modalStore = getModalStore();
</script>

<div class="h-full flex">
	<Search />
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
