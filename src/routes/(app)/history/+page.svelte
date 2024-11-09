<!--
 Copyright (c) 2024 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { AppBarData } from '$lib/MountTitleAction';
	import { getContextClient } from '@urql/svelte';
	import { History } from '$lib/gql/Queries';
	import type { ResultOf } from '$lib/gql/graphql';
	import { formatDate, gridValues, queryState } from '$lib/util.svelte';
	import MangaCard from '$lib/components/MangaCard.svelte';
	import IntersectionObserver from '$lib/components/IntersectionObserver.svelte';
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	import { display, gmState } from '$lib/simpleStores.svelte';

	import { untrack } from 'svelte';

	AppBarData('History');
	const client = getContextClient();
	let page = $state(0);
	let all: ResultOf<typeof History>['chapters'] | null = $state(null);

	function updateAll() {
		const _ = [CurrentHistory.value];
		untrack(() => {
			if (!CurrentHistory.value.data?.chapters) return;
			if (!all) {
				all = $state.snapshot(CurrentHistory.value.data.chapters);
				return;
			}
			all.nodes.push(...CurrentHistory.value.data.chapters.nodes);
			all.pageInfo = CurrentHistory.value.data.chapters.pageInfo;
		});
	}
	let CurrentHistory = $derived.by(() => {
		const _ = [page];
		return untrack(() =>
			queryState({
				client,
				query: History,
				variables: { offset: page }
			})
		);
	});
	$effect(updateAll);
</script>

{#if !all && CurrentHistory.value.fetching}
	<div class="grid {gridValues} m-2 gap-2">
		{#each new Array(110) as _}
			<div class="aspect-cover w-full">
				<div
					class="placeholder h-full animate-pulse
						{gmState.value.Display === display.Compact && 'rounded-lg'}
						{gmState.value.Display === display.Comfortable && 'rounded-none rounded-t-lg'}"
				></div>
				{#if gmState.value.Display === display.Comfortable}
					<div
						class="placeholder h-12 animate-pulse rounded-none rounded-b-lg px-2 text-center"
					></div>
				{/if}
			</div>
		{/each}
	</div>
{:else if !all && CurrentHistory.value.error}
	<div class="white-space-pre-wrap">
		{JSON.stringify(CurrentHistory.value.error, null, 4)}
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
							href="/manga/{updat.manga.id}#{updat.id}"
							class="h-full cursor-pointer hover:opacity-70"
							tabindex="-1"
						>
							<MangaCard
								thumbnailUrl={updat.manga.thumbnailUrl ?? ''}
								title={updat.manga.title}
								titleA="{updat.isDownloaded ? 'Downloaded' : ''}
	{updat.isBookmarked ? 'Bookmarked' : ''}"
								rounded="{gmState.value.Display === display.Compact &&
									'rounded-lg'}
								{gmState.value.Display === display.Comfortable && 'rounded-none rounded-t-lg'}"
							>
								{#if gmState.value.Display === display.Compact}
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
												parseInt(updat.lastReadAt) * 1000
											).toLocaleString()}
										>
											{formatDate(new Date(parseInt(updat.lastReadAt) * 1000))}
										</div>
									</div>
								{/if}
								<div class="absolute left-2 top-2 flex h-8">
									{#if updat.isDownloaded}
										<IconWrapper class="h-full w-full" name="mdi:download" />
									{/if}
									{#if updat.isBookmarked}
										<IconWrapper class="h-full w-full" name="mdi:bookmark" />
									{/if}
								</div>
							</MangaCard>
							{#if gmState.value.Display === display.Comfortable}
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
											parseInt(updat.lastReadAt) * 1000
										).toLocaleString()}
									>
										{new Date(
											parseInt(updat.lastReadAt) * 1000
										).toLocaleString()}
									</div>
								</div>
							{/if}
						</a>
					{/if}
				{/snippet}
			</IntersectionObserver>
		{/each}
		{#if !CurrentHistory.value.fetching && all.pageInfo.hasNextPage}
			<IntersectionObserver
				root={document.querySelector('#page') ?? undefined}
				top={400}
				bottom={400}
				onintersect={(e) => {
					if (e) page = all?.nodes.length ?? 0;
				}}
			/>
		{/if}
		{#if CurrentHistory.value.fetching && all.pageInfo.hasNextPage}
			{#each new Array(10) as _}
				<div class="aspect-cover w-full">
					<div
						class="placeholder h-full animate-pulse
							{gmState.value.Display === display.Compact && 'rounded-lg'}
							{gmState.value.Display === display.Comfortable && 'rounded-none rounded-t-lg'}"
					></div>
					{#if gmState.value.Display === display.Comfortable}
						<div
							class="placeholder h-12 animate-pulse rounded-none rounded-b-lg px-2 text-center"
						></div>
					{/if}
				</div>
			{/each}
		{/if}
	</div>
{/if}
