<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Image from '$lib/components/Image.svelte';
	import IntersectionObserver from '$lib/components/IntersectionObserver.svelte';
	import { getToastStore } from '$lib/components/Toast/stores';
	import {
		fetchChapterPages,
		getManga,
		type FetchChapterPagesMutation,
		type GetMangaQuery,
		updateChapter
	} from '$lib/generated';
	import { Errorhelp } from '$lib/util';
	import type { FetchResult } from '@apollo/client';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { ViewNav, chapterTitle, mangaTitle } from './chapterStores';
	import { paths, type PathLayout, type Paths, type Tpath } from './paths';
	import { Layout, MangaMeta, Mode } from '$lib/simpleStores';
	import { onMount } from 'svelte';
	import { AppBarData } from '$lib/MountTitleAction';

	export let data: PageData;
	let mangaMeta = MangaMeta(data.MangaID);

	let topchapter: number;
	onMount(() => {
		topchapter = data.ChapterID;
	});

	$: currentChapterID = data.ChapterID;

	const toastStore = getToastStore();
	const manga = getManga({ variables: { id: data.MangaID } });
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
		pages: FetchChapterPagesMutation['fetchChapterPages']['pages'];
	}[] = [];

	let pages: Promise<FetchResult<FetchChapterPagesMutation>>;
	$: currentChapterID, loadNew();
	function loadNew() {
		if (preload) pages = preload;
		else pages = fetchChapterPages({ variables: { chapterId: currentChapterID } });
	}

	let preload: Promise<FetchResult<FetchChapterPagesMutation>> | undefined = undefined;
	let preloadingid: number | undefined = undefined;
	$: nextid = getChapterAfterID(currentChapterID, $manga)?.id;
	$: if (nextid !== undefined && $mangaMeta.preLoadNextChapter && nextid !== preloadingid) {
		preloadingid = nextid;
		preload = fetchChapterPages({ variables: { chapterId: nextid } });
	}
	$: updatepages(pages);
	async function updatepages(pages: Promise<FetchResult<FetchChapterPagesMutation>>) {
		chapterLoading = true;
		const obj: (typeof all)[0] = {
			chapterID: currentChapterID,
			pages: []
		};
		await Errorhelp(`failed to load chapter ${obj.chapterID}`, pages, toastStore, (e) => {
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

	function getChapterOfID(
		currentID: number
	): GetMangaQuery['manga']['chapters']['nodes'][0] | undefined {
		return $manga.data.manga?.chapters.nodes.find((e) => e.id === currentID);
	}

	function getChapterAfterID(
		currentID: number,
		_: unknown = undefined
	): GetMangaQuery['manga']['chapters']['nodes'][0] | undefined {
		const tmp = $manga.data.manga?.chapters.nodes.findIndex((e) => e.id === currentID);
		return $manga.data.manga?.chapters.nodes[tmp + 1] ?? undefined;
	}

	function getChapterBeforeID(
		currentID: number
	): GetMangaQuery['manga']['chapters']['nodes'][0] | undefined {
		const tmp = $manga.data.manga?.chapters.nodes.findIndex((e) => e.id === currentID);
		return $manga.data.manga?.chapters.nodes[tmp - 1] ?? undefined;
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
				gobackChapter();
				scroll80();
			} else doscroll();
			return;
		}
		if (keyEvent.code === 'ArrowDown' || keyEvent.code === 'ArrowRight') {
			keyEvent.preventDefault();
			keyEvent.stopPropagation();
			doscroll();
			return;
		}
		if (keyEvent.code === 'ArrowUp' || keyEvent.code === 'ArrowLeft') {
			gobackChapter();
			keyEvent.preventDefault();
			keyEvent.stopPropagation();
			scroll80();
			return;
		}
	}

	let gobackChapterLoading = false;

	async function gobackChapter() {
		if (gobackChapterLoading) return;
		gobackChapterLoading = true;
		if (!pageElement) {
			pageElement = document.querySelector('#page') as HTMLDivElement;
		}
		if (pageElement.scrollTop === 0) {
			const tmp = getChapterBeforeID(topchapter);
			if (tmp) {
				const tttmp = fetchChapterPages({ variables: { chapterId: tmp.id } });
				const obj: (typeof all)[0] = {
					chapterID: tmp.id,
					pages: []
				};
				await Errorhelp(`failed to load chapter ${obj.chapterID}`, tttmp, toastStore, (e) => {
					if (!e.data) return;
					obj.pages = e.data.fetchChapterPages.pages;
					all = [obj, ...all];
				});
				const topimg = document.querySelector(`#c1p0`);
				if (topimg)
					pageElement?.scrollTo({
						top: pageElement.scrollTop + topimg.getBoundingClientRect().y + 1,
						behavior: 'instant'
					});
				topchapter = tmp.id;
			} else {
				toastStore.trigger({
					message: "You can't go back, you are already at the first chapter"
				});
			}
		}
		gobackChapterLoading = false;
	}

	function handleClick(e: MouseEvent) {
		if (!pageElement) {
			pageElement = document.querySelector('#page') as HTMLDivElement;
		}
		if (pointInPoly([e.x, e.y], polyToPOLLY(path.forward))) {
			doscroll();
		} else if (pointInPoly([e.x, e.y], polyToPOLLY(path.back))) {
			scroll80();
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

	function pointInPoly(point: [number, number], vs: [number, number][] | undefined): boolean {
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

			const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
			if (intersect) {
				inside = !inside;
			}
		}

		return inside;
	}

	function polyToPOLLY(polly: Tpath | undefined): [number, number][] | undefined {
		if (polly === undefined) {
			return undefined;
		}
		return polly.map((point) => {
			return [(point[0] * window.innerWidth) / 100, (point[1] * window.innerHeight) / 100];
		});
	}

	function scroll80(ud = false) {
		pageElement?.scrollTo({
			top:
				pageElement.scrollTop + (ud ? pageElement.clientHeight : -pageElement.clientHeight) * 0.8,
			behavior: $mangaMeta.SmoothScroll ? 'smooth' : 'instant'
		});
	}

	function doscroll() {
		if (!lowestIntersetc) {
			scroll80(true);
			return;
		}
		pageElement?.scrollTo({
			top: pageElement.scrollTop + lowestIntersetc.getBoundingClientRect().y + 1,
			behavior: $mangaMeta.SmoothScroll ? 'smooth' : 'instant'
		});
	}

	let lastupdate = 0;

	function PageIntersect(
		e: CustomEvent<boolean>,
		selector: string,
		chapterIndex: number,
		pageIndex: number,
		maxPages: number,
		id: number
	) {
		if (e.detail) {
			visiblePages = [
				...visiblePages,
				{
					selector,
					chapterIndex,
					pageIndex
				}
			];
			if (lastupdate !== pageIndex) {
				updateChapter({
					variables: {
						id,
						lastPageRead: pageIndex,
						isRead: pageIndex >= maxPages * 0.8 ? true : null
					}
				});
				lastupdate = pageIndex;
			}
		} else {
			visiblePages = visiblePages.filter((e) => e.selector !== selector);
		}
	}

	$: $mangaTitle = $manga.data.manga?.title ?? '';
	$: $chapterTitle =
		$manga.data.manga?.chapters.nodes.find((e) => e.id === currentChapterID)?.name ?? '';
	$: currentChapterID, got();

	function got() {
		goto($page.url.pathname.replace(/[^/]*$/, currentChapterID.toString()), {
			replaceState: true,
			noScroll: true
		});
	}

	$: lowestIntersetc = document.querySelector(
		visiblePages.reduce(
			(a, c) => {
				if (c.chapterIndex >= a.chapterIndex && c.pageIndex > a.pageIndex) {
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

	$: $manga.data.manga, AppBarData(`${$manga.data.manga?.title} ${$chapterTitle}` || 'Manga');
	type tmp = (typeof path)[keyof typeof path];
	type ttmp = keyof typeof path;

	$: currpath = Object.fromEntries(
		(Object.entries(path) as [ttmp, tmp][]).map((dat): [ttmp, string] => {
			if (path === undefined) {
				return [dat[0], ''] as [ttmp, string];
			}
			return [
				dat[0],
				`clip-path: polygon(${dat[1]
					.map((point) => {
						return point
							.map((persent) => {
								return persent === 0 ? persent.toString() : `${persent}%`;
							})
							.join(' ');
					})
					.join(',')});top: 0;
      bottom: 0;
      left: 0;
      right: 0;
			`
			] as [ttmp, string];
		})
	);

	onMount(() => {
		window.addEventListener('keydown', handelKeypress, true);
		return () => {
			window.removeEventListener('keydown', handelKeypress, true);
		};
	});

	let buttonElement: HTMLButtonElement;

	$: if (!$drawerStore.open) {
		buttonElement?.focus();
	}
</script>

<button tabindex="0" bind:this={buttonElement} on:click={handleClick} class="w-full">
	{#if $ViewNav}
		<div class="pointer-events-none">
			<div class="fixed bg-blue-500/50 z-10" style={currpath.forward} />
			<div class="fixed bg-red-500/50 z-10" style={currpath.back} />
			{#if currpath.menu}
				<div class="fixed bg-green-500/50 z-10" style={currpath.menu} />
			{/if}
		</div>
	{/if}
	{#each all as chapter, index (chapter.chapterID)}
		<div>
			<div
				class="
				{$mangaMeta.ReaderMode === Mode.Vertical && 'flex flex-col items-center'}
				{$mangaMeta.ReaderMode === Mode.single && 'flex flex-col items-center'}
				{$mangaMeta.ReaderMode === Mode.RTL &&
					`grid grid-cols-2 place-content-center
						[&>div:nth-child(odd)]:justify-self-end [&>div:nth-child(even)]:justify-self-start`}
				{$mangaMeta.ReaderMode === Mode.LTR &&
					`grid grid-cols-2 place-content-center
						[&>div:nth-child(odd)]:justify-self-end [&>div:nth-child(even)]:justify-self-start`}"
				dir={$mangaMeta.ReaderMode === Mode.RTL ? 'rtl' : 'ltr'}
			>
				{#if ($mangaMeta.ReaderMode === Mode.RTL || $mangaMeta.ReaderMode === Mode.LTR) && $mangaMeta.Offset}
					<div />
				{/if}
				{#each chapter.pages as page, pageindex (page)}
					<div
						class="w-auto h-auto
							{$mangaMeta.Margins && $mangaMeta.ReaderMode === Mode.Vertical && 'mb-4'}
							{$mangaMeta.Margins && $mangaMeta.ReaderMode === Mode.single && 'mb-4'}
							{$mangaMeta.Margins && $mangaMeta.ReaderMode === Mode.RTL && 'even:mr-2 odd:ml-2 mb-4'}
							{$mangaMeta.Margins && $mangaMeta.ReaderMode === Mode.LTR && 'even:ml-2 odd:mr-2 mb-4'}
							{$mangaMeta.Scale && $mangaMeta.ReaderMode !== Mode.Vertical
							? 'max-h-screen h-full'
							: 'h-auto'} {$mangaMeta.Scale && $mangaMeta.ReaderMode === Mode.Vertical
							? 'w-full'
							: 'w-auto'}
								{$mangaMeta.Scale && $mangaMeta.ReaderMode === Mode.single ? 'max-w-full' : ''}"
					>
						<IntersectionObserver
							on:intersect={(e) => {
								PageIntersect(
									e,
									`#c${index}p${pageindex}`,
									index,
									pageindex,
									chapter.pages.length,
									chapter.chapterID
								);
							}}
							root={document.querySelector('#page') ?? undefined}
							bottom={0}
							top={$mangaMeta.Margins ? 16 : 0}
						/>
						<div
							id="c{index}p{pageindex}"
							class="{$mangaMeta.Scale && $mangaMeta.ReaderMode !== Mode.Vertical
								? 'max-h-screen h-full'
								: 'h-auto'} {$mangaMeta.Scale && $mangaMeta.ReaderMode === Mode.Vertical
								? 'w-full'
								: 'w-auto'}
								{$mangaMeta.Scale && $mangaMeta.ReaderMode === Mode.single ? 'max-w-full' : ''}"
						>
							<Image
								src={page}
								height={$mangaMeta.Scale && $mangaMeta.ReaderMode !== Mode.Vertical
									? 'max-h-screen h-full'
									: 'h-auto'}
								width="{$mangaMeta.Scale && $mangaMeta.ReaderMode === Mode.Vertical
									? 'w-full'
									: 'w-auto'}
									{$mangaMeta.Scale && $mangaMeta.ReaderMode === Mode.single ? 'max-w-full' : ''}"
								rounded=" rounded-none"
								LoadingHeight="h-screen"
								Loadingwidth="w-screen"
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
						updateChapter({
							variables: {
								id: chapter.chapterID,
								lastPageRead: chapter.pages.length,
								isRead: true
							}
						});
						LoadNextChapter(currentChapterID);
					}
				}}
				root={document.querySelector('#page') ?? undefined}
			/>
		{/if}
		<div class="p-2">
			<div
				class="card variant-glass-surface w-full flex flex-col justify-center items-center max-h-96 h-[50vh]"
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
</button>
