<script lang="ts">
	import MediaQuery from '$lib/components/MediaQuery.svelte';
	import TooltipIconButton from '$lib/components/TooltipIconButton.svelte';
	import { screens } from '$lib/screens';
	import { popup } from '@skeletonlabs/skeleton';
	import { getToastStore } from '$lib/components/Toast/stores';
	import { HelpUpdateChapters, dlreabook } from '$lib/util';
	import { selected, selectmode } from './UpdatesStores';
	import Icon from '$lib/components/IconWrapper.svelte';
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	const toastStore = getToastStore();
	export let selectall: () => void;
	export let updateSelectedValues: (prop: dlreabook, is: boolean | undefined) => void;
</script>

<div class="p-0 flex items-center space-x-1 h-full">
	<MediaQuery
		query="(min-width: {screens.lg}),(min-width: {screens.sm}) and (max-width: {screens.md})"
		let:matches
	>
		{#if matches}
			{#if $selectmode}
				<TooltipIconButton
					class="text-surface-700 dark:text-surface-300"
					on:click={async () => {
						await HelpUpdateChapters(dlreabook.download, selected, toastStore);
					}}
					tip="download/delete Selected"
					name="mdi:download"
				/>
				<TooltipIconButton
					class="text-surface-700 dark:text-surface-300"
					on:click={async () => {
						const is = await HelpUpdateChapters(dlreabook.read, selected, toastStore);
						updateSelectedValues(dlreabook.read, is);
					}}
					tip="Read/Un-Read Selected"
					name="mdi:book-open-page-variant-outline"
				/>
				<TooltipIconButton
					class="text-surface-700 dark:text-surface-300"
					on:click={async () => {
						const is = await HelpUpdateChapters(dlreabook.bookmark, selected, toastStore);
						updateSelectedValues(dlreabook.bookmark, is);
					}}
					tip="bookmark/Un-bookmark Selected"
					name="mdi:bookmark"
				/>
			{/if}
			<TooltipIconButton
				class="text-surface-700 dark:text-surface-300"
				on:click={selectall}
				name="mdi:select-all"
				tip="Select all/none"
			/>
		{:else if $selectmode}
			<button
				use:popup={{
					event: 'click',
					target: 'selectmenu',
					placement: 'bottom'
				}}
				class="hover:variant-glass-surface h-full p-2 aspect-square"
			>
				<Icon
					name="mdi:dots-vertical"
					class="aspect-square w-full h-full text-surface-700 dark:text-surface-300"
				/>
			</button>
			<div class="z-50" data-popup="selectmenu">
				<div class="card p-0 rounded-lg max-w-xs">
					<button
						class="text-2xl hover:variant-glass-surface w-full rounded-t-lg p-4 flex items-center justify-start"
						on:click={async () => {
							await HelpUpdateChapters(dlreabook.download, selected, toastStore);
						}}
					>
						<IconWrapper name="mdi:download" class="mr-2" />download / delete
					</button>
					<button
						class="text-2xl hover:variant-glass-surface w-full p-4 flex items-center justify-start"
						on:click={async () => {
							const is = await HelpUpdateChapters(dlreabook.read, selected, toastStore);
							updateSelectedValues(dlreabook.read, is);
						}}
					>
						<IconWrapper name="mdi:book-open-page-variant-outline" class="mr-2" />Un/Read
					</button>
					<button
						class="text-2xl hover:variant-glass-surface w-full p-4 flex items-center justify-start"
						on:click={async () => {
							const is = await HelpUpdateChapters(dlreabook.bookmark, selected, toastStore);
							updateSelectedValues(dlreabook.bookmark, is);
						}}
					>
						<IconWrapper name="mdi:bookmark" class="mr-2" />Un/bookmark
					</button>
					<button
						class="text-2xl hover:variant-glass-surface w-full rounded-b-lg p-4 flex items-center justify-start"
						on:click={selectall}
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
			$selectmode = !$selectmode;
		}}
		name="mdi:{$selectmode ? 'select-multiple' : 'flip-to-front'}"
		tip="Select Mode"
	/>
</div>
