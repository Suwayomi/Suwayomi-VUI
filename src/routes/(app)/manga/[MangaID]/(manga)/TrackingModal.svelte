<!-- 
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import Image from '$lib/components/Image.svelte';
	import {
		searchTracker,
		type GetMangaQuery,
		trackers,
		type SearchTrackerQuery,
		updateTrack,
		bindTrack,
		type Exact
	} from '$lib/generated';
	import { bindTrackUpdater, unbindUpdater } from '$lib/util';
	import type { ApolloQueryResult, ObservableQuery } from '@apollo/client';
	import { Tab, TabGroup, getModalStore } from '@skeletonlabs/skeleton';
	import type { Readable } from 'svelte/store';
	export let manga: Readable<
		ApolloQueryResult<GetMangaQuery> & {
			query: ObservableQuery<
				GetMangaQuery,
				Exact<{
					id: number;
				}>
			>;
		}
	>;

	const modalStore = getModalStore();

	let preQuery = $manga.data?.manga?.title;
	let query = $manga.data?.manga?.title;
	$: items = searchTracker({ variables: { query, trackerId: tabSet } });

	const Trackers = trackers({ variables: { isLoggedIn: true }, fetchPolicy: 'network-only' });
	let tabSet: number = 0;
	Trackers.subscribe((e) => {
		if (e.data?.trackers?.nodes?.length) {
			tabSet = e.data.trackers.nodes[0].id;
		}
	});

	async function trackThis(
		item:
			| SearchTrackerQuery['searchTracker']['trackSearches'][0]
			| GetMangaQuery['manga']['trackRecords']['nodes'][0]
	) {
		const same = $manga.data.manga.trackRecords.nodes.find((e) => e.remoteId === item.remoteId);
		if (same) {
			await updateTrack({
				variables: { input: { recordId: same.id, unbind: true } },
				update: (a, b) => unbindUpdater(a, b, $manga.data.manga.id, tabSet)
			});
			return;
		}
		await bindTrack({
			variables: { mangaId: $manga.data.manga.id, trackerId: tabSet, remoteId: item.remoteId },
			update: (a, b) => bindTrackUpdater(a, b, $manga.data.manga.id, tabSet)
		});
	}
</script>

{#if $modalStore[0]}
	<div class="card p-0 w-modal shadow-xl rounded-lg max-h-screen">
		<h1 class="h3 py-4 pl-4">Tracking</h1>
		<div class="border-t border-surface-700">
			<div class="grid grid-cols-1 gap-1">
				{#if $Trackers.loading}
					Loading...
				{:else if $Trackers.error}
					{JSON.stringify($Trackers.error)}
				{:else if $Trackers.errors}
					{JSON.stringify($Trackers.errors)}
				{:else if $Trackers.data.trackers.nodes.length}
					<div class="px-4 pt-1">
						<input
							type="text"
							class="input"
							bind:value={preQuery}
							on:change={() => (query = preQuery)}
						/>
					</div>
					<TabGroup>
						{#each $Trackers.data.trackers.nodes as tracker}
							<Tab bind:group={tabSet} name={tracker.name} value={tracker.id}>{tracker.name}</Tab>
						{/each}
						<!-- Tab Panels --->
						<svelte:fragment slot="panel">
							{@const ThisTrack = $manga.data.manga.trackRecords.nodes.find(
								(e) => e.trackerId === tabSet
							)}
							<div class="overflow-auto h-64">
								{#if $items.error}
									<div class="p-4">
										{JSON.stringify($items.error)}
									</div>
								{:else if $items.errors}
									<div class="p-4">
										{JSON.stringify($items.errors)}
									</div>
								{:else if $items.loading}
									{#each new Array(3).fill(0) as _}
										<span class="flex pl-4 p-1 w-full text-left hover:variant-ghost-surface">
											<div class="w-1/5 pr-1 flex-shrink-0">
												<div
													class="rounded-lg placeholder animate-pulse w-full h-full aspect-cover"
												/>
											</div>
											<div class="w-full">
												<div class="h-7 mb-2 placeholder w-full" />
												<div class="text-sm xl:text-base">
													<div class="grid grid-cols-2 mb-2 w-full gap-1">
														<div class="placeholder animate-pulse h-4 w-full" />
														<div class="placeholder animate-pulse h-4 w-full" />
														<div class="placeholder animate-pulse h-4 w-full" />
														<div class="placeholder animate-pulse h-4 w-full" />
													</div>
													{#each new Array(3).fill(0) as _}
														<div class="line-clamp-3 placeholder animate-pulse h-4 w-full mt-1" />
													{/each}
												</div>
											</div>
										</span>
									{/each}
								{:else if $items.data}
									{#each $items.data.searchTracker.trackSearches as item}
										<a
											href={item.trackingUrl}
											on:click={(e) => {
												e.preventDefault();
												trackThis(item);
											}}
											class="flex pl-4 p-1 w-full text-left hover:variant-ghost-surface"
										>
											<div class="w-1/5 pr-1 flex-shrink-0">
												<Image
													src={item.coverUrl}
													alt={item.title}
													width="w-auto"
													height="h-auto"
													class="rounded-lg"
												/>
											</div>
											<div class="w-auto">
												<span class="line-clamp-1 text-lg font-bold mb-2">
													{item.title}
												</span>
												<div class="text-sm xl:text-base">
													<div class="grid grid-cols-2 mb-2 w-full">
														<div>
															Status: {item.publishingStatus}
														</div>
														<div>
															Type: {item.publishingType}
														</div>
														<div>
															Started: {item.startDate}
														</div>
														<div>
															Chapters: {item.totalChapters}
														</div>
													</div>
													<div class="line-clamp-3" title={item.summary}>
														{item.summary}
													</div>
												</div>
											</div>
										</a>
									{/each}
								{/if}
							</div>
							<div>
								<div class="h-24 pl-4">
									<div class="line-clamp-1 text-lg font-bold mb-2">
										Tracking: {ThisTrack ? ThisTrack.title : 'None'}
									</div>
									{#if ThisTrack}
										<div class=" flex justify-between pr-4">
											<button
												class="btn variant-filled-surface mb-4"
												on:click={() => trackThis(ThisTrack)}
											>
												Untrack
											</button>
											<a
												target="_blank"
												class="btn variant-filled-surface mb-4"
												href={ThisTrack.remoteUrl}
											>
												Open tracked manga
											</a>
										</div>
									{/if}
								</div>
							</div>
						</svelte:fragment>
					</TabGroup>
				{:else}
					<div class="p-4">
						No Trackers Authorized, go to <a
							on:click={modalStore.close}
							href="/settings"
							class="anchor inline">Settings</a
						> to add some.
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
