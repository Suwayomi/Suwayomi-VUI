<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import UpdatesActions from './UpdatesActions.svelte';
	import { AppBarData } from '$lib/MountTitleAction';
	import MangaCard from '$lib/components/ImageCard.svelte';
	import { longPress } from '$lib/press';
	import { selectState } from './UpdatesStores';
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	import type { UpdateNode } from './UpdatesStores';
	import {
		dlreabook,
		formatDate,
		gridValues,
		OTT,
		queryState
	} from '$lib/util.svelte';
	import { display, gmState } from '$lib/simpleStores.svelte';

	import { getContextClient } from '@urql/svelte';
	import { updates } from '$lib/gql/Queries';
	import type { ResultOf } from '$lib/gql/graphql';
	import {
		IntersectionObserverAction,
		MakeSimpleCallback
	} from '$lib/actions/IntersectionObserver.svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import FakeMangaItem from '$lib/components/FakeMangaItem.svelte';

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
		selectState.selectMode = true;
	}
	let lastSelected: UpdateNode | undefined = $state();

	function selectAll() {
		selectState.SelectAll(all?.nodes);
	}

	function updateSelectedValues(prop: dlreabook, is: boolean | undefined) {
		if (!selectState.selected || is === undefined) return;
		switch (prop) {
			case dlreabook.bookmark:
				selectState.selected.forEach((element) => {
					const fin = all?.nodes.findIndex((ele) => ele.id === element.id);
					if (fin && all?.nodes[fin]) all.nodes[fin].isBookmarked = is;
				});
				break;
			case dlreabook.download:
				selectState.selected.forEach((element) => {
					const fin = all?.nodes.findIndex((ele) => ele.id === element.id);
					if (fin && all?.nodes[fin]) all.nodes[fin].isDownloaded = is;
				});
				break;
			default:
				selectState.selected.forEach((element) => {
					const fin = all?.nodes.findIndex((ele) => ele.id === element.id);
					if (fin && all?.nodes[fin]) all.nodes[fin].isRead = is;
				});
				break;
		}
	}
	let update = $derived.by(() => {
		return OTT([page], () => {
			return queryState({
				client,
				query: updates,
				variables: { offset: page }
			});
		});
	});
	$effect(() => {
		OTT([update.value], updateall);
	});
	let intersecting: SvelteSet<number> = $state(new SvelteSet());
</script>

{#snippet mangaText(updat: NonNullable<typeof all>['nodes'][0], absolute = true)}
	<div
		class={absolute
			? 'variant-glass absolute bottom-0 left-0 right-0 rounded-b-olg'
			: 'variant-glass-surface rounded-b-lg'}
	>
		<div class="line-clamp-1 h-6 px-2 text-center" title={updat.manga.title}>
			{updat.manga.title}
		</div>
		<div class="line-clamp-1 h-6 px-2 text-center" title={updat.name}>
			{updat.name}
		</div>
		<div
			class="line-clamp-1 h-6 px-2 text-center"
			title={new Date(parseInt(updat.fetchedAt) * 1000).toLocaleString()}
		>
			{formatDate(new Date(parseInt(updat.fetchedAt) * 1000))}
		</div>
	</div>
{/snippet}

{#if !all && update.value.fetching}
	<div class="grid {gridValues} m-2 gap-2">
		<FakeMangaItem active={true} count={100} lines={3} />
	</div>
{:else if !all && update.value.error}
	<div class="white-space-pre-wrap">
		{JSON.stringify(update.value.error, null, 4)}
	</div>
{:else if all?.nodes}
	<div class="grid {gridValues} m-2 gap-2">
		{#each all.nodes as updat}
			<div
				use:IntersectionObserverAction={{
					root: document.querySelector('#page') ?? undefined,
					rootMargin: `400px 0px 400px 0px`,
					callback: MakeSimpleCallback(intersecting, updat.id)
				}}
				class="aspect-cover w-full"
			>
				{#if intersecting}
					<a
						use:longPress
						onlongPress={() => selectState.selectMode || LongHandler()}
						href="/manga/{updat.manga.id}#{updat.id}"
						onclick={(e) => {
							e.stopPropagation();
							if (e.ctrlKey) return;
							if (selectState.selectMode) {
								e.preventDefault();
								lastSelected = selectState.DoSelect(
									updat,
									e,
									lastSelected,
									all?.nodes
								);
							}
							//  else {
							// 	e.preventDefault();
							// 	goto(`/manga/${updat.manga.id}#${updat.id}`);
							// }
						}}
						class="h-full cursor-pointer hover:opacity-70"
						tabindex="-1"
					>
						<MangaCard
							thumbnailUrl={updat.manga.thumbnailUrl ?? ''}
							title={updat.manga.title}
							class={selectState.selectMode && 'opacity-80'}
							titleA="{updat.isDownloaded ? 'Downloaded' : ''}
	{updat.isRead ? 'Read' : ''}
	{updat.isBookmarked ? 'Bookmarked' : ''}"
							rounded="{gmState.value.Display === display.Compact &&
								'rounded-lg'}
								{gmState.value.Display === display.Comfortable && 'rounded-none rounded-t-lg'}"
						>
							{#if selectState.selectMode}
								<div
									class="bg-base-100/75 absolute bottom-0 left-0 right-0 top-0 cursor-pointer"
								>
									<IconWrapper
										name={selectState.selected.get(updat.id) === undefined
											? 'fluent:checkbox-unchecked-24-filled'
											: 'fluent:checkbox-checked-24-filled'}
										class="absolute right-2 top-2 text-4xl"
									/>
								</div>
							{/if}
							{#if gmState.value.Display === display.Compact}
								{@render mangaText(updat)}
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
						{#if gmState.value.Display === display.Comfortable}
							{@render mangaText(updat, false)}
						{/if}
					</a>
				{/if}
			</div>
		{/each}

		<div
			use:IntersectionObserverAction={{
				root: document.querySelector('#page') ?? undefined,
				rootMargin: `400px 0px 400px 0px`,
				callback: (e) => {
					if (
						!update.value.fetching &&
						all?.pageInfo.hasNextPage &&
						e.isIntersecting
					) {
						page = all?.nodes.length ?? 0;
					}
				}
			}}
		>
			<FakeMangaItem active={all.pageInfo.hasNextPage} count={1} lines={3} />
		</div>
		<FakeMangaItem active={all.pageInfo.hasNextPage} count={10} lines={3} />
	</div>
{/if}
