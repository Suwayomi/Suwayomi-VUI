<script lang="ts">
	import { goto } from '$app/navigation';
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	import IntersectionObserver from '$lib/components/IntersectionObserver.svelte';
	import MediaQuery from '$lib/components/MediaQuery.svelte';
	import { getToastStore } from '$lib/components/Toast/stores';
	import TooltipIconButton from '$lib/components/TooltipIconButton.svelte';
	import {
		deleteDownloadedChapters,
		enqueueChapterDownloads,
		updateChapters,
		type GetMangaQuery
	} from '$lib/generated';
	import { longpress } from '$lib/press';
	import { screens } from '$lib/screens';
	import { HelpDoSelect, HelpSelectall, HelpUpdateChapters, dlreabook } from '$lib/util';
	import type { ApolloQueryResult } from '@apollo/client';
	import { getModalStore, popup } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';
	import ChaptersFilterModal from './ChaptersFilterModal.svelte';
	import { selected, selectmode, type chaptertype } from './mangaStores';
	import { MangaMeta, ChapterSort, ChapterTitle } from '$lib/simpleStores';

	export let manga: ApolloQueryResult<GetMangaQuery> | undefined;
	export let MangaID: number;

	const modalStore = getModalStore();
	const toastStore = getToastStore();
	const mangaMeta = MangaMeta(MangaID);

	$: chaptersInfo = manga?.data.manga?.chapters.nodes as
		| GetMangaQuery['manga']['chapters']['nodes']
		| undefined;

	$: filteredChapters = chaptersInfo?.filter((chapter) => {
		if ($mangaMeta.ChapterUnread === 1 && chapter.isRead) return false;
		if ($mangaMeta.ChapterUnread === 2 && !chapter.isRead) return false;

		if ($mangaMeta.ChapterDownloaded === 1 && !chapter.isDownloaded) return false;
		if ($mangaMeta.ChapterDownloaded === 2 && chapter.isDownloaded) return false;

		if ($mangaMeta.ChapterBookmarked === 1 && !chapter.isBookmarked) return false;
		if ($mangaMeta.ChapterBookmarked === 2 && chapter.isBookmarked) return false;
		return true;
	});

	$: sortedChapters = filteredChapters?.sort((a, b) => {
		let tmp = true;
		if ($mangaMeta.ChapterSort === ChapterSort.Source) {
			tmp = a.sourceOrder > b.sourceOrder;
		} else if ($mangaMeta.ChapterSort === ChapterSort['Fetched Date']) {
			tmp = a.fetchedAt > b.fetchedAt;
		} else {
			tmp = a.uploadDate > b.uploadDate;
		}
		if ($mangaMeta.ChapterAsc) tmp = !tmp;
		return tmp ? -1 : 1;
	});

	$: sortedChapters, updateselected();
	function updateselected() {
		$selected?.forEach((e) => {
			const tmp = sortedChapters?.find((ee) => ee.id === e.id);
			if (tmp) {
				$selected[tmp.id] = tmp;
			}
		});
	}

	let chapterSideElement: HTMLDivElement | undefined;

	function handelPrevRead(chapter: chaptertype) {
		if (!sortedChapters) return;
		const ind = sortedChapters?.findIndex((e) => e.id === chapter.id);
		const ids = sortedChapters.slice(ind, sortedChapters.length).map((e) => e.id);
		updateChapters({ variables: { isRead: true, ids: ids } });
	}

	function LongHandler() {
		$selectmode = true;
	}

	let lastselected: chaptertype | undefined;

	function handelfilter() {
		modalStore.trigger({
			type: 'component',
			component: { ref: ChaptersFilterModal, props: { MangaID } }
		});
	}
</script>

{#if !manga || manga.loading}
	<div
		class="w-full md:w-1/2
			md:overflow-y-auto overflow-x-hidden max-h-full md:absolute md:right-0 md:bottom-0 md:top-0"
	>
		<div class="card variant-glass p-2 flex items-center space-x-1">
			<div class="placeholder animate-pulse w-full" />
			<div class="placeholder-circle animate-pulse h-12" />
			<div class="placeholder-circle animate-pulse h-12" />
			<div class="placeholder-circle animate-pulse h-12" />
		</div>
		{#each new Array(10) as _}
			<div class="card variant-glass p-2 flex items-center space-x-1">
				<div class="space-y-1 w-full">
					<div class="placeholder animate-pulse w-full" />
					<div class="placeholder animate-pulse w-full" />
				</div>
				<div class="placeholder-circle animate-pulse h-12" />
			</div>
		{/each}
	</div>
{:else if manga.error}
	Error loading chapters: {JSON.stringify(manga.error)}
{:else if sortedChapters}
	<div
		bind:this={chapterSideElement}
		id="chapterSideElement"
		class="w-full md:w-1/2 md:overflow-y-auto max-h-full md:absolute md:right-0 md:bottom-0 md:top-0"
	>
		<div class="sticky top-0 z-10 h-10 xs:h-14">
			<div class="card variant-glass p-0 flex items-center space-x-1 h-full">
				<span class="w-full text-3xl font-medium pl-2 line-clamp-1">
					{sortedChapters.length} Chapters
				</span>
				<MediaQuery
					query="(min-width: {screens.lg}),(min-width: {screens.sm}) and (max-width: {screens.md})"
					let:matches
				>
					{#if matches}
						{#if $selectmode}
							<TooltipIconButton
								class="text-surface-700 dark:text-surface-300"
								on:click={() => {
									HelpUpdateChapters(dlreabook.download, selected, toastStore);
								}}
								tip="download/delete Selected"
								name="mdi:download"
							/>
							<TooltipIconButton
								class="text-surface-700 dark:text-surface-300"
								on:click={() => {
									HelpUpdateChapters(dlreabook.read, selected, toastStore);
								}}
								tip="Read/unRead Selected"
								name="mdi:book-open-page-variant-outline"
							/>
							<TooltipIconButton
								class="text-surface-700 dark:text-surface-300"
								on:click={() => {
									HelpUpdateChapters(dlreabook.bookmark, selected, toastStore);
								}}
								tip="bookmark/unbookmark Selected"
								name="mdi:bookmark"
							/>
						{/if}
						<TooltipIconButton
							class="text-surface-700 dark:text-surface-300"
							on:click={() => HelpSelectall(selectmode, selected, sortedChapters)}
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
							<IconWrapper
								name="mdi:dots-vertical"
								class="aspect-square w-full h-full text-surface-700 dark:text-surface-300"
							/>
						</button>
						<div class="card p-0 rounded-lg max-w-xs" data-popup="selectmenu">
							<button
								class="text-2xl hover:variant-glass-surface w-full rounded-t-lg p-4 flex items-center justify-start"
								on:click={() => {
									HelpUpdateChapters(dlreabook.download, selected, toastStore);
								}}
							>
								<IconWrapper name="mdi:download" class="mr-2" />download / delete
							</button>
							<button
								class="text-2xl hover:variant-glass-surface w-full p-4 flex items-center justify-start"
								on:click={() => {
									HelpUpdateChapters(dlreabook.read, selected, toastStore);
								}}
							>
								<IconWrapper name="mdi:book-open-page-variant-outline" class="mr-2" />Un/Read
							</button>
							<button
								class="text-2xl hover:variant-glass-surface w-full p-4 flex items-center justify-start"
								on:click={() => {
									HelpUpdateChapters(dlreabook.bookmark, selected, toastStore);
								}}
							>
								<IconWrapper name="mdi:bookmark" class="mr-2" />Un/bookmark
							</button>
							<button
								class="text-2xl hover:variant-glass-surface w-full rounded-b-lg p-4 flex items-center justify-start"
								on:click={() => HelpSelectall(selectmode, selected, sortedChapters)}
							>
								<IconWrapper name="mdi:select-all" class="mr-2" />Select all
							</button>
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
				<TooltipIconButton
					class="text-surface-700 dark:text-surface-300"
					on:click={handelfilter}
					name="mdi:filter"
					tip="Filter/Sort"
				/>
			</div>
		</div>
		<MediaQuery query="(min-width: {screens.md})" let:matches>
			{#each sortedChapters as chapter (chapter.id)}
				<IntersectionObserver
					let:intersecting
					class="h-20 relative"
					root={(matches ? chapterSideElement : document.querySelector('#page')) ?? undefined}
					top={400}
					bottom={400}
				>
					{#if intersecting}
						<a
							in:fade
							class="card variant-glass p-2 flex items-center space-x-1 h-full relative"
							use:longpress
							on:longpress={() => $selectmode || LongHandler()}
							href="{manga.data.manga.id}/chapter/{chapter.id}"
							on:click|stopPropagation={(e) => {
								if (e.ctrlKey) return;
								if ($selectmode) {
									e.preventDefault();
									lastselected = HelpDoSelect(chapter, e, lastselected, sortedChapters, selected);
								} else {
									e.preventDefault();
									goto(`${manga?.data.manga.id}/chapter/${chapter.id}`);
								}
							}}
						>
							{#if chapter.isBookmarked}
								<IconWrapper
									name="mdi:bookmark"
									class="text-primary-500 h-1/2 w-auto aspect-square"
								/>
							{/if}
							<div class="space-y-0 w-full {chapter.isRead && 'opacity-50'}">
								<div class="w-full line-clamp-1 text-2xl">
									{$mangaMeta.ChapterTitle === ChapterTitle['Source Title']
										? chapter.name
										: `Chapter ${chapter.chapterNumber}`}
								</div>
								<div
									class="w-full line-clamp-1 font-light"
									title="Fetched Date: {new Date(
										chapter.fetchedAt * 1000
									).toLocaleString()}&#013;Upload Date: {new Date(
										parseInt(chapter.uploadDate)
									).toLocaleString()}"
								>
									{new Date(
										$mangaMeta.ChapterFetchUpload
											? parseInt(chapter.uploadDate)
											: chapter.fetchedAt * 1000
									).toLocaleDateString()}{chapter.isDownloaded ? ' • Downloaded' : ''}
								</div>
							</div>
							{#if $selectmode}
								<button class="hover:variant-ghost rounded-full h-full p-2">
									<IconWrapper
										class="aspect-square w-full h-full text-surface-700 dark:text-surface-300"
										name={$selected[chapter.id] === undefined
											? 'fluent:checkbox-unchecked-24-filled'
											: 'fluent:checkbox-checked-24-filled'}
									/>
								</button>
							{/if}
							<button
								use:popup={{
									event: 'click',
									target: chapter.id.toString(),
									placement: 'bottom'
								}}
								on:click|preventDefault|stopPropagation={() => {}}
								class="hover:variant-ghost rounded-full h-full p-2"
							>
								<IconWrapper
									name="mdi:dots-vertical"
									class="aspect-square w-full h-full text-surface-700 dark:text-surface-300"
								/>
							</button>
						</a>
						<div class="card p-2 w-72 shadow-xl z-10" data-popup={chapter.id}>
							<div>
								{#if chapter.isDownloaded}
									<button
										on:click={() => {
											deleteDownloadedChapters({ variables: { ids: chapter.id } });
										}}
										class="variant-glass hover:variant-soft p-2 cursor-pointer select-none w-full"
									>
										delete
									</button>
								{:else}
									<button
										on:click={() => enqueueChapterDownloads({ variables: { ids: chapter.id } })}
										class="variant-glass hover:variant-soft p-2 cursor-pointer select-none w-full"
									>
										download
									</button>
								{/if}
								{#if chapter.isBookmarked}
									<button
										on:click={() =>
											updateChapters({ variables: { isBookmarked: false, ids: chapter.id } })}
										class="variant-glass hover:variant-soft p-2 cursor-pointer select-none w-full"
									>
										unbookmark
									</button>
								{:else}
									<button
										on:click={() =>
											updateChapters({ variables: { isBookmarked: true, ids: chapter.id } })}
										class="variant-glass hover:variant-soft p-2 cursor-pointer select-none w-full"
									>
										bookmark
									</button>
								{/if}
								{#if chapter.isRead}
									<button
										on:click={() =>
											updateChapters({ variables: { isRead: false, ids: chapter.id } })}
										class="variant-glass hover:variant-soft p-2 cursor-pointer select-none w-full"
									>
										mark as unread
									</button>
								{:else}
									<button
										on:click={() =>
											updateChapters({ variables: { isRead: true, ids: chapter.id } })}
										class="variant-glass hover:variant-soft p-2 cursor-pointer select-none w-full"
									>
										mark as read
									</button>
								{/if}
								<button
									on:click={() => handelPrevRead(chapter)}
									class="variant-glass hover:variant-soft p-2 cursor-pointer select-none w-full"
								>
									mark previous as read
								</button>
							</div>
							<div class="arrow bg-surface-100-800-token" />
						</div>
					{/if}
				</IntersectionObserver>
			{/each}
		</MediaQuery>
	</div>
	{#if sortedChapters.filter((e) => !e.isRead).length}
		<a
			href="{manga.data.manga.id}/chapter/{sortedChapters
				.filter((e) => !e.isRead)
				.sort((a, b) => (a.sourceOrder > b.sourceOrder ? 1 : -1))[0].id}"
			class="btn variant-filled-primary hover:variant-glass-primary fixed bottom-2 right-16"
		>
			resume
		</a>
	{/if}
{/if}
