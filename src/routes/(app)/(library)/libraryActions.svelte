<script lang="ts">
	import Search from './../../../lib/components/Search.svelte';
	import LibraryMassCategoryModal from './LibraryMassCategoryModal.svelte';
	import LibraryFilterModal from './LibraryFilterModal.svelte';
	import TooltipIconButton from '$lib/components/TooltipIconButton.svelte';
	import {
		AsyncConditionalChaptersOfGivenManga,
		enqueueChapterDownloads,
		updateMangas
	} from '$lib/generated';
	import { getModalStore, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { getToastStore } from '$lib/components/Toast/stores';
	import MediaQuery from '$lib/components/MediaQuery.svelte';
	import { screens } from '$lib/screens';
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	import { selected, selectmode } from './LibraryStores';
	import { Errorhelp } from '$lib/util';

	export let selectall: () => void;

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	function handelfilter() {
		modalStore.trigger({
			type: 'component',
			component: { ref: LibraryFilterModal }
		});
	}

	async function RemoveSelectedFromLibrary() {
		const ids = $selected.filter((ele) => ele).map((ele) => ele.id);
		const variables = {
			ids,
			inLibrary: false
		};
		Errorhelp(
			'Failed to delete mangas from library',
			updateMangas({
				variables
			}),
			toastStore
		);
	}

	function handelDelete() {
		toastStore.trigger({
			message: `You are about to remove ${
				$selected.filter((ele) => ele).length
			} manga from your library!`,
			action: {
				label: 'Delete',
				response: RemoveSelectedFromLibrary
			},
			actionClass: 'btn variant-filled-error',
			background: 'variant-filled-warning'
		});
	}

	function handelCategory() {
		modalStore.trigger({
			type: 'component',
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

	async function handelownload(): Promise<void> {
		const selectedids = $selected.filter((ele) => ele).map((ele) => ele.id);

		Errorhelp(
			'failed to get selected mangas non-downloaded chapters',
			AsyncConditionalChaptersOfGivenManga({ variables: { in: selectedids, isDownloaded: false } }),
			toastStore,
			(result) => {
				if (!result?.data) return;
				const tmp = result.data;
				toastStore.trigger({
					message: `You are about to download ${tmp.chapters.nodes.length} chapters to your library!`,
					action: {
						label: 'Download',
						response: () => downloadAllChapters(tmp.chapters.nodes.map((e) => e.id))
					}
				});
			}
		);
	}

	function downloadAllChapters(ids: number[]) {
		Errorhelp(
			'failed to enqueue chapters Downloads',
			enqueueChapterDownloads({ variables: { ids } }),
			toastStore
		);
	}
</script>

<div class="h-full flex max-w-full">
	<MediaQuery query="(min-width: {screens.sm})" let:matches>
		{#if matches}
			{#if $selectmode}
				<TooltipIconButton
					on:click={handelownload}
					tip="Download unread chapters"
					name="mdi:download"
				/>
				<TooltipIconButton on:click={handelCategory} tip="Change Categories" name="mdi:shape" />
				<TooltipIconButton on:click={handelDelete} tip="Remove Selected" name="mdi:bin" />
			{/if}

			<TooltipIconButton on:click={selectall} name="mdi:select-all" tip="Select all/none" />
		{:else if $selectmode}
			<div class="card p-0" data-popup="popupClick">
				<div class="h-12 xs:h-14 flex">
					<TooltipIconButton
						on:click={handelownload}
						tip="Download unread chapters"
						name="mdi:download"
					/>
					<TooltipIconButton on:click={handelCategory} tip="Change Categories" name="mdi:shape" />
					<TooltipIconButton on:click={handelDelete} tip="Remove Selected" name="mdi:bin" />
					<TooltipIconButton on:click={selectall} name="mdi:select-all" tip="Select all/none" />
				</div>
				<div class="arrow bg-surface-100-800-token" />
			</div>
			<button
				class="btn variant-filled-primary fixed right-2 bottom-2 text-xl xs:text-4xl h-12 xs:h-14"
				use:popup={popupClick}
			>
				{$selected.filter((e) => e).length}
				<IconWrapper name="mdi:dots-vertical" class="h-full" />
			</button>
		{/if}
	</MediaQuery>

	<TooltipIconButton
		on:click={() => {
			$selectmode = !$selectmode;
		}}
		name="mdi:{$selectmode ? 'select-multiple' : 'flip-to-front'}"
		tip="Select Mode"
	/>
	<Search />
	<TooltipIconButton on:click={handelfilter} name="mdi:filter" tip="Filter/Sort" />
</div>
