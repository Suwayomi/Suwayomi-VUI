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
	import { HelpUpdateChapters, dlreabook } from '$lib/util';
	import { selected, selectMode } from './UpdatesStores';
	import Icon from '$lib/components/IconWrapper.svelte';
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	export let selectAll: () => void;
	export let updateSelectedValues: (
		prop: dlreabook,
		is: boolean | undefined
	) => void;
</script>

<div class="flex h-full items-center space-x-1 p-0">
	<MediaQuery
		query="(min-width: {screens.lg}),(min-width: {screens.sm}) and (max-width: {screens.md})"
		let:matches
	>
		{#if matches}
			{#if $selectMode}
				<TooltipIconButton
					class="text-surface-700 dark:text-surface-300"
					on:click={async () => {
						await HelpUpdateChapters(dlreabook.download, selected);
					}}
					tip="download/delete Selected"
					name="mdi:download"
				/>
				<TooltipIconButton
					class="text-surface-700 dark:text-surface-300"
					on:click={async () => {
						const is = await HelpUpdateChapters(dlreabook.read, selected);
						updateSelectedValues(dlreabook.read, is);
					}}
					tip="Read/Un-Read Selected"
					name="mdi:book-open-page-variant-outline"
				/>
				<TooltipIconButton
					class="text-surface-700 dark:text-surface-300"
					on:click={async () => {
						const is = await HelpUpdateChapters(dlreabook.bookmark, selected);
						updateSelectedValues(dlreabook.bookmark, is);
					}}
					tip="bookmark/Un-bookmark Selected"
					name="mdi:bookmark"
				/>
			{/if}
			<TooltipIconButton
				class="text-surface-700 dark:text-surface-300"
				on:click={selectAll}
				name="mdi:select-all"
				tip="Select all/none"
			/>
		{:else if $selectMode}
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
						on:click={async () => {
							await HelpUpdateChapters(dlreabook.download, selected);
						}}
					>
						<IconWrapper name="mdi:download" class="mr-2" />download / delete
					</button>
					<button
						class="flex w-full items-center justify-start p-4 text-2xl hover:variant-glass-surface"
						on:click={async () => {
							const is = await HelpUpdateChapters(dlreabook.read, selected);
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
						on:click={async () => {
							const is = await HelpUpdateChapters(dlreabook.bookmark, selected);
							updateSelectedValues(dlreabook.bookmark, is);
						}}
					>
						<IconWrapper name="mdi:bookmark" class="mr-2" />Un/bookmark
					</button>
					<button
						class="flex w-full items-center justify-start rounded-b-lg p-4 text-2xl hover:variant-glass-surface"
						on:click={selectAll}
					>
						<IconWrapper name="mdi:select-all" class="mr-2" />Select all
					</button>
				</div>
			</div>
		{/if}
	</MediaQuery>
	<TooltipIconButton
		class="text-surface-700 dark:text-surface-300"
		on:click={() => {
			$selectMode = !$selectMode;
		}}
		name="mdi:{$selectMode ? 'select-multiple' : 'flip-to-front'}"
		tip="Select Mode"
	/>
</div>
