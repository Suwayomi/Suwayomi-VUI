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
	import { Layout, mmState, Mode } from '$lib/simpleStores.svelte';
	import { ErrorHelp } from '$lib/util.svelte';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { onMount, untrack } from 'svelte';
	import type { PageData } from './$types';
	import {
		ViewNav,
		chapterTitle,
		get_manga,
		makeToggleDrawer,
		mangaTitle
	} from './chapterStores.svelte';
	import { filterChapters } from '../../util';
	import { paths, type PathLayout, type Paths, type TPath } from './paths';
	import { getContextClient, type OperationResult } from '@urql/svelte';
	import { type ResultOf } from '$lib/gql/graphql';
	import {
		fetchChapterPages,
		trackProgress,
		updateChapter
	} from '$lib/gql/Mutations';
	import { ChapterTypeFragment } from '$lib/gql/Fragments';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import { writable } from 'svelte/store';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	mmState.id = data.MangaID;

	let pagenav = queryParam('pagenav', ssp.boolean(), { pushHistory: false });

	onMount(() => {
		if (
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent
			) &&
			mmState.mobileFullScreenOnChapterPage
		) {
			document.documentElement.requestFullscreen();
		}
		return () => {
			if (
				/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
					navigator.userAgent
				) &&
				mmState.mobileFullScreenOnChapterPage
			) {
				document.exitFullscreen();
			}
		};
	});

	let topChapter: number;
	onMount(() => {
		topChapter = data.ChapterID;
	});

	const toastStore = getToastStore();
	const client = getContextClient();
	get_manga.id = data.MangaID;
	const manga = $derived(get_manga.manga);

	let pageElement = undefined as HTMLDivElement | undefined;
	const drawerStore = getDrawerStore();

	let chapterLoading = $state(true);
	let path: Paths | undefined = $state();
	let visiblePages: {
		selector: string;
		chapterIndex: number;
		pageIndex: number;
	}[] = $state([]);
	let all: {
		chapterID: number;
		pages: NonNullable<
			ResultOf<typeof fetchChapterPages>['fetchChapterPages']
		>['pages'];
	}[] = $state([]);

	let filteredChapters = $derived(
		manga?.data?.manga?.chapters.nodes?.filter(filterChapters(mmState, true))
	);
	let pages:
		| Promise<OperationResult<ResultOf<typeof fetchChapterPages>>>
		| undefined = $state();
	function loadNew() {
		if (preload && !pagenav) pages = preload;
		else
			pages = client
				.mutation(fetchChapterPages, { chapterId: currentChapterID })
				.toPromise();
	}

	let preload:
		| Promise<OperationResult<ResultOf<typeof fetchChapterPages>>>
		| undefined = $state(undefined);
	let preLoadingId: number | undefined = $state(undefined);
	async function updatePages(
		pages:
			| Promise<OperationResult<ResultOf<typeof fetchChapterPages>>>
			| undefined
	) {
		if (!pages) return;
		chapterLoading = true;
		const obj: (typeof all)[0] = {
			chapterID: currentChapterID,
			pages: []
		};
		await ErrorHelp(`failed to load chapter ${obj.chapterID}`, pages, (e) => {
			if (!e.data?.fetchChapterPages) return;
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

	const dataStore = writable(data);
	const Toggledraw = makeToggleDrawer(drawerStore, dataStore);

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
					.mutation(fetchChapterPages, {
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
						if (!e.data?.fetchChapterPages) return;
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
			behavior: mmState.SmoothScroll ? 'smooth' : 'instant'
		});
	}

	let updatedChaps: string[] = [];

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
			if (!updatedChaps.includes(selector)) {
				(async () => {
					await client
						.mutation(updateChapter, {
							id,
							lastPageRead: pageIndex,
							isRead: pageIndex >= maxPages * 0.8 ? true : null
						})
						.toPromise();
					if (!manga?.data?.manga?.id || pageIndex !== maxPages - 1) return;
					await client
						.mutation(trackProgress, {
							mangaId: manga?.data?.manga?.id
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

	function got() {
		goto($page.url.pathname.replace(/[^/]*$/, currentChapterID.toString()), {
			replaceState: true,
			noScroll: true
		});
	}

	type tmp = NonNullable<typeof path>[keyof NonNullable<typeof path>];
	type TTmp = keyof NonNullable<typeof path>;

	onMount(() => {
		document.addEventListener('keydown', handelKeypress, true);
		return () => {
			document.removeEventListener('keydown', handelKeypress, true);
		};
	});

	let buttonElement: HTMLButtonElement | undefined = $state();

	let pageIndicator: string = $state('1/0');
	$effect(() => {
		if ($pagenav) {
			$pagenav = null;
			all = [];
		}
	});
	let currentChapterID: number = $state(data.ChapterID);
	$effect(() => {
		currentChapterID = data.ChapterID;
	});
	$effect(() => {
		const _ = [currentChapterID];
		untrack(loadNew);
	});
	let nextid = $derived.by(() => {
		const _ = [currentChapterID];
		untrack(() => {
			return getChapterAfterID(currentChapterID, manga)?.id;
		});
	});
	$effect(() => {
		if (
			nextid !== undefined &&
			mmState.preLoadNextChapter &&
			nextid !== preLoadingId
		) {
			untrack(() => {
				preLoadingId = nextid;
			});
			preload = client
				.mutation(fetchChapterPages, { chapterId: nextid })
				.toPromise();
		}
	});
	$effect(() => {
		const _ = [pages];
		untrack(() => {
			updatePages(pages);
		});
	});
	$effect(() => {
		if (mmState.ReaderMode === Mode.RTL) {
			path = layoutToPath(paths.rtl, mmState.NavLayout);
		} else {
			path = layoutToPath(paths.ltr, mmState.NavLayout);
		}
	});
	$effect(() => {
		dataStore.set(data);
	});
	$effect(() => {
		$mangaTitle = manga?.data?.manga?.title ?? '';
	});
	$effect(() => {
		$chapterTitle =
			filteredChapters?.find((e) => e.id === currentChapterID)?.name ?? '';
	});
	$effect(() => {
		const _ = [currentChapterID];
		untrack(got);
	});
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
	$effect(() => {
		AppBarData(`${manga?.data?.manga?.title} ${$chapterTitle}`);
	});
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
	$effect(() => {
		if (!$drawerStore.open) {
			buttonElement?.focus();
		}
	});
</script>

<button
	tabindex="0"
	bind:this={buttonElement}
	onclick={handleClick}
	class="w-full"
>
	{#if $ViewNav}
		<div class="pointer-events-none">
			<div class="fixed z-10 bg-blue-500/50" style={currPath.forward}></div>
			<div class="fixed z-10 bg-red-500/50" style={currPath.back}></div>
			{#if currPath.menu}
				<div class="fixed z-10 bg-green-500/50" style={currPath.menu}></div>
			{/if}
		</div>
	{/if}
	{#each all as chapter, index (chapter.chapterID)}
		<div>
			<div
				class="
				{mmState.ReaderMode === Mode.Vertical && 'flex flex-col items-center'}
				{mmState.ReaderMode === Mode.single && 'flex flex-col items-center'}
				{mmState.ReaderMode === Mode.RTL &&
					'place-content-center[&>div:nth-child(even)]:justify-self-start grid grid-cols-2 [&>div:nth-child(odd)]:justify-self-end'}
				{mmState.ReaderMode === Mode.LTR &&
					'place-content-center[&>div:nth-child(even)]:justify-self-start grid grid-cols-2 [&>div:nth-child(odd)]:justify-self-end'}
				"
				dir={mmState.ReaderMode === Mode.RTL ? 'rtl' : 'ltr'}
			>
				{#if (mmState.ReaderMode === Mode.RTL || mmState.ReaderMode === Mode.LTR) && mmState.Offset}
					<div></div>
				{/if}
				{#each chapter.pages as page, pageIndex (page)}
					<div
						class="h-auto w-auto
							{mmState.Margins && mmState.ReaderMode === Mode.Vertical && 'mb-4'}
							{mmState.Margins && mmState.ReaderMode === Mode.single && 'mb-4'}
							{mmState.Margins &&
							mmState.ReaderMode === Mode.RTL &&
							'mb-4 odd:ml-2 even:mr-2'}
							{mmState.Margins &&
							mmState.ReaderMode === Mode.LTR &&
							'mb-4 odd:mr-2 even:ml-2'}
							{mmState.Scale && mmState.ReaderMode !== Mode.Vertical
							? 'h-full max-h-screen'
							: 'h-auto'} {mmState.Scale && mmState.ReaderMode === Mode.Vertical
							? 'w-full'
							: 'w-auto'}
								{mmState.Scale && mmState.ReaderMode === Mode.single ? 'max-w-full' : ''}"
					>
						<IntersectionObserver
							onintersect={(e) => {
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
							top={mmState.Margins ? 16 : 0}
						/>
						<div
							id="c{index}p{pageIndex}"
							class="{mmState.Scale && mmState.ReaderMode !== Mode.Vertical
								? 'h-full max-h-screen'
								: 'h-auto'} {mmState.Scale &&
							mmState.ReaderMode === Mode.Vertical
								? 'w-full'
								: 'w-auto'}
								{mmState.Scale && mmState.ReaderMode === Mode.single ? 'max-w-full' : ''}"
						>
							<Image
								reload_button={true}
								src={page}
								height={mmState.Scale && mmState.ReaderMode !== Mode.Vertical
									? 'max-h-screen h-full'
									: 'h-auto'}
								width="{mmState.Scale && mmState.ReaderMode === Mode.Vertical
									? 'w-full'
									: 'w-auto'}
									{mmState.Scale && mmState.ReaderMode === Mode.single ? 'max-w-full' : ''}"
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
				onintersect={(e) => {
					if (e) {
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
	{#if mmState.doPageIndicator}
		<div
			class="fixed bottom-2 left-1/2 -translate-x-1/2 rounded bg-surface-500/60 p-2 text-black dark:text-white"
		>
			{pageIndicator}
		</div>
	{/if}

	{#if preload}
		{#await preload then preloaded}
			{#if preloaded.data?.fetchChapterPages}
				{#each preloaded.data.fetchChapterPages.pages as value}
					<img src={value} alt="img" class="h-0 w-0" />
				{/each}
			{/if}
		{/await}
	{/if}
</button>
