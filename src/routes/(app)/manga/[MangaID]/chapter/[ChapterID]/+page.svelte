<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { AppBarData } from '$lib/MountTitleAction';
	import Image from '$lib/components/Image.svelte';
	import IntersectionObserver from '$lib/components/IntersectionObserver.svelte';
	import { getToastStore } from '$lib/components/Toast/stores';
	import { Layout, MangaMeta, Mode } from '$lib/simpleStores';
	import { ErrorHelp } from '$lib/util';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { ViewNav, chapterTitle, mangaTitle } from './chapterStores';
	import { filterChapters } from '../../util';
	import { paths, type PathLayout, type Paths, type TPath } from './paths';
	import {
		getContextClient,
		queryStore,
		type OperationResult
	} from '@urql/svelte';
	import { getManga } from '$lib/gql/Queries';
	import { type ResultOf } from '$lib/gql/graphql';
	import {
		fetchChapterPages,
		trackProgress,
		updateChapter
	} from '$lib/gql/Mutations';
	import { ChapterTypeFragment } from '$lib/gql/Fragments';
	import { queryParam, ssp } from 'sveltekit-search-params';

	export let data: PageData;
	let mangaMeta = MangaMeta(data.MangaID);

	let pagenav = queryParam('pagenav', ssp.boolean(), { pushHistory: false });

	$: if ($pagenav) {
		$pagenav = null;
		all = [];
	}

	onMount(() => {
		if (
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent
			) &&
			$mangaMeta.mobileFullScreenOnChapterPage
		) {
			document.documentElement.requestFullscreen();
		}
		return () => {
			if (
				/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
					navigator.userAgent
				) &&
				$mangaMeta.mobileFullScreenOnChapterPage
			) {
				document.exitFullscreen();
			}
		};
	});

	let topChapter: number;
	onMount(() => {
		topChapter = data.ChapterID;
	});

	$: currentChapterID = data.ChapterID;

	const toastStore = getToastStore();
	const client = getContextClient();
	const manga = queryStore({
		client,
		query: getManga,
		variables: { id: data.MangaID }
	});
	let pageElement = undefined as HTMLDivElement | undefined;
	const drawerStore = getDrawerStore();

	let chapterLoading = true;
	let path: Paths;
	let visiblePages: {
		selector: string;
		chapterIndex: number;
		pageIndex: number;
	}[] = [];
	let all: {
		chapterID: number;
		pages: ResultOf<typeof fetchChapterPages>['fetchChapterPages']['pages']; //FetchChapterPagesMutation['fetchChapterPages']['pages'];
	}[] = [];

	let pages: Promise<OperationResult<ResultOf<typeof fetchChapterPages>>>;
	$: currentChapterID, loadNew();
	function loadNew() {
		if (preload && !pagenav) pages = preload;
		else
			pages = client
				.mutation(fetchChapterPages, { chapterId: currentChapterID })
				.toPromise();
	}

	let preload:
		| Promise<OperationResult<ResultOf<typeof fetchChapterPages>>>
		| undefined = undefined;
	let preLoadingId: number | undefined = undefined;
	$: nextid = getChapterAfterID(currentChapterID, $manga)?.id;
	$: if (
		nextid !== undefined &&
		$mangaMeta.preLoadNextChapter &&
		nextid !== preLoadingId
	) {
		preLoadingId = nextid;
		preload = client
			.mutation(fetchChapterPages, { chapterId: nextid })
			.toPromise();
	}
	$: updatePages(pages);
	async function updatePages(
		pages: Promise<OperationResult<ResultOf<typeof fetchChapterPages>>>
	) {
		chapterLoading = true;
		const obj: (typeof all)[0] = {
			chapterID: currentChapterID,
			pages: []
		};
		await ErrorHelp(`failed to load chapter ${obj.chapterID}`, pages, (e) => {
			if (!e.data) return;
			obj.pages = e.data.fetchChapterPages.pages;
			all.push(obj);
			all = all;
		});
		chapterLoading = false;
	}

	function LoadNextChapter(currentID: number) {
		const next = getChapterAfterID(currentID);
		if (next) currentChapterID = next.id;
	}

	$: filteredChapters = $manga.data?.manga?.chapters.nodes?.filter(
		filterChapters(mangaMeta, true)
	);

	function getChapterOfID(
		currentID: number
	): ResultOf<typeof ChapterTypeFragment> | undefined {
		return filteredChapters?.find((e) => e.id === currentID);
	}

	function getChapterAfterID(
		currentID: number,
		_: unknown = undefined
	): ResultOf<typeof ChapterTypeFragment> | undefined {
		const currentChapter = getChapterOfID(currentID);
		if (!currentChapter) return undefined;
		return filteredChapters?.reduce(
			(acc, e) => {
				if (e.sourceOrder > currentChapter.sourceOrder) {
					if (!acc) acc = e;
					if (e.sourceOrder < acc.sourceOrder) acc = e;
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

	$: if ($mangaMeta.ReaderMode === Mode.RTL) {
		path = layoutToPath(paths.rtl, $mangaMeta.NavLayout);
	} else {
		path = layoutToPath(paths.ltr, $mangaMeta.NavLayout);
	}

	function layoutToPath(path: PathLayout, layout: Layout) {
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

	async function handelKeypress(keyEvent: KeyboardEvent) {
		if (!pageElement) {
			pageElement = document.querySelector('#page') as HTMLDivElement;
		}
		if (keyEvent.code === 'Escape') {
			keyEvent.preventDefault();
			keyEvent.stopPropagation();
			if ($drawerStore.open) {
				drawerStore.close();
				return;
			}
			drawerStore.open({
				id: 'ChapterMenu',
				width: 'w-[280px] md:w-[480px]',
				meta: {
					id: data.MangaID
				}
			});
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
		if (keyEvent.code === 'ArrowRight') {
			keyEvent.preventDefault();
			keyEvent.stopPropagation();
			doScroll();
			return;
		}
		if (keyEvent.code === 'ArrowLeft') {
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

	let goBackChapterLoading = false;

	async function goBackChapter() {
		if (goBackChapterLoading) return;
		goBackChapterLoading = true;
		if (!pageElement) {
			pageElement = document.querySelector('#page') as HTMLDivElement;
		}
		if (pageElement.scrollTop === 0) {
			const tmp = getChapterBeforeID(topChapter);
			if (tmp) {
				const TTTmp = client
					.mutation('fetchChapterPages', {
						chapterId: tmp.id
					})
					.toPromise();
				const obj: (typeof all)[0] = {
					chapterID: tmp.id,
					pages: []
				};
				await ErrorHelp(
					`failed to load chapter ${obj.chapterID}`,
					TTTmp,
					(e) => {
						if (!e.data) return;
						obj.pages = e.data.fetchChapterPages.pages;
						all = [obj, ...all];
					}
				);
				const topImg = document.querySelector(`#c1p0`);
				if (topImg)
					pageElement?.scrollTo({
						top: pageElement.scrollTop + topImg.getBoundingClientRect().y + 1,
						behavior: 'instant'
					});
				topChapter = tmp.id;
			} else {
				toastStore.trigger({
					message: "You can't go back, you are already at the first chapter"
				});
			}
		}
		goBackChapterLoading = false;
	}

	function handleClick(e: MouseEvent) {
		if (!pageElement) {
			pageElement = document.querySelector('#page') as HTMLDivElement;
		}
		if (pointInPoly([e.x, e.y], polyToPOLLY(path.forward))) {
			doScroll();
		} else if (pointInPoly([e.x, e.y], polyToPOLLY(path.back))) {
			scrollBy(-0.8);
		} else if (path.menu && pointInPoly([e.x, e.y], polyToPOLLY(path.menu))) {
			drawerStore.open({
				id: 'ChapterMenu',
				width: 'w-[280px] md:w-[480px]',
				meta: {
					id: data.MangaID
				}
			});
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
			const ii = vs[i] as [number, number];
			const jj = vs[j] as [number, number];
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
			behavior: $mangaMeta.SmoothScroll ? 'smooth' : 'instant'
		});
	}

	let updatedChaps: string[] = [];

	function PageIntersect(
		e: CustomEvent<boolean>,
		selector: string,
		chapterIndex: number,
		pageIndex: number,
		maxPages: number,
		id: number
	) {
		if (e.detail) {
			pageIndicator = `${pageIndex + 1}/${maxPages}`;
			visiblePages = [
				...visiblePages,
				{
					selector,
					chapterIndex,
					pageIndex
				}
			];
			if (!updatedChaps.includes(selector)) {
				(async () => {
					await client
						.mutation(updateChapter, {
							id,
							lastPageRead: pageIndex,
							isRead: pageIndex >= maxPages * 0.8 ? true : null
						})
						.toPromise();
					if (!$manga.data?.manga?.id || pageIndex !== maxPages - 1) return;
					await client
						.mutation(trackProgress, {
							mangaId: $manga.data?.manga?.id
						})
						.toPromise();
				})();
				updatedChaps.push(selector);
				setTimeout(() => {
					updatedChaps = updatedChaps.filter((e) => e !== selector);
				}, 5000);
			}
		} else {
			visiblePages = visiblePages.filter((e) => e.selector !== selector);
		}
	}

	$: $mangaTitle = $manga.data?.manga?.title ?? '';
	$: $chapterTitle =
		filteredChapters?.find((e) => e.id === currentChapterID)?.name ?? '';
	$: currentChapterID, got();

	function got() {
		goto($page.url.pathname.replace(/[^/]*$/, currentChapterID.toString()), {
			replaceState: true,
			noScroll: true
		});
	}

	$: lowestIntersect = document.querySelector(
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
	) as HTMLElement | undefined;

	$: $manga.data?.manga,
		AppBarData(`${$manga.data?.manga?.title} ${$chapterTitle}` || 'Manga');
	type tmp = (typeof path)[keyof typeof path];
	type TTmp = keyof typeof path;

	$: currPath = Object.fromEntries(
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
	);

	onMount(() => {
		document.addEventListener('keydown', handelKeypress, true);
		return () => {
			document.removeEventListener('keydown', handelKeypress, true);
		};
	});

	let buttonElement: HTMLButtonElement;

	$: if (!$drawerStore.open) {
		buttonElement?.focus();
	}

	let pageIndicator: string = '1/0';
</script>

<button
	tabindex="0"
	bind:this={buttonElement}
	on:click={handleClick}
	class="w-full"
>
	{#if $ViewNav}
		<div class="pointer-events-none">
			<div class="fixed z-10 bg-blue-500/50" style={currPath.forward} />
			<div class="fixed z-10 bg-red-500/50" style={currPath.back} />
			{#if currPath.menu}
				<div class="fixed z-10 bg-green-500/50" style={currPath.menu} />
			{/if}
		</div>
	{/if}
	{#each all as chapter, index (chapter.chapterID)}
		<div class="flex w-full justify-end">
			{chapter.chapterID}
			{chapter.pages[0]}
		</div>
		<div>
			<div
				class="
				{$mangaMeta.ReaderMode === Mode.Vertical && 'flex flex-col items-center'}
				{$mangaMeta.ReaderMode === Mode.single && 'flex flex-col items-center'}
				{$mangaMeta.ReaderMode === Mode.RTL &&
					`grid grid-cols-2 place-content-center
						[&>div:nth-child(even)]:justify-self-start [&>div:nth-child(odd)]:justify-self-end`}
				{$mangaMeta.ReaderMode === Mode.LTR &&
					`grid grid-cols-2 place-content-center
						[&>div:nth-child(even)]:justify-self-start [&>div:nth-child(odd)]:justify-self-end`}"
				dir={$mangaMeta.ReaderMode === Mode.RTL ? 'rtl' : 'ltr'}
			>
				{#if ($mangaMeta.ReaderMode === Mode.RTL || $mangaMeta.ReaderMode === Mode.LTR) && $mangaMeta.Offset}
					<div />
				{/if}
				{#each chapter.pages as page, pageIndex (page)}
					<div
						class="h-auto w-auto
							{$mangaMeta.Margins && $mangaMeta.ReaderMode === Mode.Vertical && 'mb-4'}
							{$mangaMeta.Margins && $mangaMeta.ReaderMode === Mode.single && 'mb-4'}
							{$mangaMeta.Margins &&
							$mangaMeta.ReaderMode === Mode.RTL &&
							'mb-4 odd:ml-2 even:mr-2'}
							{$mangaMeta.Margins &&
							$mangaMeta.ReaderMode === Mode.LTR &&
							'mb-4 odd:mr-2 even:ml-2'}
							{$mangaMeta.Scale && $mangaMeta.ReaderMode !== Mode.Vertical
							? 'h-full max-h-screen'
							: 'h-auto'} {$mangaMeta.Scale &&
						$mangaMeta.ReaderMode === Mode.Vertical
							? 'w-full'
							: 'w-auto'}
								{$mangaMeta.Scale && $mangaMeta.ReaderMode === Mode.single ? 'max-w-full' : ''}"
					>
						<IntersectionObserver
							on:intersect={(e) => {
								PageIntersect(
									e,
									`#c${index}p${pageIndex}`,
									index,
									pageIndex,
									chapter.pages.length,
									chapter.chapterID
								);
							}}
							root={document.querySelector('#page') ?? undefined}
							bottom={0}
							top={$mangaMeta.Margins ? 16 : 0}
						/>
						<div
							id="c{index}p{pageIndex}"
							class="{$mangaMeta.Scale &&
							$mangaMeta.ReaderMode !== Mode.Vertical
								? 'h-full max-h-screen'
								: 'h-auto'} {$mangaMeta.Scale &&
							$mangaMeta.ReaderMode === Mode.Vertical
								? 'w-full'
								: 'w-auto'}
								{$mangaMeta.Scale && $mangaMeta.ReaderMode === Mode.single ? 'max-w-full' : ''}"
						>
							<Image
								reload_button={true}
								src={page}
								height={$mangaMeta.Scale &&
								$mangaMeta.ReaderMode !== Mode.Vertical
									? 'max-h-screen h-full'
									: 'h-auto'}
								width="{$mangaMeta.Scale &&
								$mangaMeta.ReaderMode === Mode.Vertical
									? 'w-full'
									: 'w-auto'}
									{$mangaMeta.Scale && $mangaMeta.ReaderMode === Mode.single ? 'max-w-full' : ''}"
								rounded=" rounded-none"
								LoadingHeight="h-screen"
								LoadingWidth="w-screen"
							/>
						</div>
					</div>
				{/each}
			</div>
		</div>
		{#if index === all.length - 1 && !chapterLoading}
			<IntersectionObserver
				on:intersect={(e) => {
					if (e.detail) {
						client
							.mutation(updateChapter, {
								id: chapter.chapterID,
								lastPageRead: chapter.pages.length,
								isRead: true
							})
							.toPromise();
						LoadNextChapter(currentChapterID);
					}
				}}
				root={document.querySelector('#page') ?? undefined}
			/>
		{/if}
		<div class="p-2">
			<div
				class="card variant-glass-surface flex h-[50vh] max-h-96 w-full flex-col items-center justify-center"
			>
				<div>
					{getChapterOfID(chapter.chapterID)?.name ??
						'if you are seeing this then something is wrong'}
				</div>
				{#if getChapterAfterID(chapter.chapterID)}
					<div>Next Chapter</div>
					<div>
						{getChapterAfterID(chapter.chapterID)?.name}
					</div>
				{:else}
					<div>Last Chapter</div>
				{/if}
			</div>
		</div>
	{/each}
	{#if $mangaMeta.doPageIndicator}
		<div
			class="fixed bottom-2 left-1/2 -translate-x-1/2 rounded bg-surface-500/60 p-2 text-black dark:text-white"
		>
			{pageIndicator}
		</div>
	{/if}

	{#if preload}
		{#await preload then preloaded}
			{#if preloaded.data}
				{#each preloaded.data.fetchChapterPages.pages as value}
					<img src={value} alt="img" class="h-0 w-0" />
				{/each}
			{/if}
		{/await}
	{/if}
</button>
