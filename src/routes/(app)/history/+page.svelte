<!--
 Copyright (c) 2024 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { actionState } from '$lib/MountTitleAction.svelte';
	import { getContextClient } from '@urql/svelte';
	import { History } from '$lib/gql/Queries';
	import type { ResultOf } from '$lib/gql/graphql';
	import { formatDate, gridValues, OTT, queryState } from '$lib/util.svelte';
	import ImageCard from '$lib/components/ImageCard.svelte';
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	import { display, gmState } from '$lib/simpleStores.svelte';
	import {
		IntersectionObserverAction,
		MakeSimpleCallback
	} from '$lib/actions/IntersectionObserver.svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import FakeMangaItem from '$lib/components/FakeMangaItem.svelte';

	actionState.AppBarData('History');
	const client = getContextClient();
	let page = $state(0);
	let all: ResultOf<typeof History>['chapters'] | null = $state(null);

	function updateAll() {
		OTT([CurrentHistory.value], () => {
			if (!CurrentHistory.value.data?.chapters) return;
			if (!all) {
				all = $state.snapshot(CurrentHistory.value.data.chapters);
				return;
			}
			// this check is nessessary bacuse the data prefetch on the manga link causes this to be triggered again with the same data
			if (
				all.nodes[page]?.id === CurrentHistory.value.data?.chapters.nodes[0].id
			)
				return;

			all.nodes.push(...CurrentHistory.value.data.chapters.nodes);
			all.pageInfo = CurrentHistory.value.data.chapters.pageInfo;
		});
	}
	let CurrentHistory = $derived.by(() => {
		return OTT([page], () =>
			queryState({
				client,
				query: History,
				variables: { offset: page }
			})
		);
	});
	$effect(updateAll);
	let intersecting: SvelteSet<number> = $state(new SvelteSet());
</script>

{#snippet mangaText(updat: NonNullable<typeof all>['nodes'][0], absolute=true)}
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
			title={new Date(parseInt(updat.lastReadAt) * 1000).toLocaleString()}
		>
			{formatDate(new Date(parseInt(updat.lastReadAt) * 1000))}
		</div>
	</div>
{/snippet}

{#if !all && CurrentHistory.value.fetching}
	<div class="grid {gridValues} m-2 gap-2">
		<FakeMangaItem active={true} count={100} lines={3} />
	</div>
{:else if !all && CurrentHistory.value.error}
	<div class="white-space-pre-wrap">
		{JSON.stringify(CurrentHistory.value.error, null, 4)}
	</div>
{:else if all?.nodes}
	<div class="grid {gridValues} m-2 gap-2">
		{#each all.nodes as updat (updat.id + updat.lastReadAt)}
			<div
				use:IntersectionObserverAction={{
					root: document.querySelector('#page') ?? undefined,
					rootMargin: `400px 0px 400px 0px`,
					callback: MakeSimpleCallback(intersecting, updat.id)
				}}
				class="aspect-cover"
			>
				{#if intersecting.has(updat.id)}
					<a
						href="/manga/{updat.manga.id}#{updat.id}"
						class="h-full cursor-pointer hover:opacity-70"
						tabindex="-1"
					>
						<ImageCard
							thumbnailUrl={updat.manga.thumbnailUrl ?? ''}
							title={updat.manga.title}
							titleA="{updat.isDownloaded ? 'Downloaded' : ''}
{updat.isBookmarked ? 'Bookmarked' : ''}"
							rounded="
							{gmState.value.Display === display.Compact && 'rounded-lg'}
							{gmState.value.Display === display.Comfortable && 'rounded-none rounded-t-lg'}"
						>
							{#if gmState.value.Display === display.Compact}
								{@render mangaText(updat)}
							{/if}
							<div class="absolute left-2 top-2 flex h-8">
								{#if updat.isDownloaded}
									<IconWrapper class="h-full w-full" name="mdi:download" />
								{/if}
								{#if updat.isBookmarked}
									<IconWrapper class="h-full w-full" name="mdi:bookmark" />
								{/if}
							</div>
						</ImageCard>
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
						e.isIntersecting &&
						all?.pageInfo.hasNextPage &&
						!CurrentHistory.value.fetching
					) {
						page = all.nodes.length;
					}
				}
			}}
		>
			<FakeMangaItem active={all.pageInfo.hasNextPage} count={1} lines={3} />
		</div>

		<FakeMangaItem active={all.pageInfo.hasNextPage} count={10} lines={3} />
	</div>
{/if}
