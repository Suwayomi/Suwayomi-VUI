<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import MediaQuery from '$lib/components/MediaQuery.svelte';
	import TooltipIconButton from '$lib/components/TooltipIconButton.svelte';
	import { screens } from '$lib/screens';
	import { popup } from '@skeletonlabs/skeleton';
	import { dlreabook, type Tdlreabook } from '$lib/util.svelte';
	import { selectState } from './UpdatesStores';
	import Icon from '$lib/components/IconWrapper.svelte';
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	interface Props {
		selectAll: () => void;
		updateSelectedValues: (prop: Tdlreabook, is: boolean | undefined) => void;
	}

	let { selectAll, updateSelectedValues }: Props = $props();
</script>

<div class="flex h-full items-center space-x-1 p-0">
	<MediaQuery
		query="(min-width: {screens.lg}),(min-width: {screens.sm}) and (max-width: {screens.md})"
	>
		{#snippet children({ matches })}
			{#if matches}
				{#if selectState.selectMode}
					<TooltipIconButton
						class="text-surface-700 dark:text-surface-300"
						onclick={async () => {
							selectState.UpdateChapters(dlreabook.download);
						}}
						tip="download/delete Selected"
						name="mdi:download"
					/>
					<TooltipIconButton
						class="text-surface-700 dark:text-surface-300"
						onclick={async () => {
							const is = await selectState.UpdateChapters(dlreabook.read);
							updateSelectedValues(dlreabook.read, is);
						}}
						tip="Read/Un-Read Selected"
						name="mdi:book-open-page-variant-outline"
					/>
					<TooltipIconButton
						class="text-surface-700 dark:text-surface-300"
						onclick={async () => {
							const is = await selectState.UpdateChapters(dlreabook.bookmark);
							updateSelectedValues(dlreabook.bookmark, is);
						}}
						tip="bookmark/Un-bookmark Selected"
						name="mdi:bookmark"
					/>
				{/if}
				<TooltipIconButton
					class="text-surface-700 dark:text-surface-300"
					onclick={selectAll}
					name="mdi:select-all"
					tip="Select all/none"
				/>
			{:else if selectState.selectMode}
				<button
					use:popup={{
						event: 'click',
						target: 'selectmenu',
						placement: 'bottom'
					}}
					class="aspect-square h-full p-2 hover:variant-glass-surface"
				>
					<Icon
						name="mdi:dots-vertical"
						class="aspect-square h-full w-full text-surface-700 dark:text-surface-300"
					/>
				</button>
				<div class="z-50" data-popup="selectmenu">
					<div class="card max-w-xs rounded-lg p-0">
						<button
							class="flex w-full items-center justify-start rounded-t-lg p-4 text-2xl hover:variant-glass-surface"
							onclick={() => {
								selectState.UpdateChapters(dlreabook.download);
							}}
						>
							<IconWrapper name="mdi:download" class="mr-2" />download / delete
						</button>
						<button
							class="flex w-full items-center justify-start p-4 text-2xl hover:variant-glass-surface"
							onclick={async () => {
								const is = await selectState.UpdateChapters(dlreabook.read);
								updateSelectedValues(dlreabook.read, is);
							}}
						>
							<IconWrapper
								name="mdi:book-open-page-variant-outline"
								class="mr-2"
							/>Un/Read
						</button>
						<button
							class="flex w-full items-center justify-start p-4 text-2xl hover:variant-glass-surface"
							onclick={async () => {
								const is = await selectState.UpdateChapters(dlreabook.bookmark);
								updateSelectedValues(dlreabook.bookmark, is);
							}}
						>
							<IconWrapper name="mdi:bookmark" class="mr-2" />Un/bookmark
						</button>
						<button
							class="flex w-full items-center justify-start rounded-b-lg p-4 text-2xl hover:variant-glass-surface"
							onclick={selectAll}
						>
							<IconWrapper name="mdi:select-all" class="mr-2" />Select all
						</button>
					</div>
				</div>
			{/if}
		{/snippet}
	</MediaQuery>
	<TooltipIconButton
		class="text-surface-700 dark:text-surface-300"
		onclick={() => {
			selectState.selectMode = !selectState.selectMode;
		}}
		name="mdi:{selectState.selectMode ? 'select-multiple' : 'flip-to-front'}"
		tip="Select Mode"
	/>
</div>
