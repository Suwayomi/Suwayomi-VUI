<!-- 
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import Image from '$lib/components/Image.svelte';
	import { TrackRecordTypeFragment } from '$lib/gql/Fragments';
	import {
		bindTrack,
		fetchTrack,
		unbindTrack,
		updateTrack
	} from '$lib/gql/Mutations';
	import { searchTracker, trackers } from '$lib/gql/Queries';
	import { Tab, TabGroup, getModalStore } from '@skeletonlabs/skeleton';
	import { getContextClient, mutationStore } from '@urql/svelte';
	import { type ResultOf } from '$lib/gql/graphql';
	import IconButton from '$lib/components/IconButton.svelte';
	import { manga } from './mangaStores.svelte';
	import { queryState } from '$lib/util.svelte';

	const modalStore = getModalStore();

	let preQuery = $state(manga.value?.data?.manga?.title ?? '');
	let query = $state(manga.value?.data?.manga?.title ?? '');
	const client = getContextClient();

	let items = $derived.by(() => {
		if (tabSet === 'Tracking') return undefined;
		return queryState({
			client,
			query: searchTracker,
			variables: { query, trackerId: tabSet }
		});
	});

	let Trackers = queryState({
		client,
		query: trackers,
		variables: { isLoggedIn: true },
		requestPolicy: 'network-only'
	});

	$effect(() => {
		manga.value?.data?.manga?.trackRecords.nodes.forEach((e) => {
			mutationStore({
				client,
				query: fetchTrack,
				variables: { recordId: e.id }
			});
		});
	});

	let tabSet: number | 'Tracking' = $state('Tracking');

	async function trackThis(
		item:
			| ResultOf<typeof TrackRecordTypeFragment>
			| ResultOf<typeof searchTracker>['searchTracker']['trackSearches'][0]
	) {
		const same = manga.value?.data?.manga?.trackRecords.nodes.find(
			(e) => e.remoteId === item.remoteId
		);
		if (same) {
			await client
				.mutation(unbindTrack, {
					recordId: same.id
				})
				.toPromise();
			return;
		}
		const id = manga.value?.data?.manga?.id;
		if (!id) return;
		if (tabSet === 'Tracking') return;
		await client
			.mutation(bindTrack, {
				mangaId: id,
				trackerId: tabSet,
				remoteId: item.remoteId
			})
			.toPromise();
	}

	async function untrack(id: number) {
		await client.mutation(unbindTrack, {
			recordId: id
		});
	}

	async function updateStatus(value: string, id: number) {
		await client.mutation(updateTrack, {
			input: {
				recordId: id,
				status: parseInt(value)
			}
		});
	}

	async function updateScore(value: string, id: number) {
		await client.mutation(updateTrack, {
			input: {
				recordId: id,
				scoreString: value
			}
		});
	}
</script>

{#if $modalStore[0]}
	<div class="card w-modal max-h-screen rounded-lg p-0 shadow-xl">
		<h1 class="h3 py-4 pl-4">Tracking</h1>
		<div class="border-t border-surface-700">
			<div class="grid grid-cols-1 gap-1">
				{#if Trackers.fetching}
					Loading...
				{:else if Trackers.error}
					<div class="white-space-pre-wrap">
						{JSON.stringify(Trackers.error, null, 4)}
					</div>
				{:else if Trackers.data?.trackers.nodes.length}
					<div class="px-4 pt-1">
						<input
							type="text"
							class="input"
							bind:value={preQuery}
							onchange={() => (query = preQuery)}
						/>
					</div>
					<TabGroup class="[&>.tab-panel]:!outline-none">
						<Tab bind:group={tabSet} name="Tracking" value="Tracking">
							Tracking
						</Tab>
						{#each Trackers.data.trackers.nodes as tracke (tracke.id)}
							{@const tracker = tracke}
							<Tab bind:group={tabSet} name={tracker.name} value={tracker.id}>
								{tracker.name}
							</Tab>
						{/each}
						<!-- Tab Panels --->
						<svelte:fragment slot="panel">
							{#if tabSet === 'Tracking'}
								{@const Records =
									manga.value?.data?.manga?.trackRecords.nodes ?? []}
								{@const tracks = Trackers.data?.trackers.nodes}
								<div class="flex h-72 flex-col space-y-1 overflow-auto p-1">
									{#each Records as RecordItem (RecordItem.id)}
										{@const track = tracks.find(
											(e) => e.id === RecordItem.trackerId
										)}
										<div class="flex h-14 justify-between rounded-lg">
											<a
												class="flex h-14 flex-1 rounded-lg hover:variant-glass-surface"
												href={RecordItem.remoteUrl}
												target="_blank"
											>
												<div class="m-1">
													<Image
														src={track?.icon}
														alt={track?.name}
														width="w-auto"
														height="h-full"
														aspect="aspect-square"
														draggable={false}
														class=""
													/>
												</div>
												<div class="flex flex-col justify-center">
													<div class="line-clamp-2">
														{RecordItem.title}
													</div>
												</div>
											</a>
											<div class="my-1 mr-1 flex space-x-1">
												<select
													class="input w-auto"
													value={RecordItem.status}
													onchange={(e) =>
														updateStatus(e.currentTarget.value, RecordItem.id)}
												>
													{#each track?.statuses ?? [] as status}
														<option value={status.value}>{status.name}</option>
													{/each}
												</select>
												<select
													class="input"
													value={RecordItem.displayScore}
													onchange={(e) =>
														updateScore(e.currentTarget.value, RecordItem.id)}
												>
													{#each track?.scores ?? [] as score}
														<option value={score}>{score}</option>
													{/each}
												</select>
												<IconButton
													tabindex={-1}
													onclick={(e) => {
														e.preventDefault();
														e.stopPropagation();
														untrack(RecordItem.id);
													}}
													name="mdi:delete"
													hover="hover:variant-ghost-primary"
													class="rounded-full"
													height="h-full"
												/>
											</div>
										</div>
									{:else}
										Not Currently Tracking
									{/each}
								</div>
							{:else}
								{@const isTracked =
									manga.value?.data?.manga?.trackRecords.nodes?.filter(
										(e) => e.trackerId === tabSet
									)}
								<div class="h-72 overflow-auto">
									{#if items?.error}
										<div class="whitespace-pre-wrap p-4">
											{JSON.stringify(items.error, null, 4)}
										</div>
									{:else if !items || items?.fetching}
										{#each new Array(3).fill(0) as _}
											<span
												class="flex w-full p-1 pl-4 text-left hover:variant-ghost-surface"
											>
												<div class="w-1/5 flex-shrink-0 pr-1">
													<div
														class="placeholder aspect-cover h-full w-full animate-pulse rounded-lg"
													></div>
												</div>
												<div class="w-full">
													<div class="placeholder mb-2 h-7 w-full"></div>
													<div class="text-sm xl:text-base">
														<div class="mb-2 grid w-full grid-cols-2 gap-1">
															<div
																class="placeholder h-4 w-full animate-pulse"
															></div>
															<div
																class="placeholder h-4 w-full animate-pulse"
															></div>
															<div
																class="placeholder h-4 w-full animate-pulse"
															></div>
															<div
																class="placeholder h-4 w-full animate-pulse"
															></div>
														</div>
														{#each new Array(3).fill(0) as _}
															<div
																class="placeholder mt-1 line-clamp-3 h-4 w-full animate-pulse"
															></div>
														{/each}
													</div>
												</div>
											</span>
										{/each}
									{:else if items.data}
										{#each items.data.searchTracker.trackSearches as item (item.trackerId + ' ' + item.remoteId)}
											<a
												href={item.trackingUrl}
												onclick={(e) => {
													e.preventDefault();
													trackThis(item);
												}}
												class="flex w-full p-1 pl-4 text-left hover:variant-ghost-surface {isTracked?.find(
													(e) => e.remoteId === item.remoteId
												)
													? 'bg-surface-700'
													: ''}"
											>
												<div class="w-1/5 flex-shrink-0 pr-1">
													<Image
														src={item.coverUrl}
														alt={item.title}
														width="w-auto"
														height="h-auto"
														class="rounded-lg"
													/>
												</div>
												<div class="w-auto">
													<span class="mb-2 line-clamp-1 text-lg font-bold">
														{item.title}
													</span>
													<div class="text-sm xl:text-base">
														<div class="mb-2 grid w-full grid-cols-2">
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
							{/if}
						</svelte:fragment>
					</TabGroup>
				{:else}
					<div class="p-4">
						No Trackers Authorized, go to <a
							onclick={modalStore.close}
							href="/settings"
							class="anchor inline">Settings</a
						> to add some.
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
