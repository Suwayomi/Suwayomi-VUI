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
	import {
		dequeueChapterDownloads,
		downloadChanged,
		type DownloadChangedSubscription
	} from '$lib/generated';
	import { AppBarData } from '$lib/MountTitleAction';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import DownloadsActions from './DownloadsActions.svelte';
	import { filter } from './downloadsStores';

	let downloads = downloadChanged({
		fetchPolicy: 'network-only'
	});
	AppBarData('Downloads', { component: DownloadsActions, props: { downloads } });

	type DLS = DownloadChangedSubscription['downloadChanged']['queue'][0];

	function handelclick(e: MouseEvent, dls: DLS): void {
		e.preventDefault();
		e.stopPropagation();
		dequeueChapterDownloads({ variables: { ids: dls.chapter.id } });
	}

	$: filteredQueue = $downloads?.data?.downloadChanged.queue.filter(
		(dls) => !$filter.has(dls.state)
	);
</script>

{#if !$downloads}
	{#each new Array(15) as _}
		<div class="h-28">
			<div class="hover:variant-glass-surface px-4 h-full flex flex-nowrap items-center">
				<div class="py-1 h-full aspect-cover mr-2">
					<div class="placeholder animate-pulse aspect-cover h-full w-auto rounded-lg" />
				</div>
				<div class="w-full py-4">
					<div class="placeholder animate-pulse max-w-xs mb-1" />
					<div class="placeholder animate-pulse max-w-sm mb-1" />
					<div class="flex max-w-3xl items-center">
						<div class="placeholder animate-pulse w-10 mr-2" />
						<div class="placeholder animate-pulse h-2 w-full" />
					</div>
				</div>
				<div class="h-full py-4">
					<div class="w-auto h-full aspect-square p-4">
						<div class="placeholder animate-pulse h-full w-full" />
					</div>
				</div>
			</div>
		</div>
	{/each}
{:else if $downloads.errors}
	{JSON.stringify($downloads.errors)}
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
					href="manga/{dls.manga.id}"
					class="hover:variant-glass-surface px-4 h-full flex flex-nowrap items-center"
				>
					<div class="py-1 h-full aspect-cover mr-2">
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
						<div class="max-w-3xl flex items-center">
							<span class="flex-none pr-1">{Math.round(dls.progress * 1000) / 10}%</span>
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
		there are no downloads happening
	{/each}
{/if}
