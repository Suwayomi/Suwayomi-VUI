<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import IconButton from '$lib/components/IconButton.svelte';
	import Image from '$lib/components/Image.svelte';
	import IntersectionObserver from '$lib/components/IntersectionObserver.svelte';
	import { AppBarData } from '$lib/MountTitleAction';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import DownloadsActions from './DownloadsActions.svelte';
	import { filter } from './downloadsStores';
	import { getContextClient, subscriptionStore } from '@urql/svelte';
	import { downloadChanged } from '$lib/gql/Subscriptions';
	import type { ResultOf } from '$lib/gql/graphql';
	import { dequeueChapterDownloads } from '$lib/gql/Mutations';
	const client = getContextClient();

	let downloads = subscriptionStore({
		client,
		query: downloadChanged
	});

	AppBarData('Downloads', {
		component: DownloadsActions,
		props: { downloads }
	});

	type DLS = ResultOf<typeof downloadChanged>['downloadChanged']['queue'][0];

	function handelclick(e: MouseEvent, dls: DLS): void {
		e.preventDefault();
		e.stopPropagation();
		client
			.mutation(dequeueChapterDownloads, { ids: [dls.chapter.id] })
			.toPromise();
	}

	$: filteredQueue = $downloads?.data?.downloadChanged.queue.filter(
		(dls) => !$filter.has(dls.state)
	);
</script>

{#if $downloads.error}
	<div class="white-space-pre-wrap">
		{JSON.stringify($downloads.error, null, 4)}
	</div>
{:else if !$downloads.data}
	{#each new Array(15) as _}
		<div class="h-28">
			<div
				class="flex h-full flex-nowrap items-center px-4 hover:variant-glass-surface"
			>
				<div class="mr-2 aspect-cover h-full py-1">
					<div
						class="placeholder aspect-cover h-full w-auto animate-pulse rounded-lg"
					/>
				</div>
				<div class="w-full py-4">
					<div class="placeholder mb-1 max-w-xs animate-pulse" />
					<div class="placeholder mb-1 max-w-sm animate-pulse" />
					<div class="flex max-w-3xl items-center">
						<div class="placeholder mr-2 w-10 animate-pulse" />
						<div class="placeholder h-2 w-full animate-pulse" />
					</div>
				</div>
				<div class="h-full py-4">
					<div class="aspect-square h-full w-auto p-4">
						<div class="placeholder h-full w-full animate-pulse" />
					</div>
				</div>
			</div>
		</div>
	{/each}
{:else if filteredQueue}
	{#each filteredQueue as dls (dls.chapter.id)}
		<IntersectionObserver
			let:intersecting
			root={document.querySelector('#page') ?? undefined}
			top={400}
			bottom={400}
			class="h-28"
		>
			{#if intersecting}
				<a
					href="/manga/{dls.manga.id}"
					class="flex h-full flex-nowrap items-center px-4 hover:variant-glass-surface"
				>
					<div class="mr-2 aspect-cover h-full py-1">
						<Image
							src={dls.manga.thumbnailUrl}
							class="rounded-lg"
							height="h-full"
							width="w-auto"
							aspect="aspect-cover"
						/>
					</div>
					<div class="w-full py-4">
						<div class="text-xl">
							{dls.manga.title}
						</div>
						<div>
							{dls.chapter.name}, state: {dls.state[0] +
								dls.state.slice(1, dls.state.length).toLowerCase()}
						</div>
						<div class="flex max-w-3xl items-center">
							<span class="flex-none pr-1"
								>{Math.round(dls.progress * 1000) / 10}%</span
							>
							<ProgressBar
								meter="bg-primary-500"
								track="bg-primary-500/30"
								max={1}
								value={dls.progress}
							/>
						</div>
					</div>
					<div class="h-full py-4">
						<IconButton
							on:click={(e) => handelclick(e, dls)}
							name="mdi:delete"
							hover="hover:variant-ghost-primary"
							class="rounded-full p-1"
							height="h-full"
						/>
					</div>
				</a>
			{/if}
		</IntersectionObserver>
	{:else}
		there are no downloads in queue matching filters
	{/each}
{/if}
