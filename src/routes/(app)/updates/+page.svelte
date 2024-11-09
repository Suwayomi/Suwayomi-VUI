<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import UpdatesActions from './UpdatesActions.svelte';
	import { AppBarData } from '$lib/MountTitleAction';
	import MangaCard from '$lib/components/MangaCard.svelte';
	import { longPress } from '$lib/press';
	import { selectMode, selected } from './UpdatesStores';
	import IntersectionObserver from '$lib/components/IntersectionObserver.svelte';
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	import { goto } from '$app/navigation';
	import type { UpdateNode } from './UpdatesStores';
	import {
		dlreabook,
		formatDate,
		gridValues,
		HelpDoSelect,
		HelpSelectAll,
		queryState
	} from '$lib/util.svelte';
	import { display, gmState } from '$lib/simpleStores.svelte';

	import { getContextClient } from '@urql/svelte';
	import { updates } from '$lib/gql/Queries';
	import type { ResultOf } from '$lib/gql/graphql';
	import { untrack } from 'svelte';

	AppBarData('Updates', {
		component: UpdatesActions,
		props: {
			selectAll,
			updateSelectedValues
		}
	});

	let page = $state(0);
	let all = $state<ResultOf<typeof updates>['chapters'] | null>(null);
	const client = getContextClient();
	function updateall() {
		if (!update.value.data?.chapters) return;
		if (!all) {
			all = $state.snapshot(update.value.data.chapters);
			return;
		}
		all.nodes.push(...update.value.data.chapters.nodes);
		all.pageInfo = update.value.data.chapters.pageInfo;
	}

	function LongHandler(): void {
		$selectMode = true;
	}
	let lastSelected: UpdateNode | undefined = $state();

	function selectAll() {
		HelpSelectAll(selectMode, selected, all?.nodes);
	}

	function updateSelectedValues(prop: dlreabook, is: boolean | undefined) {
		if (!$selected || is === undefined) return;
		switch (prop) {
			case dlreabook.bookmark:
				$selected.forEach((element) => {
					const fin = all?.nodes.findIndex((ele) => ele.id === element.id);
					if (fin && all?.nodes[fin]) all.nodes[fin].isBookmarked = is;
				});
				break;
			case dlreabook.download:
				$selected.forEach((element) => {
					const fin = all?.nodes.findIndex((ele) => ele.id === element.id);
					if (fin && all?.nodes[fin]) all.nodes[fin].isDownloaded = is;
				});
				break;
			default:
				$selected.forEach((element) => {
					const fin = all?.nodes.findIndex((ele) => ele.id === element.id);
					if (fin && all?.nodes[fin]) all.nodes[fin].isRead = is;
				});
				break;
		}
	}
	let update = $derived.by(() => {
		const _ = [page];
		return untrack(() =>
			queryState({
				client,
				query: updates,
				variables: { offset: page }
			})
		);
	});
	$effect(() => {
		const _ = [update.value];
		untrack(updateall);
	});
</script>

{#if !all && update.value.fetching}
	<div class="grid {gridValues} m-2 gap-2">
		{#each new Array(110) as _}
			<div class="aspect-cover w-full">
				<div
					class="placeholder h-full animate-pulse
						{gmState.Display === display.Compact && 'rounded-lg'}
						{gmState.Display === display.Comfortable && 'rounded-none rounded-t-lg'}"
				></div>
				{#if gmState.Display === display.Comfortable}
					<div
						class="placeholder h-12 animate-pulse rounded-none rounded-b-lg px-2 text-center"
					></div>
				{/if}
			</div>
		{/each}
	</div>
{:else if !all && update.value.error}
	<div class="white-space-pre-wrap">
		{JSON.stringify(update.value.error, null, 4)}
	</div>
{:else if all?.nodes}
	<div class="grid {gridValues} m-2 gap-2">
		{#each all.nodes as updat}
			<IntersectionObserver
				root={document.querySelector('#page') ?? undefined}
				top={400}
				bottom={400}
				class="aspect-cover w-full"
			>
				{#snippet children({ intersecting })}
					{#if intersecting}
						<a
							use:longPress
							onlongPress={() => $selectMode || LongHandler()}
							href="/manga/{updat.manga.id}"
							onclick={(e) => {
								e.stopPropagation();
								if (e.ctrlKey) return;
								if ($selectMode) {
									e.preventDefault();
									lastSelected = HelpDoSelect(
										updat,
										e,
										lastSelected,
										all?.nodes,
										selected
									);
								} else {
									e.preventDefault();
									goto(`/manga/${updat.manga.id}`);
								}
							}}
							class="h-full cursor-pointer hover:opacity-70"
							tabindex="-1"
						>
							<MangaCard
								thumbnailUrl={updat.manga.thumbnailUrl ?? ''}
								title={updat.manga.title}
								class={$selectMode && 'opacity-80'}
								titleA="{updat.isDownloaded ? 'Downloaded' : ''}
	{updat.isRead ? 'Read' : ''}
	{updat.isBookmarked ? 'Bookmarked' : ''}"
								rounded="{gmState.Display === display.Compact && 'rounded-lg'}
								{gmState.Display === display.Comfortable && 'rounded-none rounded-t-lg'}"
							>
								{#if $selectMode}
									<div
										class="bg-base-100/75 absolute bottom-0 left-0 right-0 top-0 cursor-pointer"
									>
										<IconWrapper
											name={$selected[updat.id] === undefined
												? 'fluent:checkbox-unchecked-24-filled'
												: 'fluent:checkbox-checked-24-filled'}
											class="absolute right-2 top-2 text-4xl"
										/>
									</div>
								{/if}
								{#if gmState.Display === display.Compact}
									<div
										class="variant-glass absolute bottom-0 left-0 right-0 rounded-b-olg"
									>
										<div
											class="line-clamp-1 h-6 px-2 text-center"
											title={updat.manga.title}
										>
											{updat.manga.title}
										</div>
										<div
											class="line-clamp-1 h-6 px-2 text-center"
											title={updat.name}
										>
											{updat.name}
										</div>
										<div
											class="line-clamp-1 h-6 px-2 text-center"
											title={new Date(
												parseInt(updat.fetchedAt) * 1000
											).toLocaleString()}
										>
											{formatDate(new Date(parseInt(updat.fetchedAt) * 1000))}
										</div>
									</div>
								{/if}
								<div class="absolute left-2 top-2 flex h-8">
									{#if updat.isDownloaded}
										<IconWrapper class="h-full w-full" name="mdi:download" />
									{/if}
									{#if updat.isRead}
										<IconWrapper
											class="h-full w-full"
											name="mdi:book-open-page-variant-outline"
										/>
									{/if}
									{#if updat.isBookmarked}
										<IconWrapper class="h-full w-full" name="mdi:bookmark" />
									{/if}
								</div>
							</MangaCard>
							{#if gmState.Display === display.Comfortable}
								<div class="variant-glass-surface rounded-b-lg">
									<div
										class="line-clamp-1 h-6 px-2 text-center"
										title={updat.manga.title}
									>
										{updat.manga.title}
									</div>
									<div
										class="line-clamp-1 h-6 px-2 text-center"
										title={updat.name}
									>
										{updat.name}
									</div>
									<div
										class="line-clamp-1 h-6 px-2 text-center"
										title={new Date(
											parseInt(updat.fetchedAt) * 1000
										).toLocaleString()}
									>
										{new Date(
											parseInt(updat.fetchedAt) * 1000
										).toLocaleString()}
									</div>
								</div>
							{/if}
						</a>
					{/if}
				{/snippet}
			</IntersectionObserver>
		{/each}
		{#if !update.value.fetching && all.pageInfo.hasNextPage}
			<IntersectionObserver
				root={document.querySelector('#page') ?? undefined}
				top={400}
				bottom={400}
				onintersect={(e) => {
					if (e) page = all?.nodes.length ?? 0;
				}}
			/>
		{/if}
		{#if update.value.fetching && all.pageInfo.hasNextPage}
			{#each new Array(10) as _}
				<div class="aspect-cover w-full">
					<div
						class="placeholder h-full animate-pulse
							{gmState.Display === display.Compact && 'rounded-lg'}
							{gmState.Display === display.Comfortable && 'rounded-none rounded-t-lg'}"
					></div>
					{#if gmState.Display === display.Comfortable}
						<div
							class="placeholder h-12 animate-pulse rounded-none rounded-b-lg px-2 text-center"
						></div>
					{/if}
				</div>
			{/each}
		{/if}
	</div>
{/if}
