<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	import MediaQuery from '$lib/components/MediaQuery.svelte';
	import TooltipIconButton from '$lib/components/TooltipIconButton.svelte';
	import { longPress } from '$lib/press';
	import { screens } from '$lib/screens';
	import { ChapterSort, ChapterTitle, mmState } from '$lib/simpleStores.svelte';
	import { OTT, dlreabook } from '$lib/util.svelte';
	import { getModalStore, popup } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';
	import ChaptersFilterModal from './ChaptersFilterModal.svelte';
	import DownloadProgressRadial from './DownloadProgressRadial.svelte';
	import { selectState, type chapterType } from './mangaStores.svelte';
	import { getContextClient } from '@urql/svelte';
	import {
		deleteDownloadedChapters,
		enqueueChapterDownloads,
		trackProgress,
		updateChapters
	} from '$lib/gql/Mutations';
	import { filterChapters } from '../util';
	import { untrack } from 'svelte';
	import { manga } from './mangaStores.svelte';
	import { downloadChanged } from '$lib/DownloadChanged.svelte';
	import {
		IntersectionObserverAction,
		MakeSimpleCallback
	} from '$lib/actions/IntersectionObserver.svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { InitScrollTo } from '$lib/actions/InitScrollTo.svelte';
	import { page } from '$app/state';

	interface Props {
		MangaID: number;
	}

	let { MangaID }: Props = $props();

	const client = getContextClient();
	const modalStore = getModalStore();

	function updateSelected() {
		OTT([sortedChapters], () => {
			selectState.selected?.forEach((e) => {
				const tmp = sortedChapters?.find((ee) => ee.id === e.id);
				if (tmp) {
					selectState.selected.set(tmp.id, tmp);
				} else {
					selectState.selected.delete(e.id);
				}
			});
		});
	}

	let chapterSideElement: HTMLDivElement | undefined = $state();

	async function handelPrevRead(chapter: chapterType) {
		if (!sortedChapters) return;
		const ind = sortedChapters?.findIndex((e) => e.id === chapter.id);
		const chapters = sortedChapters.slice(ind, sortedChapters.length);
		const ids = chapters.map((e) => e.id);

		await client.mutation(updateChapters, { isRead: true, ids }).toPromise();
		if (manga.value?.data?.manga.id)
			await client
				.mutation(trackProgress, { mangaId: manga.value?.data.manga.id })
				.toPromise();
	}

	function HighestChapterNumber() {
		return Math.floor(
			manga.value?.data?.manga.chapters.nodes?.reduce((a, c) => {
				return c.isRead && c.chapterNumber > a ? c.chapterNumber : a;
			}, 0) ?? 0
		);
	}

	async function handelRead(chapter: chapterType) {
		if (!manga) return;
		await client
			.mutation(updateChapters, { isRead: true, ids: [chapter.id] })
			.toPromise();
		if (manga.value?.data?.manga.id)
			await client
				.mutation(trackProgress, { mangaId: manga.value?.data.manga.id })
				.toPromise();
	}

	async function handelUnRead(chapter: chapterType) {
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
		selectState.selectMode = true;
	}

	let lastSelected: chapterType | undefined = $state();

	function handelFilter() {
		modalStore.trigger({
			type: 'component',
			backdropClasses: '!p-0',
			component: { ref: ChaptersFilterModal, props: { MangaID } }
		});
	}

	let scrollTo = $state(true);
	let scrollToChaps: HTMLDivElement | undefined = $state();
	let hash = $derived(page.url.hash);

	let chaptersInfo = $derived(manga.value?.data?.manga?.chapters.nodes);
	let filteredChapters = $derived(
		chaptersInfo?.filter(filterChapters(mmState))
	);
	let sortedChapters = $derived(
		filteredChapters
			? [...filteredChapters].sort((a, b) => {
					let tmp = true;
					if (mmState.value.ChapterSort === ChapterSort.Source) {
						tmp = a.sourceOrder > b.sourceOrder;
					} else if (
						mmState.value.ChapterSort === ChapterSort['Fetched Date']
					) {
						tmp = a.fetchedAt > b.fetchedAt;
					} else {
						tmp = a.uploadDate > b.uploadDate;
					}
					if (mmState.value.ChapterAsc) tmp = !tmp;
					return tmp ? -1 : 1;
				})
			: undefined
	);
	$effect(updateSelected);

	$effect(() => {
		if (scrollTo && scrollToChaps) untrack(scroll);
	});
	$effect(() => {
		const _ = [manga.value?.data?.manga?.id, hash];
		window.requestAnimationFrame(() => {
			scrollTo = true;
		});
	});
	let chapterNumbers = $derived(
		sortedChapters?.map((e) => e.chapterNumber) ?? []
	);
	let checkArray = $derived(
		Array.from(
			Array(Math.floor(chapterNumbers.reduce((a, c) => Math.max(a, c), 0))),
			(_, index) => index + 1
		)
	);
	let missingChapters = $derived(
		checkArray?.filter(
			(e) => chapterNumbers?.find((n) => n >= e && n < e + 1) === undefined
		)
	);

	let intersecting: SvelteSet<number> = $state(new SvelteSet());
</script>

{#if !manga.value || manga.value?.fetching}
	<div
		class="max-h-full w-full
			overflow-x-hidden md:absolute md:bottom-0 md:right-0 md:top-0 md:w-1/2 md:overflow-y-auto"
	>
		<div class="card variant-glass flex items-center space-x-1 p-2">
			<div class="placeholder w-full animate-pulse"></div>
			<div class="placeholder-circle h-12 animate-pulse"></div>
			<div class="placeholder-circle h-12 animate-pulse"></div>
			<div class="placeholder-circle h-12 animate-pulse"></div>
		</div>
		{#each new Array(10) as _, i (i)}
			<div class="card variant-glass flex items-center space-x-1 p-2">
				<div class="w-full space-y-1">
					<div class="placeholder w-full animate-pulse"></div>
					<div class="placeholder w-full animate-pulse"></div>
				</div>
				<div class="placeholder-circle h-12 animate-pulse"></div>
			</div>
		{/each}
	</div>
{:else if manga.value?.error}
	<div
		bind:this={chapterSideElement}
		id="chapterSideElement"
		class="max-h-full w-full whitespace-pre-wrap md:absolute md:bottom-0 md:right-0 md:top-0 md:w-1/2 md:overflow-y-auto"
	>
		Error loading chapters: {JSON.stringify(manga.value?.error, null, 4)}
	</div>
{:else if sortedChapters}
	{@const mangaFrag = manga.value?.data?.manga}
	<div
		use:InitScrollTo={{
			cssQuerySelector: hash ? `#c-${hash.slice(1)}` : '',
			runNow: !!sortedChapters.length
		}}
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
					{#if mmState.value.showMissingChapters && missingChapters?.length}
						<span
							class="line-clamp-1 h-full pl-2 text-2xl font-medium md:text-xl"
							title={missingChapters.join('\n')}
						>
							Missing {missingChapters.length} ChaptersrunNow
						</span>
					{/if}
				</div>
				<MediaQuery
					query="(min-width: {screens.lg}),(min-width: {screens.sm}) and (max-width: {screens.md})"
				>
					{#snippet children({ matches })}
						{#if matches}
							{#if selectState.selectMode}
								<TooltipIconButton
									class="text-surface-700 dark:text-surface-300"
									onclick={() => {
										selectState.UpdateChapters(dlreabook.download);
									}}
									tip="download/delete Selected"
									name="mdi:download"
								/>
								<TooltipIconButton
									class="text-surface-700 dark:text-surface-300"
									onclick={() => {
										selectState.UpdateChapters(dlreabook.read);
									}}
									tip="Read/unRead Selected"
									name="mdi:book-open-page-variant-outline"
								/>
								<TooltipIconButton
									class="text-surface-700 dark:text-surface-300"
									onclick={() => {
										selectState.UpdateChapters(dlreabook.bookmark);
									}}
									tip="bookmark/unbookmark Selected"
									name="mdi:bookmark"
								/>
							{/if}
							<TooltipIconButton
								class="text-surface-700 dark:text-surface-300"
								onclick={() => selectState.SelectAll(sortedChapters)}
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
								<IconWrapper
									name="mdi:dots-vertical"
									class="aspect-square h-full w-full text-surface-700 dark:text-surface-300"
								/>
							</button>
							<div class="card max-w-xs rounded-lg p-0" data-popup="selectmenu">
								<button
									class="flex w-full items-center justify-start rounded-t-lg p-4 text-2xl hover:variant-glass-surface"
									onclick={() => {
										selectState.UpdateChapters(dlreabook.download);
									}}
								>
									<IconWrapper name="mdi:download" class="mr-2" />download /
									delete
								</button>
								<button
									class="flex w-full items-center justify-start p-4 text-2xl hover:variant-glass-surface"
									onclick={() => {
										selectState.UpdateChapters(dlreabook.read);
									}}
								>
									<IconWrapper
										name="mdi:book-open-page-variant-outline"
										class="mr-2"
									/>Un/Read
								</button>
								<button
									class="flex w-full items-center justify-start p-4 text-2xl hover:variant-glass-surface"
									onclick={() => {
										selectState.UpdateChapters(dlreabook.bookmark);
									}}
								>
									<IconWrapper name="mdi:bookmark" class="mr-2" />Un/bookmark
								</button>
								<button
									class="flex w-full items-center justify-start rounded-b-lg p-4 text-2xl hover:variant-glass-surface"
									onclick={() => selectState.SelectAll(sortedChapters)}
								>
									<IconWrapper name="mdi:select-all" class="mr-2" />Select all
								</button>
							</div>
						{/if}
					{/snippet}
				</MediaQuery>
				<TooltipIconButton
					class="text-surface-700 dark:text-surface-300"
					onclick={() => {
						selectState.selectMode = !$state.snapshot(selectState.selectMode);
					}}
					name="mdi:{selectState.selectMode
						? 'select-multiple'
						: 'flip-to-front'}"
					tip="Select Mode"
				/>
				<TooltipIconButton
					class="text-surface-700 dark:text-surface-300"
					onclick={handelFilter}
					name="mdi:filter"
					tip="Filter/Sort"
				/>
			</div>
		</div>
		<MediaQuery query="(min-width: {screens.md})">
			{#snippet children({ matches })}
				{#each sortedChapters as chapter (chapter.id + ' ' + MangaID)}
					<div
						use:IntersectionObserverAction={{
							rootMargin: '400px 0px 400px 0px',
							root:
								(matches
									? chapterSideElement
									: document.querySelector('#page')) ?? undefined,
							callback: MakeSimpleCallback(intersecting, chapter.id)
						}}
						id="c-{chapter.id}"
						class="h-20"
					>
						{#if intersecting.has(chapter.id)}
							<a
								in:fade
								class="card variant-glass flex h-full items-center space-x-1 p-2"
								use:longPress
								onlongPress={() => selectState.selectMode || LongHandler()}
								href="/manga/{mangaFrag?.id}/chapter/{chapter.id}"
								onclick={(e) => {
									if (e.ctrlKey) return;
									if (selectState.selectMode) {
										e.preventDefault();
										e.stopPropagation();
										lastSelected = selectState.DoSelect(
											chapter,
											e,
											lastSelected,
											sortedChapters
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
										{mmState.value.ChapterTitle === ChapterTitle['Source Title']
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
											mmState.value.ChapterFetchUpload
												? parseInt(chapter.uploadDate)
												: parseInt(chapter.fetchedAt) * 1000
										).toLocaleDateString()}{chapter.isDownloaded
											? ' • Downloaded'
											: ''}{chapter.scanlator ? ` • ${chapter.scanlator}` : ''}
									</div>
								</div>

								<DownloadProgressRadial
									download={downloadChanged.downlaods?.find(
										(e) => e.chapter.id === chapter.id
									)}
								/>

								{#if selectState.selectMode}
									<button class="h-full rounded-full p-2 hover:variant-ghost">
										<IconWrapper
											class="aspect-square h-full w-full text-surface-700 dark:text-surface-300"
											name={selectState.selected.get(chapter.id) === undefined
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
									onclick={(e) => {
										e.stopPropagation();
										e.preventDefault();
									}}
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
											onclick={() => {
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
											onclick={() =>
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
											onclick={() =>
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
											onclick={() =>
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
											onclick={() => handelUnRead(chapter)}
											class="variant-glass w-full cursor-pointer select-none p-2 hover:variant-soft"
										>
											mark as unread
										</button>
									{:else}
										<button
											onclick={() => handelRead(chapter)}
											class="variant-glass w-full cursor-pointer select-none p-2 hover:variant-soft"
										>
											mark as read
										</button>
									{/if}
									<button
										onclick={() => handelPrevRead(chapter)}
										class="variant-glass w-full cursor-pointer select-none p-2 hover:variant-soft"
									>
										mark previous as read
									</button>
								</div>
								<div class="bg-surface-100-800-token arrow"></div>
							</div>
						{/if}
					</div>
				{/each}
			{/snippet}
		</MediaQuery>
	</div>
	{#if sortedChapters.filter((e) => !e.isRead).length}
		<MediaQuery query="(min-width: {screens.md})">
			{#snippet children({ matches })}
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
			{/snippet}
		</MediaQuery>
	{/if}
{/if}
