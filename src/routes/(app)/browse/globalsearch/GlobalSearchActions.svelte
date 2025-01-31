<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import Search from '$lib/components/Search.svelte';
	import TooltipIconButton from '$lib/components/TooltipIconButton.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { langFilter } from '../BrowseStores';
	import GlobalSearchLangFilterModal from './GlobalSearchLangFilterModal.svelte';
	import { page } from '$app/state';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	import type { getSources } from '$lib/gql/Queries';
	import type { ResultOf } from '$lib/gql/graphql';

	interface Props {
		rawSources: ResultOf<typeof getSources>['sources']['nodes'] | undefined;
		langs: Set<string>;
	}

	let { rawSources, langs }: Props = $props();

	const modalStore = getModalStore();
</script>

<div class="flex h-full">
	<Search />
	{#if page.url.pathname.includes('/browse/migrate/manga/')}
		<Tooltip
			tip="open migrating manga"
			class="h-full cursor-pointer hover:variant-glass-surface"
		>
			<a
				class="aspect-square h-full w-auto"
				href={page.url.pathname.replace('/browse/migrate', '')}
			>
				<IconWrapper name="mdi:step-backward" class="h-full w-auto p-2" />
			</a>
		</Tooltip>
	{/if}
	<TooltipIconButton
		onclick={() => {
			modalStore.trigger({
				type: 'component',
				backdropClasses: '!p-0',
				component: {
					ref: GlobalSearchLangFilterModal,
					props: { langs, langFilter, rawSources }
				}
			});
		}}
		tipclass="z-20"
		tip="Language Filters"
		name="mdi:translate"
	/>
</div>
