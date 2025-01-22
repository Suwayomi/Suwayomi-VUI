<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import IconButton from '$lib/components/IconButton.svelte';
	import Slide from '$lib/components/Slide.svelte';
	import { enumKeys } from '$lib/util.svelte';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import {
		ViewNav,
		chapterTitle,
		get_manga,
		mangaTitle
	} from './chapterStores.svelte';
	import {
		ChapterTitle,
		Layout,
		mmState,
		Mode
	} from '$lib/simpleStores.svelte';
	import { onMount } from 'svelte';
	import { getContextClient } from '@urql/svelte';
	import { filterChapters } from '../../util';
	import type { Writable } from 'svelte/store';
	import { onNavigate } from '$app/navigation';
	import { longPress } from '$lib/press';
	import { trackProgress, updateChapters } from '$lib/gql/Mutations';
	import {
		IntersectionObserverAction,
		MakeSimpleCallback
	} from '$lib/actions/IntersectionObserver.svelte';
	import { SvelteSet } from 'svelte/reactivity';
	const drawerStore = getDrawerStore();

	let data = $derived(
		$drawerStore.meta as Writable<{
			MangaID: number;
			ChapterID: number;
		}>
	);

	mmState.id = $data.MangaID;

	onMount(() => {
		let elem = document.querySelector(`#chapter-${$data.ChapterID}`)!;
		elem = elem.previousElementSibling ?? elem;
		const to = elem?.getBoundingClientRect();
		chapterSideElement?.scrollTo({
			top:
				chapterSideElement.scrollTop -
				chapterSideElement.getBoundingClientRect().top +
				(to?.top ?? 0)
		});
		if (
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent
			) &&
			mmState.value.mobileFullScreenOnChapterPage
		) {
			document.exitFullscreen();
		}
		return () => {
			if (
				/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
					navigator.userAgent
				) &&
				mmState.value.mobileFullScreenOnChapterPage
			) {
				document.documentElement.requestFullscreen();
			}
		};
	});

	const client = getContextClient();

	let manga = $derived(get_manga.manga);

	let filteredChapters = $derived(
		manga?.data?.manga.chapters.nodes
			.filter(filterChapters(mmState, true))
			.sort((a, b) => {
				return b.sourceOrder - a.sourceOrder;
			})
	);

	let chapterSideElement: HTMLDivElement | undefined = $state();

	onNavigate((e) => {
		const match = e.to?.url.pathname.match(/\/manga\/(\d+)\/chapter\/(\d+)/);
		if (!match) {
			drawerStore.close();
		}
	});

	let didLongPress = -1;

	async function setChapterRead(
		chapter: NonNullable<typeof filteredChapters>[number]
	) {
		didLongPress = chapter.id;
		await client
			.mutation(updateChapters, { isRead: !chapter.isRead, ids: [chapter.id] })
			.toPromise();
		if ($data.MangaID)
			await client
				.mutation(trackProgress, { mangaId: $data.MangaID })
				.toPromise();
	}
	let intersecting: SvelteSet<number> = $state(new SvelteSet());
</script>

{#if mmState}
	<div class="flex h-svh flex-col p-4">
		<div class="mb-4 flex justify-end border-b border-surface-500 pb-4">
			<IconButton
				tabindex={999}
				name="mdi:chevron-left"
				height="h-16"
				onclick={() => {
					history.back();
					drawerStore.close();
				}}
			/>
		</div>
		<h1 class="h2 my-2 line-clamp-3 min-h-fit pl-4 leading-[2.75rem]">
			{$mangaTitle}
		</h1>
		<h2
			class="h3 mt-4 line-clamp-1 min-h-fit border-y border-surface-500 pl-4 leading-10"
		>
			{$chapterTitle}
		</h2>

		<div class="my-2 flex flex-col space-y-2">
			<Slide
				tabindex={0}
				class="p-1 hover:variant-glass-surface"
				bind:checked={mmState.value.Margins}
			>
				Page Margins
			</Slide>
			<Slide
				class="p-1 hover:variant-glass-surface"
				bind:checked={mmState.value.Scale}
			>
				Page Scale
			</Slide>
			<Slide
				class="p-1 hover:variant-glass-surface"
				bind:checked={mmState.value.SmoothScroll}
			>
				Smooth Scroll
			</Slide>
			{#if mmState.value.ReaderMode !== Mode.Vertical}
				<Slide
					class="p-1 hover:variant-glass-surface"
					bind:checked={mmState.value.Offset}
				>
					Page Offset
				</Slide>
			{/if}
			<label class="pl-3">
				<span>Reader Mode</span>
				<select bind:value={mmState.value.ReaderMode} class="select">
					{#each enumKeys(Mode) as value}
						<option {value}>{value}</option>
					{/each}
				</select>
			</label>
			<Slide class="p-1 hover:variant-glass-surface" bind:checked={$ViewNav}>
				View Navigation Layout
			</Slide>
			<label class="pl-3">
				<span>Navigation Layout</span>
				<select bind:value={mmState.value.NavLayout} class="select">
					{#each enumKeys(Layout) as value}
						<option {value}>{value}</option>
					{/each}
				</select>
			</label>
		</div>
		<div
			class="ml-3 h-full shrink overflow-y-auto"
			bind:this={chapterSideElement}
			id="chapterSideElement"
		>
			<div class=" w-full">
				{#each filteredChapters ?? [] as chapter}
					<div
						class="relative h-20"
						id="chapter-{chapter.id}"
						use:IntersectionObserverAction={{
							rootMargin: '400px 0px 400px 0px',
							root: chapterSideElement,
							callback: MakeSimpleCallback(intersecting, chapter.id)
						}}
					>
						{#if intersecting.has(chapter.id)}
							<a
								use:longPress
								onlongPress={() => setChapterRead(chapter)}
								data-sveltekit-replacestate
								onclick={(e) => {
									if (didLongPress === chapter.id) {
										e.preventDefault();
										e.stopPropagation();
									}
									didLongPress = -1;
								}}
								href="./{chapter.id}?pagenav"
								class="h-20"
							>
								<div
									class="w-full space-y-0 p-1
									{chapter.id === $data?.ChapterID && 'variant-ghost'}
									{chapter.isRead && 'opacity-50'}"
								>
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
							</a>
						{/if}
					</div>
				{:else}
					No chapters found
				{/each}
			</div>
		</div>
	</div>
{/if}
