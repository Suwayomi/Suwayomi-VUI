<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import Search from './../../../lib/components/Search.svelte';
	import LibraryMassCategoryModal from './LibraryMassCategoryModal.svelte';
	import LibraryFilterModal from './LibraryFilterModal.svelte';
	import TooltipIconButton from '$lib/components/TooltipIconButton.svelte';
	import {
		getModalStore,
		popup,
		type PopupSettings
	} from '@skeletonlabs/skeleton';
	import { getToastStore } from '$lib/components/Toast/stores';
	import MediaQuery from '$lib/components/MediaQuery.svelte';
	import { screens } from '$lib/screens';
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	import { selected, selectMode } from './LibraryStores';
	import { ErrorHelp } from '$lib/util.svelte';
	import { getContextClient } from '@urql/svelte';
	import { ConditionalChaptersOfGivenManga } from '$lib/gql/Queries';
	import { enqueueChapterDownloads, updateMangas } from '$lib/gql/Mutations';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import LibrarySearchHelp from './LibrarySearchHelp.svelte';
	import { queryParam, ssp } from 'sveltekit-search-params';

	const client = getContextClient();

	interface Props {
		selectAll: () => void;
	}

	let { selectAll }: Props = $props();

	const toastStore = getToastStore();
	const modalStore = getModalStore();
	const tab = queryParam('tab', ssp.number(), { pushHistory: false });

	function handelFilter() {
		if ($tab === null) return;
		modalStore.trigger({
			type: 'component',
			backdropClasses: '!p-0',
			component: { ref: LibraryFilterModal, props: { tab: $tab } }
		});
	}

	async function removeSelectedFromLibrary() {
		const ids = $selected.filter((item) => item).map((item) => item.id);
		ErrorHelp(
			'Failed to delete mangas from library',
			client
				.mutation(updateMangas, {
					ids,
					inLibrary: false
				})
				.toPromise()
		);
	}

	function handelDelete() {
		const selectedCount = $selected.filter((ele) => ele).length;
		const message = `You are about to remove ${selectedCount} manga from your library!`;
		const action = {
			label: 'Delete',
			response: removeSelectedFromLibrary
		};
		const actionClass = 'btn variant-filled-error';
		const background = 'variant-filled-warning';

		toastStore.trigger({
			message,
			action,
			actionClass,
			background
		});
	}

	function handelCategory() {
		modalStore.trigger({
			type: 'component',
			backdropClasses: '!p-0',
			component: {
				ref: LibraryMassCategoryModal
			}
		});
	}

	const popupClick: PopupSettings = {
		event: 'click',
		target: 'popupClick',
		placement: 'left',
		closeQuery: ''
	};

	async function handelDownload(): Promise<void> {
		const selectedIds = $selected.filter((ele) => ele).map((ele) => ele.id);

		ErrorHelp(
			'failed to get selected mangas non-downloaded chapters',
			client
				.query(ConditionalChaptersOfGivenManga, {
					in: selectedIds,
					isDownloaded: false
				})
				.toPromise(),
			(result) => {
				if (!result?.data) return;
				const tmp = result.data;
				toastStore.trigger({
					message: `You are about to download ${tmp.chapters.nodes.length} chapters to your library!`,
					action: {
						label: 'Download',
						response: () =>
							downloadAllChapters(tmp.chapters.nodes.map((e) => e.id))
					}
				});
			}
		);
	}

	function downloadAllChapters(ids: number[]) {
		ErrorHelp(
			'failed to enqueue chapters Downloads',
			client.mutation(enqueueChapterDownloads, { ids }).toPromise()
		);
	}
	function handelHelp() {
		modalStore.trigger({
			type: 'component',
			backdropClasses: '!p-0',
			component: {
				ref: LibrarySearchHelp
			}
		});
	}
</script>

<div class="flex h-full max-w-full">
	<MediaQuery query="(min-width: {screens.sm})">
		{#snippet children({ matches })}
			{#if matches}
				{#if $selectMode}
					<TooltipIconButton
						onclick={handelDownload}
						tip="Download unread chapters"
						name="mdi:download"
					/>
					<TooltipIconButton
						onclick={handelCategory}
						tip="Change Categories"
						name="mdi:shape"
					/>
					<TooltipIconButton
						onclick={handelDelete}
						tip="Remove Selected"
						name="mdi:bin"
					/>
				{/if}

				<TooltipIconButton
					onclick={selectAll}
					name="mdi:select-all"
					tip="Select all/none"
				/>
			{:else if $selectMode}
				<div class="card p-0" data-popup="popupClick">
					<div class="flex h-12 xs:h-14">
						<TooltipIconButton
							onclick={handelDownload}
							tip="Download unread chapters"
							name="mdi:download"
						/>
						<TooltipIconButton
							onclick={handelCategory}
							tip="Change Categories"
							name="mdi:shape"
						/>
						<TooltipIconButton
							onclick={handelDelete}
							tip="Remove Selected"
							name="mdi:bin"
						/>
						<TooltipIconButton
							onclick={selectAll}
							name="mdi:select-all"
							tip="Select all/none"
						/>
					</div>
					<div class="bg-surface-100-800-token arrow"></div>
				</div>
				<button
					class="variant-filled-primary btn fixed bottom-2 right-2 h-12 text-xl xs:h-14 xs:text-4xl"
					use:popup={popupClick}
				>
					{$selected.filter((e) => e).length}
					<IconWrapper name="mdi:dots-vertical" class="h-full" />
				</button>
			{/if}
		{/snippet}
	</MediaQuery>

	<TooltipIconButton
		onclick={() => {
			$selectMode = !$selectMode;
		}}
		name="mdi:{$selectMode ? 'select-multiple' : 'flip-to-front'}"
		tip="Select Mode"
	/>
	<Search>
		<Tooltip
			tip="Help"
			class="absolute right-0 top-1/2 -translate-y-1/2"
			tipclass="z-70"
			placement="left"
		>
			<button
				onclick={handelHelp}
				class="variant-ghost-primary btn z-[60] w-0 p-3 leading-[0] opacity-20 hover:opacity-100"
			>
				?
			</button>
		</Tooltip>
	</Search>
	<TooltipIconButton
		onclick={handelFilter}
		name="mdi:filter"
		tip="Filter/Sort"
	/>
</div>
