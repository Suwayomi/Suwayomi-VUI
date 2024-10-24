<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import IconButton from '$lib/components/IconButton.svelte';
	import Slide from '$lib/components/Slide.svelte';
	import { enumKeys } from '$lib/util';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { ViewNav, chapterTitle, mangaTitle } from './chapterStores';
	import { ChapterTitle, Layout, MangaMeta, Mode } from '$lib/simpleStores';
	import { onMount, untrack } from 'svelte';
	import { getContextClient, queryStore } from '@urql/svelte';
	import { getManga } from '$lib/gql/Queries';
	import { filterChapters } from '../../util';
	import type { Writable } from 'svelte/store';
	import IntersectionObserver from '$lib/components/IntersectionObserver.svelte';
	import { onNavigate } from '$app/navigation';
	const drawerStore = getDrawerStore();

	let data = $derived(
		$drawerStore.meta as Writable<{
			MangaID: number;
			ChapterID: number;
		}>
	);

	let mangaMeta: ReturnType<typeof MangaMeta> = $state(
		MangaMeta($data?.MangaID)
	);
	$effect(() => {
		mangaMeta = MangaMeta($data?.MangaID);
	});

	onMount(() => {
		// let elem = document.querySelector(`#chapter-${$data.ChapterID}`)!;
		// elem = elem.previousElementSibling ?? elem;
		// const to = elem?.getBoundingClientRect();
		// chapterSideElement?.scrollTo({
		// 	top:
		// 		chapterSideElement.scrollTop -
		// 		chapterSideElement.getBoundingClientRect().top +
		// 		(to?.top ?? 0)
		// });
		if (
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent
			) &&
			$mangaMeta.mobileFullScreenOnChapterPage
		) {
			document.exitFullscreen();
		}
		return () => {
			if (
				/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
					navigator.userAgent
				) &&
				$mangaMeta.mobileFullScreenOnChapterPage
			) {
				document.documentElement.requestFullscreen();
			}
		};
	});

	const client = getContextClient();

	let manga = queryStore({
		client,
		query: getManga,
		variables: { id: $data?.MangaID }
	});

	let filteredChapters = $derived.by(() => {
		untrack(() => {
			manga.pause();
		});
		const _ = [mangaMeta, $manga];
		const tmp = untrack(() => {
			return $manga.data?.manga.chapters.nodes
				.filter(filterChapters(mangaMeta, true))
				.sort((a, b) => {
					return b.sourceOrder - a.sourceOrder;
				});
		});
		untrack(() => {
			manga.resume();
		});
		return tmp;
	});

	let chapterSideElement: HTMLDivElement | undefined = $state();

	onNavigate((e) => {
		const match = e.to?.url.pathname.match(/\/manga\/(\d+)\/chapter\/(\d+)/);
		if (!match) {
			drawerStore.close();
		}
	});
</script>

{#if $mangaMeta}
	<div class="flex flex-col p-4">
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
		<h1 class="h2 my-2 line-clamp-3 pl-4">{$mangaTitle}</h1>
		<h2 class="h3 mt-4 border-y border-surface-500 p-4">{$chapterTitle}</h2>

		<div class="my-2 flex flex-col space-y-2">
			<Slide
				tabindex={0}
				class="p-1 hover:variant-glass-surface"
				bind:checked={$mangaMeta.Margins}
			>
				Page Margins
			</Slide>
			<Slide
				class="p-1 hover:variant-glass-surface"
				bind:checked={$mangaMeta.Scale}
			>
				Page Scale
			</Slide>
			<Slide
				class="p-1 hover:variant-glass-surface"
				bind:checked={$mangaMeta.SmoothScroll}
			>
				Smooth Scroll
			</Slide>
			{#if $mangaMeta.ReaderMode !== Mode.Vertical}
				<Slide
					class="p-1 hover:variant-glass-surface"
					bind:checked={$mangaMeta.Offset}
				>
					Page Offset
				</Slide>
			{/if}
			<label class="pl-3">
				<span>Reader Mode</span>
				<select bind:value={$mangaMeta.ReaderMode} class="select">
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
				<select bind:value={$mangaMeta.NavLayout} class="select">
					{#each enumKeys(Layout) as value}
						<option {value}>{value}</option>
					{/each}
				</select>
			</label>
		</div>
		<div class="ml-3">
			<div
				bind:this={chapterSideElement}
				id="chapterSideElement"
				class="max-h-60 w-full overflow-y-auto"
			>
				{#each $state.snapshot(filteredChapters ?? []) as chapter}
					<IntersectionObserver
						class="relative h-20"
						root={chapterSideElement}
						top={400}
						bottom={400}
						id="chapter-{chapter.id}"
					>
						{#snippet children({ intersecting })}
							{#if intersecting}
								<a
									data-sveltekit-replacestate
									href="./{chapter.id}?pagenav"
									class="h-20"
								>
									<div
										class="w-full space-y-0 p-1
										{chapter.id === $data?.ChapterID && 'variant-ghost'}
										{chapter.isRead && 'opacity-50'}"
									>
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
												: ''}{chapter.scanlator
												? ` • ${chapter.scanlator}`
												: ''}
										</div>
									</div>
								</a>
							{/if}
						{/snippet}
					</IntersectionObserver>
				{:else}
					No chapters found
				{/each}
			</div>
		</div>
	</div>
{/if}
