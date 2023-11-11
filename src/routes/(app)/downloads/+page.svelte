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
	import type { FetchResult, Observable } from '@apollo/client';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import DownloadsActions from './DownloadsActions.svelte';
	import { filter } from './downloadsStores';

	let downloads: Observable<FetchResult<DownloadChangedSubscription>> = downloadChanged({
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
	Loading...
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
		there are no downlaods happening
	{/each}
{/if}