<!-- 
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import Image from '$lib/components/Image.svelte';
	import { TrackRecordTypeFragment } from '$lib/gql/Fragments';
	import { bindTrack, updateTrack } from '$lib/gql/Mutations';
	import { searchTracker, type getManga, trackers } from '$lib/gql/Queries';
	import { Tab, TabGroup, getModalStore } from '@skeletonlabs/skeleton';
	import {
		getContextClient,
		queryStore,
		type OperationResultStore,
		type Pausable
	} from '@urql/svelte';
	import { type ResultOf } from '$lib/gql/graphql';

	export let manga: OperationResultStore<ResultOf<typeof getManga>> & Pausable;

	const modalStore = getModalStore();

	let preQuery = $manga.data?.manga?.title ?? '';
	let query = $manga.data?.manga?.title ?? '';
	const client = getContextClient();
	$: items = queryStore({
		client,
		query: searchTracker,
		variables: { query, trackerId: tabSet }
	});

	const Trackers = queryStore({
		client,
		query: trackers,
		variables: { isLoggedIn: true },
		requestPolicy: 'network-only'
	});

	let tabSet: number = 0;
	Trackers.subscribe((e) => {
		if (e.data?.trackers?.nodes?.length) {
			tabSet = e.data.trackers.nodes[0].id;
		}
	});

	async function trackThis(
		item:
			| ResultOf<typeof TrackRecordTypeFragment>
			| ResultOf<typeof searchTracker>['searchTracker']['trackSearches'][0]
	) {
		const same = $manga.data?.manga?.trackRecords.nodes.find(
			(e) => e.remoteId === item.remoteId
		);
		if (same) {
			await client
				.mutation(updateTrack, {
					input: {
						recordId: same.id,
						unbind: true
					}
				})
				.toPromise();
			return;
		}
		const id = $manga.data?.manga?.id;
		if (!id) return;
		await client
			.mutation(bindTrack, {
				mangaId: id,
				trackerId: tabSet,
				remoteId: item.remoteId
			})
			.toPromise();
	}
</script>

{#if $modalStore[0]}
	<div class="card p-0 w-modal shadow-xl rounded-lg max-h-screen">
		<h1 class="h3 py-4 pl-4">Tracking</h1>
		<div class="border-t border-surface-700">
			<div class="grid grid-cols-1 gap-1">
				{#if $Trackers.fetching}
					Loading...
				{:else if $Trackers.error}
					<div class="white-space-pre-wrap">
						{JSON.stringify($Trackers.error, null, 4)}
					</div>
				{:else if $Trackers.data?.trackers.nodes.length}
					<div class="px-4 pt-1">
						<input
							type="text"
							class="input"
							bind:value={preQuery}
							on:change={() => (query = preQuery)}
						/>
					</div>
					<TabGroup>
						{#each $Trackers.data.trackers.nodes as tracke}
							{@const tracker = tracke}
							<Tab bind:group={tabSet} name={tracker.name} value={tracker.id}
								>{tracker.name}</Tab
							>
						{/each}
						<!-- Tab Panels --->
						<svelte:fragment slot="panel">
							{@const ThisTrack = $manga.data?.manga?.trackRecords.nodes?.find(
								(e) => e.trackerId === tabSet
							)}
							<div class="overflow-auto h-64">
								{#if $items.error}
									<div class="p-4 whitespace-pre-wrap">
										{JSON.stringify($items.error, null, 4)}
									</div>
								{:else if $items.fetching}
									{#each new Array(3).fill(0) as _}
										<span
											class="flex pl-4 p-1 w-full text-left hover:variant-ghost-surface"
										>
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
														<div
															class="line-clamp-3 placeholder animate-pulse h-4 w-full mt-1"
														/>
													{/each}
												</div>
											</div>
										</span>
									{/each}
								{:else if $items.data}
									{#each $items.data.searchTracker.trackSearches as item (item.trackerId + ' ' + item.remoteId)}
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
