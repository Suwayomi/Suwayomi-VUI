<!--
 Copyright (c) 2024 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { AppBarData } from '$lib/MountTitleAction';
	import { getContextClient, queryStore } from '@urql/svelte';
	import { History } from '$lib/gql/Queries';
	import { writable } from 'svelte/store';
	import type { ResultOf } from '$lib/gql/graphql';
	import { formatDate, gridValues, HelpDoSelect } from '$lib/util';
	import MangaCard from '$lib/components/MangaCard.svelte';
	import IntersectionObserver from '$lib/components/IntersectionObserver.svelte';
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	import { display, Meta } from '$lib/simpleStores';

	AppBarData('History');
	const client = getContextClient();
	let page = writable(0);
	let all = writable<ResultOf<typeof History>['chapters'] | null>(null);
	$: CurrentHistory = queryStore({
		client,
		query: History,
		variables: { offset: $page }
	});

	$: $CurrentHistory, updateAll();
	function updateAll() {
		if (!$CurrentHistory.data?.chapters) return;
		if (!$all) {
			$all = structuredClone($CurrentHistory.data.chapters);
			return;
		}
		$all.nodes.push(...$CurrentHistory.data.chapters.nodes);
		$all.pageInfo = $CurrentHistory.data.chapters.pageInfo;
	}
</script>

{#if !$all && $CurrentHistory.fetching}
	<div class="grid {gridValues} m-2 gap-2">
		{#each new Array(110) as _}
			<div class="aspect-cover w-full">
				<div
					class="placeholder h-full animate-pulse
						{$Meta.Display === display.Compact && 'rounded-lg'}
						{$Meta.Display === display.Comfortable && 'rounded-none rounded-t-lg'}"
				/>
				{#if $Meta.Display === display.Comfortable}
					<div
						class="placeholder h-12 animate-pulse rounded-none rounded-b-lg px-2 text-center"
					/>
				{/if}
			</div>
		{/each}
	</div>
{:else if !$all && $CurrentHistory.error}
	<div class="white-space-pre-wrap">
		{JSON.stringify($CurrentHistory.error, null, 4)}
	</div>
{:else if $all?.nodes}
	<div class="grid {gridValues} m-2 gap-2">
		{#each $all.nodes as updat}
			<IntersectionObserver
				let:intersecting
				root={document.querySelector('#page') ?? undefined}
				top={400}
				bottom={400}
				class="aspect-cover w-full"
			>
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
							rounded="{$Meta.Display === display.Compact && 'rounded-lg'}
							{$Meta.Display === display.Comfortable && 'rounded-none rounded-t-lg'}"
						>
							{#if $Meta.Display === display.Compact}
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
						{#if $Meta.Display === display.Comfortable}
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
									{new Date(parseInt(updat.lastReadAt) * 1000).toLocaleString()}
								</div>
							</div>
						{/if}
					</a>
				{/if}
			</IntersectionObserver>
		{/each}
		{#if !$CurrentHistory.fetching && $all.pageInfo.hasNextPage}
			<IntersectionObserver
				root={document.querySelector('#page') ?? undefined}
				top={400}
				bottom={400}
				on:intersect={(e) => {
					if (e.detail) $page = $all?.nodes.length ?? 0;
				}}
			/>
		{/if}
		{#if $CurrentHistory.fetching && $all.pageInfo.hasNextPage}
			{#each new Array(10) as _}
				<div class="aspect-cover w-full">
					<div
						class="placeholder h-full animate-pulse
							{$Meta.Display === display.Compact && 'rounded-lg'}
							{$Meta.Display === display.Comfortable && 'rounded-none rounded-t-lg'}"
					/>
					{#if $Meta.Display === display.Comfortable}
						<div
							class="placeholder h-12 animate-pulse rounded-none rounded-b-lg px-2 text-center"
						/>
					{/if}
				</div>
			{/each}
		{/if}
	</div>
{/if}
