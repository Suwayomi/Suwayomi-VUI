<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { actionState } from '$lib/MountTitleAction.svelte';
	import Image from '$lib/components/Image.svelte';
	import { getToastStore } from '$lib/components/Toast/stores';
	import {
		Layout,
		mmState,
		Mode,
		type TLayout
	} from '$lib/simpleStores.svelte';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import {
		readerState,
		get_manga,
		makeToggleDrawer,
		restartOnChapter,
		gotoChapter
	} from './chapterStores.svelte';
	import { filterChapters } from '../../util';
	import { paths, type PathLayout, type Paths, type TPath } from './paths';
	import { getContextClient } from '@urql/svelte';
	import { type ResultOf } from '$lib/gql/graphql';
	import {
		fetchChapterPages,
		trackProgress,
		updateChapter
	} from '$lib/gql/Mutations';
	import { ChapterTypeFragment } from '$lib/gql/Fragments';
	import { IntersectionObserverAction } from '$lib/actions/IntersectionObserver.svelte';
	import { SvelteSet } from 'svelte/reactivity';

	interface Props {
		data: PageData;
	}

	type tmp = NonNullable<typeof path>[keyof NonNullable<typeof path>];
	type TTmp = keyof NonNullable<typeof path>;

	let { data }: Props = $props();
	let goBackChapterLoading = false;
	let pageElement = undefined as HTMLDivElement | undefined;
	let updatedChaps = new Set<string>();

	const drawerStore = getDrawerStore();
	const Toggledraw = makeToggleDrawer(drawerStore);
	const toastStore = getToastStore();
	const client = getContextClient();

	let chapterLoading = $state(true);
	let path: Paths | undefined = $state();
	let visiblePages: {
		selector: string;
		chapterIndex: number;
		pageIndex: number;
	}[] = $state([]);

	let buttonElement: HTMLButtonElement | undefined = $state();

	let pageIndicator: string = $state('1/0');

	let IntersectingChapterEnd = $state({
		intersecting: false,
		chapterID: -1,
		index: -1
	});

	let filteredChapters = $derived(
		get_manga.manga?.data?.manga?.chapters.nodes?.filter(
			filterChapters(mmState, true)
		)
	);

	let lowestIntersect = $derived(
		document.querySelector(
			visiblePages.reduce(
				(a, c) => {
					if (
						c.chapterIndex > a.chapterIndex ||
						(c.chapterIndex === a.chapterIndex && c.pageIndex > a.pageIndex)
					) {
						return c;
					}
					return a;
				},
				{
					selector: 'c0p0',
					chapterIndex: 0,
					pageIndex: 0
				}
			).selector
		) as HTMLElement | undefined
	);
	let currPath = $derived(
		path
			? Object.fromEntries(
					(Object.entries(path) as [TTmp, tmp][]).map((dat): [TTmp, string] => {
						if (path === undefined) {
							return [dat[0], ''] as [TTmp, string];
						}
						return [
							dat[0],
							`clip-path: polygon(${dat[1]
								.map((point) => {
									return point
										.map((percent) => {
											return percent === 0 ? percent.toString() : `${percent}%`;
										})
										.join(' ');
								})
								.join(',')});top: 0;
				bottom: 0;
				left: 0;
				right: 0;
		`
						] as [TTmp, string];
					})
				)
			: {}
	);
	let preloadedChapters = $derived(
		new SvelteSet(readerState.ChapterPagesMap.keys()).difference(
			readerState.displayedChapters
		)
	);

	async function handelKeypress(keyEvent: KeyboardEvent) {
		if (!pageElement) {
			pageElement = document.querySelector('#page') as HTMLDivElement;
		}
		if (keyEvent.code === 'Escape') {
			keyEvent.preventDefault();
			keyEvent.stopPropagation();
			Toggledraw();
			return;
		}
		if (keyEvent.code === 'Space') {
			keyEvent.preventDefault();
			keyEvent.stopPropagation();
			if (keyEvent.shiftKey) {
				goBackChapter();
				scrollBy(-0.8);
			} else {
				doScroll();
			}
			return;
		}
		if (keyEvent.code === 'ArrowRight' && !keyEvent.altKey) {
			keyEvent.preventDefault();
			keyEvent.stopPropagation();
			doScroll();
			return;
		}
		if (keyEvent.code === 'ArrowLeft' && !keyEvent.altKey) {
			goBackChapter();
			keyEvent.preventDefault();
			keyEvent.stopPropagation();
			scrollBy(-0.8);
			return;
		}

		if (keyEvent.code === 'ArrowDown') {
			keyEvent.preventDefault();
			keyEvent.stopPropagation();
			scrollBy(0.4);
			return;
		}
		if (keyEvent.code === 'ArrowUp') {
			goBackChapter();
			keyEvent.preventDefault();
			keyEvent.stopPropagation();
			scrollBy(-0.4);
			return;
		}

		if (keyEvent.code === 'PageDown') {
			keyEvent.preventDefault();
			scrollBy(1);
		}
		if (keyEvent.code === 'PageUp') {
			keyEvent.preventDefault();
			scrollBy(-1);
		}
	}

	async function loadNew(chapterId: number, preload = false) {
		if (
			readerState.displayedChapters.has(chapterId) &&
			readerState.ChapterPagesMap.has(chapterId)
		)
			return;
		if (readerState.ChapterPagesMap.has(chapterId)) {
			readerState.displayedChapters.add(chapterId);
			return;
		}
		if (readerState.loadingChaptersIds.has(chapterId)) return;
		readerState.loadingChaptersIds.add(chapterId);
		chapterLoading = true;
		const e = await (preload || !data.pre
			? client
					.mutation(fetchChapterPages, {
						chapterId
					})
					.toPromise()
			: data.pre);
		if (e.data?.fetchChapterPages?.pages) {
			readerState.ChapterPagesMap.set(
				chapterId,
				e.data.fetchChapterPages.pages
			);
			if (!preload) readerState.displayedChapters.add(chapterId);
		}
		chapterLoading = false;
	}

	async function goBackChapter() {
		if (goBackChapterLoading) return;
		goBackChapterLoading = true;
		if (!pageElement) {
			pageElement = document.querySelector('#page') as HTMLDivElement;
		}
		if (pageElement.scrollTop === 0) {
			const tmp = getChapterBeforeID(
				readerState.displayedChapters.keys().next().value!
			);
			if (tmp) {
				restartOnChapter(tmp.id);
			} else {
				toastStore.trigger({
					message: "You can't go back, you are already at the first chapter"
				});
			}
		}
		goBackChapterLoading = false;
	}

	function preloadChapter(id: number) {
		loadNew(id, true);
	}

	function getChapterOfID(
		currentID: number
	): ResultOf<typeof ChapterTypeFragment> | undefined {
		return filteredChapters?.find((e) => e.id === currentID);
	}

	function getChapterAfterID(
		currentID: number
	): ResultOf<typeof ChapterTypeFragment> | undefined {
		const currentChapter = getChapterOfID(currentID);
		if (!currentChapter) return undefined;
		return filteredChapters?.reduce(
			(acc, c) => {
				if (c.sourceOrder > currentChapter.sourceOrder) {
					if (!acc) acc = c;
					if (c.sourceOrder < acc.sourceOrder) acc = c;
				}
				return acc;
			},
			undefined as ResultOf<typeof ChapterTypeFragment> | undefined
		);
	}

	function getChapterBeforeID(
		currentID: number
	): ResultOf<typeof ChapterTypeFragment> | undefined {
		const currentChapter = getChapterOfID(currentID);
		if (!currentChapter) return undefined;
		return filteredChapters?.reduce(
			(acc, e) => {
				if (e.sourceOrder < currentChapter.sourceOrder) {
					if (!acc) acc = e;
					if (e.sourceOrder > acc.sourceOrder) acc = e;
				}
				return acc;
			},
			undefined as ResultOf<typeof ChapterTypeFragment> | undefined
		);
	}

	function layoutToPath(path: PathLayout, layout: TLayout) {
		switch (layout) {
			case Layout.L:
				return path.L;
			case Layout.Edge:
				return path.Edge;
			case Layout.Kindle:
				return path.Kindle;
			default:
				return path.RAL;
		}
	}

	function handleClick(e: MouseEvent) {
		if (!path) return;

		if (!pageElement) {
			pageElement = document.querySelector('#page') as HTMLDivElement;
		}
		if (pointInPoly([e.x, e.y], polyToPOLLY(path.forward))) {
			doScroll();
		} else if (pointInPoly([e.x, e.y], polyToPOLLY(path.back))) {
			scrollBy(-0.8);
		} else if (path.menu && pointInPoly([e.x, e.y], polyToPOLLY(path.menu))) {
			Toggledraw();
		}
	}

	function pointInPoly(
		point: [number, number],
		vs: [number, number][] | undefined
	): boolean {
		// ray-casting algorithm based on
		// https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
		if (vs === undefined) {
			return false;
		}
		const x = point[0];
		const y = point[1];

		let inside = false;
		for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
			const ii = vs[i];
			const jj = vs[j];
			const xi = ii[0];
			const yi = ii[1];
			const xj = jj[0];
			const yj = jj[1];

			const intersect =
				yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
			if (intersect) {
				inside = !inside;
			}
		}

		return inside;
	}

	function polyToPOLLY(
		polly: TPath | undefined
	): [number, number][] | undefined {
		if (polly === undefined) {
			return undefined;
		}
		return polly.map((point) => {
			return [
				(point[0] * window.innerWidth) / 100,
				(point[1] * window.innerHeight) / 100
			];
		});
	}

	function doScroll() {
		if (
			!lowestIntersect ||
			!pageElement ||
			lowestIntersect.getBoundingClientRect().y + 1 === 0
		) {
			scrollBy(0.8);
			return;
		}

		scrollBy(0, lowestIntersect.getBoundingClientRect().y + 1);
	}

	function scrollBy(decimal: number, addition = 0) {
		pageElement?.scrollTo({
			top:
				addition + (pageElement.scrollTop + pageElement.clientHeight * decimal),
			behavior: mmState.value.SmoothScroll ? 'smooth' : 'instant'
		});
	}

	function PageIntersect(
		e: boolean,
		selector: string,
		chapterIndex: number,
		pageIndex: number,
		maxPages: number,
		id: number
	) {
		if (e) {
			pageIndicator = `${pageIndex + 1}/${maxPages}`;
			visiblePages = [
				...visiblePages,
				{
					selector,
					chapterIndex,
					pageIndex
				}
			];
			if (!updatedChaps.has(selector)) {
				(async () => {
					await client
						.mutation(updateChapter, {
							id,
							lastPageRead: pageIndex,
							isRead: pageIndex >= maxPages * 0.8 ? true : null
						})
						.toPromise();
					if (!get_manga.manga?.data?.manga?.id || pageIndex !== maxPages - 1)
						return;
					await client
						.mutation(trackProgress, {
							mangaId: get_manga.manga?.data?.manga?.id
						})
						.toPromise();
				})();
				updatedChaps.add(selector);
				setTimeout(() => {
					updatedChaps.delete(selector);
				}, 5000);
			}
		} else {
			visiblePages = visiblePages.filter((e) => e.selector !== selector);
		}
	}

	// enter fullscreen on mobile
	onMount(() => {
		if (
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent
			) &&
			mmState.value.mobileFullScreenOnChapterPage
		) {
			document.documentElement.requestFullscreen();
		}
		return () => {
			if (
				/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
					navigator.userAgent
				) &&
				mmState.value.mobileFullScreenOnChapterPage
			) {
				document.exitFullscreen();
			}
		};
	});

	// register keydown event
	onMount(() => {
		document.addEventListener('keydown', handelKeypress, true);
		return () => {
			document.removeEventListener('keydown', handelKeypress, true);
		};
	});

	// clear displayed chapters on destroy
	onMount(() => () => readerState.displayedChapters.clear());

	// load manga and state of mangaID, and clear displayed chapters on MangaID url change
	$effect(() => {
		mmState.id = data.MangaID;
		get_manga.id = data.MangaID;
	});

	// load chapter on chapterID in url change
	$effect(() => {
		loadNew(data.ChapterID);
	});
	// trigger preload next chapter
	$effect(() => {
		let nextid = getChapterAfterID(data.ChapterID)?.id;
		if (
			nextid !== undefined &&
			mmState.value.preLoadNextChapter &&
			!readerState.ChapterPagesMap.has(nextid)
		) {
			preloadChapter(nextid);
		}
	});
	// go to next chapter at end of current chapter
	$effect(() => {
		if (
			!chapterLoading &&
			IntersectingChapterEnd.intersecting &&
			readerState.displayedChapters.has(IntersectingChapterEnd.chapterID) &&
			readerState.displayedChapters.size === IntersectingChapterEnd.index + 1
		) {
			client
				.mutation(updateChapter, {
					id: IntersectingChapterEnd.chapterID,
					lastPageRead: readerState.ChapterPagesMap.get(
						IntersectingChapterEnd.chapterID
					)!.length,
					isRead: true
				})
				.toPromise();
			const next = getChapterAfterID(IntersectingChapterEnd.chapterID);
			if (next) gotoChapter(next.id);
		}
	});
	// set path on reader mode change
	$effect(() => {
		if (mmState.value.ReaderMode === Mode.RTL) {
			path = layoutToPath(paths.rtl, mmState.value.NavLayout);
		} else {
			path = layoutToPath(paths.ltr, mmState.value.NavLayout);
		}
	});
	// set focus on drawer open
	$effect(() => {
		if (!$drawerStore.open) {
			buttonElement?.focus();
		}
	});
	// set manga title state
	$effect(() => {
		readerState.mangaTitle = get_manga.manga?.data?.manga?.title ?? '';
	});
	// set chapter title
	$effect(() => {
		readerState.chapterTitle =
			filteredChapters?.find((e) => e.id === data.ChapterID)?.name ?? '';
	});
	// set manga id state
	$effect(() => {
		readerState.MangaID = data.MangaID;
	});
	// set chapter id state
	$effect(() => {
		readerState.ChapterID = data.ChapterID;
	});
	// set tab title
	$effect(() => {
		actionState.AppBarData(
			`${readerState.mangaTitle} ${readerState.chapterTitle}`
		);
	});
</script>

<button
	tabindex="0"
	bind:this={buttonElement}
	onclick={handleClick}
	class="w-full"
>
	{#if readerState.ViewNav}
		<div class="pointer-events-none">
			<div class="fixed z-10 bg-blue-500/50" style={currPath.forward}></div>
			<div class="fixed z-10 bg-red-500/50" style={currPath.back}></div>
			{#if currPath.menu}
				<div class="fixed z-10 bg-green-500/50" style={currPath.menu}></div>
			{/if}
		</div>
	{/if}
	{#each readerState.displayedChapters as chapterID, index (chapterID)}
		{@const pages = readerState.ChapterPagesMap.get(chapterID) ?? []}
		<div>
			<div
				class="
				{mmState.value.ReaderMode === Mode.Vertical && 'flex flex-col items-center'}
				{mmState.value.ReaderMode === Mode.single && 'flex flex-col items-center'}
				{mmState.value.ReaderMode === Mode.RTL &&
					'place-content-center[&>div:nth-child(even)]:justify-self-start grid grid-cols-2 [&>div:nth-child(odd)]:justify-self-end'}
				{mmState.value.ReaderMode === Mode.LTR &&
					'place-content-center[&>div:nth-child(even)]:justify-self-start grid grid-cols-2 [&>div:nth-child(odd)]:justify-self-end'}
				"
				dir={mmState.value.ReaderMode === Mode.RTL ? 'rtl' : 'ltr'}
			>
				{#if (mmState.value.ReaderMode === Mode.RTL || mmState.value.ReaderMode === Mode.LTR) && mmState.value.Offset}
					<div></div>
				{/if}
				{#each pages as page, pageIndex (page)}
					<div
						class="h-auto w-auto
							{mmState.value.Margins && mmState.value.ReaderMode === Mode.Vertical && 'mb-4'}
							{mmState.value.Margins && mmState.value.ReaderMode === Mode.single && 'mb-4'}
							{mmState.value.Margins &&
							mmState.value.ReaderMode === Mode.RTL &&
							'mb-4 odd:ml-2 even:mr-2'}
							{mmState.value.Margins &&
							mmState.value.ReaderMode === Mode.LTR &&
							'mb-4 odd:mr-2 even:ml-2'}
							{mmState.value.Scale && mmState.value.ReaderMode !== Mode.Vertical
							? 'h-full max-h-screen'
							: 'h-auto'} {mmState.value.Scale &&
						mmState.value.ReaderMode === Mode.Vertical
							? 'w-full'
							: 'w-auto'}
								{mmState.value.Scale && mmState.value.ReaderMode === Mode.single
							? 'max-w-full'
							: ''}"
					>
						<div
							use:IntersectionObserverAction={{
								rootMargin: `0px 0px ${mmState.value.Margins ? 16 : 0}px 0px`,
								root: document.querySelector('#page') ?? undefined,
								callback: (e) => {
									PageIntersect(
										e.isIntersecting,
										`#c${index}p${pageIndex}`,
										index,
										pageIndex,
										pages.length,
										chapterID
									);
								}
							}}
						></div>

						<div
							id="c{index}p{pageIndex}"
							class="{mmState.value.Scale &&
							mmState.value.ReaderMode !== Mode.Vertical
								? 'h-full max-h-screen'
								: 'h-auto'} {mmState.value.Scale &&
							mmState.value.ReaderMode === Mode.Vertical
								? 'w-full'
								: 'w-auto'}
								{mmState.value.Scale && mmState.value.ReaderMode === Mode.single
								? 'max-w-full'
								: ''}"
						>
							<Image
								reload_button={true}
								src={page}
								fit="object-contain"
								height={mmState.value.Scale &&
								mmState.value.ReaderMode !== Mode.Vertical
									? 'max-h-screen h-full'
									: 'h-auto'}
								width="{mmState.value.Scale &&
								mmState.value.ReaderMode === Mode.Vertical
									? 'w-full'
									: 'w-auto'}
									{mmState.value.Scale && mmState.value.ReaderMode === Mode.single
									? 'max-w-full'
									: ''}"
								rounded=" rounded-none"
								LoadingHeight="h-screen"
								LoadingWidth="w-screen"
							/>
						</div>
					</div>
				{/each}
			</div>
		</div>
		<div
			use:IntersectionObserverAction={{
				rootMargin: `0px 0px -1px 0px`,
				root: document.querySelector('#page') ?? undefined,
				callback: (e) =>
					(IntersectingChapterEnd = {
						intersecting: e.isIntersecting,
						chapterID,
						index
					})
			}}
		></div>

		<div class="p-2">
			<div
				class="card variant-glass-surface flex h-[50vh] max-h-96 w-full flex-col items-center justify-center"
			>
				<div>
					{getChapterOfID(chapterID)?.name ??
						'if you are seeing this then something is wrong'}
				</div>
				{#if getChapterAfterID(chapterID)}
					<div>Next Chapter</div>
					<div>
						{getChapterAfterID(chapterID)?.name}
					</div>
				{:else}
					<div>Last Chapter</div>
				{/if}
			</div>
		</div>
	{/each}
	{#if mmState.value.doPageIndicator}
		<div
			class="fixed bottom-2 left-1/2 -translate-x-1/2 rounded bg-surface-500/60 p-2 text-black dark:text-white"
		>
			{pageIndicator}
		</div>
	{/if}

	{#each preloadedChapters as id}
		{#each readerState.ChapterPagesMap.get(id) ?? [] as page}
			<img src={page} alt="preloading page" class="h-0 w-0" />
		{/each}
	{/each}
</button>
