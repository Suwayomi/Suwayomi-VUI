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
		type UpdateTrackMutation,
		type Exact,
		GetMangaDoc,
		type BindTrackMutation
	} from '$lib/generated';
	import type {
		ApolloCache,
		ApolloQueryResult,
		FetchResult,
		ObservableQuery
	} from '@apollo/client';
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

	let query = $manga.data?.manga?.title;
	$: items = searchTracker({ variables: { query, trackerId: tabSet } });

	const Trackers = trackers({ variables: { isLoggedIn: true }, fetchPolicy: 'network-only' });
	let tabSet: number = 0;
	Trackers.subscribe((e) => {
		if (e.data?.trackers?.nodes?.length) {
			tabSet = e.data.trackers.nodes[0].id;
		}
	});

	function unbindUpdater(
		cache: ApolloCache<unknown>,
		{ data }: FetchResult<UpdateTrackMutation>,
		id: number
	) {
		if (!data) return;
		const mangaData = structuredClone(
			cache.readQuery<GetMangaQuery>({
				query: GetMangaDoc,
				variables: { id: $manga.data.manga.id }
			})
		);
		if (!mangaData || !mangaData.manga) return;
		const mga = mangaData.manga;
		mga.trackRecords.nodes = mga.trackRecords.nodes.filter((ee) => ee.id !== id);
		cache.writeQuery({
			query: GetMangaDoc,
			variables: { id: $manga.data.manga.id },
			data: { manga: mga }
		});
	}

	function bindTrackUpdater(cache: ApolloCache<unknown>, { data }: FetchResult<BindTrackMutation>) {
		if (!data || !data?.bindTrack?.trackRecord) return;
		const mangaData = structuredClone(
			cache.readQuery<GetMangaQuery>({
				query: GetMangaDoc,
				variables: { id: $manga.data.manga.id }
			})
		);
		if (!mangaData || !mangaData.manga) return;
		const mga = mangaData.manga;
		mga.trackRecords.nodes.push(data.bindTrack.trackRecord);
		cache.writeQuery({
			query: GetMangaDoc,
			variables: { id: $manga.data.manga.id },
			data: { manga: mga }
		});
	}

	async function trackThis(
		item:
			| SearchTrackerQuery['searchTracker']['trackSearches'][0]
			| GetMangaQuery['manga']['trackRecords']['nodes'][0]
	) {
		const same = $manga.data.manga.trackRecords.nodes.find((e) => e.remoteId === item.remoteId);
		if (same) {
			await updateTrack({
				variables: { input: { recordId: same.id, unbind: true } },
				update: (a, b) => unbindUpdater(a, b, same.id)
			});
			return;
		}
		await bindTrack({
			variables: { trackSearchId: item.id, mangaId: $manga.data.manga.id },
			update: bindTrackUpdater
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
						<input type="text" class="input" bind:value={query} />
					</div>
					<TabGroup>
						{#each $Trackers.data.trackers.nodes as tracker}
							<Tab bind:group={tabSet} name={tracker.name} value={tracker.id}>{tracker.name}</Tab>
						{/each}
						<!-- Tab Panels --->
						<svelte:fragment slot="panel">
							{#if $items.error}
								{JSON.stringify($items.error)}
							{:else if $items.errors}
								{JSON.stringify($items.errors)}
							{:else if $items.loading}
								Loading...
							{:else if $items.data}
								{@const ThisTrack = $manga.data.manga.trackRecords.nodes.find(
									(e) => e.trackerId === tabSet
								)}
								<div class="overflow-auto max-h-64">
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
													<div class="grid grid-cols-2 mb-2">
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
								</div>
								<div>
									{#if ThisTrack}
										<div class=" pl-4 line-clamp-1 text-lg font-bold mb-2">
											Tracking: <a target="_blank" href={ThisTrack.remoteUrl} class="anchor">
												{ThisTrack.title}
											</a>
										</div>
										<div class="pr-4 pl-4">
											<button
												class="btn variant-filled-primary mb-4"
												on:click={() => trackThis(ThisTrack)}
											>
												unTrack
											</button>
										</div>
									{/if}
								</div>
							{/if}
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
