<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	import IntersectionObserver from '$lib/components/IntersectionObserver.svelte';
	import MediaQuery from '$lib/components/MediaQuery.svelte';
	import TooltipIconButton from '$lib/components/TooltipIconButton.svelte';
	import { longPress } from '$lib/press';
	import { screens } from '$lib/screens';
	import { ChapterSort, ChapterTitle, MangaMeta } from '$lib/simpleStores';
	import {
		HelpDoSelect,
		HelpSelectAll,
		HelpUpdateChapters,
		dlreabook
	} from '$lib/util';
	import { getModalStore, popup } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';
	import ChaptersFilterModal from './ChaptersFilterModal.svelte';
	import DownloadProgressRadial from './DownloadProgressRadial.svelte';
	import { selected, selectMode, type chaptertype } from './mangaStores';
	import {
		getContextClient,
		subscriptionStore,
		type OperationResultStore,
		type Pausable
	} from '@urql/svelte';
	import { getSingleChapter, getManga } from '$lib/gql/Queries';
	import { type ResultOf } from '$lib/gql/graphql';
	import { downloadsOnChapters } from '$lib/gql/Subscriptions';
	import {
		deleteDownloadedChapters,
		enqueueChapterDownloads,
		trackProgress,
		updateChapters
	} from '$lib/gql/Mutations';
	import { filterChapters } from '../util';

	export let manga: OperationResultStore<ResultOf<typeof getManga>> & Pausable;
	export let MangaID: number;
	export let mangaMeta: ReturnType<typeof MangaMeta>;

	const client = getContextClient();
	const modalStore = getModalStore();
	const downloads = subscriptionStore({
		client,
		query: downloadsOnChapters
	});

	let lastDownloads: ResultOf<typeof downloadsOnChapters> | undefined =
		undefined;

	$: if ($downloads?.data?.downloadChanged) {
		checkinNeedRefresh();
		lastDownloads = $downloads?.data;
	}

	function checkinNeedRefresh() {
		let filtered = lastDownloads?.downloadChanged.queue.filter(
			(e) =>
				!$downloads?.data?.downloadChanged.queue.find(
					(ee) => ee.chapter.id === e.chapter.id
				)
		);
		if ((filtered?.length ?? 0) > 2) {
			client
				.query(getManga, { id: MangaID }, { requestPolicy: 'network-only' })
				.toPromise();
		} else {
			filtered?.forEach((element) => {
				const existingDownload = $downloads?.data?.downloadChanged.queue.find(
					(e) => e.chapter.id === element.chapter.id
				);
				if (!existingDownload) {
					client
						.query(
							getSingleChapter,
							{ id: element.chapter.id },
							{ requestPolicy: 'network-only' }
						)
						.toPromise();
				}
			});
		}
	}

	$: chaptersInfo = $manga?.data?.manga?.chapters.nodes;

	$: filteredChapters = chaptersInfo?.filter(filterChapters(mangaMeta));

	$: sortedChapters = filteredChapters
		? [...filteredChapters].sort((a, b) => {
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
			})
		: undefined;

	$: sortedChapters, updateselected();
	function updateselected() {
		$selected?.forEach((e) => {
			const tmp = sortedChapters?.find((ee) => ee.id === e.id);
			if (tmp) {
				$selected[tmp.id] = tmp;
			} else {
				delete $selected[e.id];
			}
		});
	}

	let chapterSideElement: HTMLDivElement | undefined;

	async function handelPrevRead(chapter: chaptertype) {
		if (!sortedChapters) return;
		const ind = sortedChapters?.findIndex((e) => e.id === chapter.id);
		const chapters = sortedChapters.slice(ind, sortedChapters.length);
		const ids = chapters.map((e) => e.id);

		await client.mutation(updateChapters, { isRead: true, ids }).toPromise();
		if ($manga.data?.manga.id)
			await client
				.mutation(trackProgress, { mangaId: $manga.data.manga.id })
				.toPromise();
	}

	function HighestChapterNumber() {
		return Math.floor(
			$manga.data?.manga.chapters.nodes?.reduce((a, c) => {
				return c.isRead && c.chapterNumber > a ? c.chapterNumber : a;
			}, 0) ?? 0
		);
	}

	async function handelRead(chapter: chaptertype) {
		if (!manga) return;
		await client
			.mutation(updateChapters, { isRead: true, ids: [chapter.id] })
			.toPromise();
		if ($manga.data?.manga.id)
			await client
				.mutation(trackProgress, { mangaId: $manga.data.manga.id })
				.toPromise();
	}

	async function handelUnRead(chapter: chaptertype) {
		if (!manga) return '';
		if (Math.floor(chapter.chapterNumber) !== HighestChapterNumber()) {
			client
				.mutation(updateChapters, { isRead: false, ids: [chapter.id] })
				.toPromise();
			return;
		}
		await client
			.mutation(updateChapters, { isRead: false, ids: [chapter.id] })
			.toPromise();
	}

	function LongHandler() {
		$selectMode = true;
	}

	let lastSelected: chaptertype | undefined;

	function handelFilter() {
		modalStore.trigger({
			type: 'component',
			backdropClasses: '!p-0',
			component: { ref: ChaptersFilterModal, props: { MangaID } }
		});
	}

	let scrollTo = true;
	let _scrollToChaps: HTMLDivElement[] = [];
	let scrollToChaps: HTMLDivElement | undefined;
	$: if (scrollTo && _scrollToChaps) handelScrollToChaps();

	function handelScrollToChaps() {
		let ind = _scrollToChaps
			.filter((e) => e)
			.findIndex((e) => e.id === location.hash);

		if (ind !== -1 && ind - 3 > 0) {
			scrollToChaps = _scrollToChaps[ind - 3];
		}
	}

	$: if (scrollTo && scrollToChaps) scroll();

	function isScrollable(elem: HTMLElement | undefined) {
		if (!elem) return false;
		return (
			elem.scrollWidth > elem.clientWidth ||
			elem.scrollHeight > elem.clientHeight
		);
	}

	function scroll() {
		scrollTo = false;
		const { top, height } = scrollToChaps?.getBoundingClientRect() ?? {
			top: 0
		};
		let scrollElement;
		if (isScrollable(chapterSideElement)) {
			scrollElement = chapterSideElement;
		} else scrollElement = document.querySelector('#page');
		scrollElement?.scrollTo({
			top: top + scrollElement.scrollTop + (height ?? 0) / 2,
			behavior: 'smooth'
		});
	}

	$: chapterNumbers = sortedChapters?.map((e) => e.chapterNumber) ?? [];
	$: checkArray = Array.from(
		Array(Math.floor(chapterNumbers.reduce((a, c) => Math.max(a, c), 0))),
		(_, index) => index + 1
	);
	$: missingChapters = checkArray?.filter(
		(e) => chapterNumbers?.find((n) => n >= e && n < e + 1) === undefined
	);
</script>

{#if !$manga || $manga.fetching}
	<div
		class="max-h-full w-full
			overflow-x-hidden md:absolute md:bottom-0 md:right-0 md:top-0 md:w-1/2 md:overflow-y-auto"
	>
		<div class="card variant-glass flex items-center space-x-1 p-2">
			<div class="placeholder w-full animate-pulse" />
			<div class="placeholder-circle h-12 animate-pulse" />
			<div class="placeholder-circle h-12 animate-pulse" />
			<div class="placeholder-circle h-12 animate-pulse" />
		</div>
		{#each new Array(10) as _}
			<div class="card variant-glass flex items-center space-x-1 p-2">
				<div class="w-full space-y-1">
					<div class="placeholder w-full animate-pulse" />
					<div class="placeholder w-full animate-pulse" />
				</div>
				<div class="placeholder-circle h-12 animate-pulse" />
			</div>
		{/each}
	</div>
{:else if $manga.error}
	<div
		bind:this={chapterSideElement}
		id="chapterSideElement"
		class="max-h-full w-full whitespace-pre-wrap md:absolute md:bottom-0 md:right-0 md:top-0 md:w-1/2 md:overflow-y-auto"
	>
		Error loading chapters: {JSON.stringify($manga.error, null, 4)}
	</div>
{:else if sortedChapters}
	{@const mangaFrag = $manga.data?.manga}
	<div
		bind:this={chapterSideElement}
		id="chapterSideElement"
		class="max-h-full w-full md:absolute md:bottom-0 md:right-0 md:top-0 md:w-1/2 md:overflow-y-auto"
	>
		<div class="sticky top-0 z-10 h-10 xs:h-14">
			<div class="card variant-glass flex h-full items-center space-x-1 p-0">
				<div class="flex w-full items-center">
					<span class="line-clamp-1 pl-2 text-2xl font-medium md:text-3xl">
						{sortedChapters.length} Chapters
					</span>
					{#if $mangaMeta.showMissingChapters && missingChapters?.length}
						<span
							class="line-clamp-1 h-full pl-2 text-2xl font-medium md:text-xl"
							title={missingChapters.join('\n')}
						>
							Missing {missingChapters.length} Chapters
						</span>
					{/if}
				</div>
				<MediaQuery
					query="(min-width: {screens.lg}),(min-width: {screens.sm}) and (max-width: {screens.md})"
					let:matches
				>
					{#if matches}
						{#if $selectMode}
							<TooltipIconButton
								class="text-surface-700 dark:text-surface-300"
								on:click={() => {
									HelpUpdateChapters(dlreabook.download, selected);
								}}
								tip="download/delete Selected"
								name="mdi:download"
							/>
							<TooltipIconButton
								class="text-surface-700 dark:text-surface-300"
								on:click={() => {
									HelpUpdateChapters(dlreabook.read, selected);
								}}
								tip="Read/unRead Selected"
								name="mdi:book-open-page-variant-outline"
							/>
							<TooltipIconButton
								class="text-surface-700 dark:text-surface-300"
								on:click={() => {
									HelpUpdateChapters(dlreabook.bookmark, selected);
								}}
								tip="bookmark/unbookmark Selected"
								name="mdi:bookmark"
							/>
						{/if}
						<TooltipIconButton
							class="text-surface-700 dark:text-surface-300"
							on:click={() =>
								HelpSelectAll(selectMode, selected, sortedChapters)}
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
							<IconWrapper
								name="mdi:dots-vertical"
								class="aspect-square h-full w-full text-surface-700 dark:text-surface-300"
							/>
						</button>
						<div class="card max-w-xs rounded-lg p-0" data-popup="selectmenu">
							<button
								class="flex w-full items-center justify-start rounded-t-lg p-4 text-2xl hover:variant-glass-surface"
								on:click={() => {
									HelpUpdateChapters(dlreabook.download, selected);
								}}
							>
								<IconWrapper name="mdi:download" class="mr-2" />download /
								delete
							</button>
							<button
								class="flex w-full items-center justify-start p-4 text-2xl hover:variant-glass-surface"
								on:click={() => {
									HelpUpdateChapters(dlreabook.read, selected);
								}}
							>
								<IconWrapper
									name="mdi:book-open-page-variant-outline"
									class="mr-2"
								/>Un/Read
							</button>
							<button
								class="flex w-full items-center justify-start p-4 text-2xl hover:variant-glass-surface"
								on:click={() => {
									HelpUpdateChapters(dlreabook.bookmark, selected);
								}}
							>
								<IconWrapper name="mdi:bookmark" class="mr-2" />Un/bookmark
							</button>
							<button
								class="flex w-full items-center justify-start rounded-b-lg p-4 text-2xl hover:variant-glass-surface"
								on:click={() =>
									HelpSelectAll(selectMode, selected, sortedChapters)}
							>
								<IconWrapper name="mdi:select-all" class="mr-2" />Select all
							</button>
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
				<TooltipIconButton
					class="text-surface-700 dark:text-surface-300"
					on:click={handelFilter}
					name="mdi:filter"
					tip="Filter/Sort"
				/>
			</div>
		</div>
		<MediaQuery query="(min-width: {screens.md})" let:matches>
			{#each sortedChapters as chapter, index (chapter.id)}
				<IntersectionObserver
					let:intersecting
					class="relative h-20"
					root={(matches
						? chapterSideElement
						: document.querySelector('#page')) ?? undefined}
					top={400}
					bottom={400}
				>
					<div
						id="#{chapter.id}"
						bind:this={_scrollToChaps[index]}
						class="h-full"
					>
						{#if intersecting}
							<a
								in:fade
								class="card variant-glass flex h-full items-center space-x-1 p-2"
								use:longPress
								on:longPress={() => $selectMode || LongHandler()}
								href="/manga/{mangaFrag?.id}/chapter/{chapter.id}"
								on:click={(e) => {
									if (e.ctrlKey) return;
									if ($selectMode) {
										e.preventDefault();
										e.stopPropagation();
										lastSelected = HelpDoSelect(
											chapter,
											e,
											lastSelected,
											sortedChapters,
											selected
										);
									}
								}}
							>
								{#if chapter.isBookmarked}
									<IconWrapper
										name="mdi:bookmark"
										class="aspect-square h-1/2 w-auto text-primary-500"
									/>
								{/if}
								<div class="w-full space-y-0 {chapter.isRead && 'opacity-50'}">
									<div class="line-clamp-1 w-full text-xl md:text-2xl">
										{$mangaMeta.ChapterTitle === ChapterTitle['Source Title']
											? chapter.name
											: `Chapter ${chapter.chapterNumber}`}
									</div>
									<div
										class="line-clamp-1 w-full text-sm font-light md:text-base"
										title="Fetched Date: {new Date(
											parseInt(chapter.fetchedAt) * 1000
										).toLocaleString()}&#013;Upload Date: {new Date(
											parseInt(chapter.uploadDate)
										).toLocaleString()}"
									>
										{new Date(
											$mangaMeta.ChapterFetchUpload
												? parseInt(chapter.uploadDate)
												: parseInt(chapter.fetchedAt) * 1000
										).toLocaleDateString()}{chapter.isDownloaded
											? ' • Downloaded'
											: ''}{chapter.scanlator ? ` • ${chapter.scanlator}` : ''}
									</div>
								</div>

								<DownloadProgressRadial
									download={$downloads?.data?.downloadChanged?.queue.find(
										(e) => e.chapter.id === chapter.id
									)}
								/>

								{#if $selectMode}
									<button class="h-full rounded-full p-2 hover:variant-ghost">
										<IconWrapper
											class="aspect-square h-full w-full text-surface-700 dark:text-surface-300"
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
									class="h-full rounded-full p-2 hover:variant-ghost"
								>
									<IconWrapper
										name="mdi:dots-vertical"
										class="aspect-square h-full w-full text-surface-700 dark:text-surface-300"
									/>
								</button>
							</a>
							<div class="card z-10 w-72 p-2 shadow-xl" data-popup={chapter.id}>
								<div>
									{#if chapter.isDownloaded}
										<button
											on:click={() => {
												client
													.mutation(deleteDownloadedChapters, {
														ids: [chapter.id]
													})
													.toPromise();
											}}
											class="variant-glass w-full cursor-pointer select-none p-2 hover:variant-soft"
										>
											delete
										</button>
									{:else}
										<button
											on:click={() =>
												client
													.mutation(enqueueChapterDownloads, {
														ids: [chapter.id]
													})
													.toPromise()}
											class="variant-glass w-full cursor-pointer select-none p-2 hover:variant-soft"
										>
											download
										</button>
									{/if}
									{#if chapter.isBookmarked}
										<button
											on:click={() =>
												client
													.mutation(updateChapters, {
														isBookmarked: false,
														ids: [chapter.id]
													})
													.toPromise()}
											class="variant-glass w-full cursor-pointer select-none p-2 hover:variant-soft"
										>
											unbookmark
										</button>
									{:else}
										<button
											on:click={() =>
												client
													.mutation(updateChapters, {
														isBookmarked: true,
														ids: [chapter.id]
													})
													.toPromise()}
											class="variant-glass w-full cursor-pointer select-none p-2 hover:variant-soft"
										>
											bookmark
										</button>
									{/if}
									{#if chapter.isRead}
										<button
											on:click={() => handelUnRead(chapter)}
											class="variant-glass w-full cursor-pointer select-none p-2 hover:variant-soft"
										>
											mark as unread
										</button>
									{:else}
										<button
											on:click={() => handelRead(chapter)}
											class="variant-glass w-full cursor-pointer select-none p-2 hover:variant-soft"
										>
											mark as read
										</button>
									{/if}
									<button
										on:click={() => handelPrevRead(chapter)}
										class="variant-glass w-full cursor-pointer select-none p-2 hover:variant-soft"
									>
										mark previous as read
									</button>
								</div>
								<div class="bg-surface-100-800-token arrow" />
							</div>
						{/if}
					</div>
				</IntersectionObserver>
			{/each}
		</MediaQuery>
	</div>
	{#if sortedChapters.filter((e) => !e.isRead).length}
		<MediaQuery query="(min-width: {screens.md})" let:matches>
			<a
				href="/manga/{mangaFrag?.id}/chapter/{sortedChapters
					.filter((e) => !e.isRead)
					.sort((a, b) => (a.sourceOrder > b.sourceOrder ? 1 : -1))[0].id}"
				class="variant-filled-primary btn fixed hover:variant-glass-primary {matches
					? 'bottom-2'
					: 'bottom-[4.5rem]'} right-16 z-10"
			>
				resume
			</a>
		</MediaQuery>
	{/if}
{/if}
