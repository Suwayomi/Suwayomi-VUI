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
	import { searchTracker, type getManga, trackers } from '$lib/gql/Queries';
	import { Tab, TabGroup, getModalStore } from '@skeletonlabs/skeleton';
	import {
		getContextClient,
		queryStore,
		type OperationResultStore,
		type Pausable,
		mutationStore
	} from '@urql/svelte';
	import { type ResultOf } from '$lib/gql/graphql';
	import IconButton from '$lib/components/IconButton.svelte';

	export let manga: OperationResultStore<ResultOf<typeof getManga>> & Pausable;

	const modalStore = getModalStore();

	let preQuery = $manga.data?.manga?.title ?? '';
	let query = $manga.data?.manga?.title ?? '';
	const client = getContextClient();
	let items: OperationResultStore<ResultOf<typeof searchTracker>> & Pausable;
	$: if (tabSet !== 'Tracking')
		items = queryStore({
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

	$manga.data?.manga?.trackRecords.nodes.forEach((e) => {
		mutationStore({
			client,
			query: fetchTrack,
			variables: { recordId: e.id }
		});
	});

	let tabSet: number | 'Tracking' = 'Tracking';

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
				.mutation(unbindTrack, {
					recordId: same.id
				})
				.toPromise();
			return;
		}
		const id = $manga.data?.manga?.id;
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
					<TabGroup class="[&>.tab-panel]:!outline-none">
						<Tab bind:group={tabSet} name="Tracking" value="Tracking">
							Tracking
						</Tab>
						{#each $Trackers.data.trackers.nodes as tracke}
							{@const tracker = tracke}
							<Tab bind:group={tabSet} name={tracker.name} value={tracker.id}>
								{tracker.name}
							</Tab>
						{/each}
						<!-- Tab Panels --->
						<svelte:fragment slot="panel">
							{#if tabSet === 'Tracking'}
								{@const Records = $manga.data?.manga?.trackRecords.nodes ?? []}
								{@const tracks = $Trackers.data?.trackers.nodes}
								<div class="flex h-72 flex-col space-y-1 overflow-auto p-1">
									{#each Records as RecordItem}
										{@const track = tracks.find(
											(e) => e.id === RecordItem.trackerId
										)}
										<a
											class="flex h-14 rounded-lg hover:variant-glass-surface"
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
											<div class="flex flex-1 flex-col justify-center">
												<div class="line-clamp-2">
													{RecordItem.title}
												</div>
											</div>
											<div class="my-1 mr-1 flex space-x-1">
												<select
													class="input w-auto"
													value={RecordItem.status}
													on:change={(e) =>
														updateStatus(e.currentTarget.value, RecordItem.id)}
												>
													{#each track?.statuses ?? [] as status}
														<option value={status.value}>{status.name}</option>
													{/each}
												</select>
												<select
													class="input"
													value={RecordItem.displayScore}
													on:change={(e) =>
														updateScore(e.currentTarget.value, RecordItem.id)}
												>
													{#each track?.scores ?? [] as score}
														<option value={score}>{score}</option>
													{/each}
												</select>
												<IconButton
													tabindex={-1}
													on:click={(e) => {
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
										</a>
									{:else}
										Not Currently Tracking
									{/each}
								</div>
							{:else}
								{@const isTracked =
									$manga.data?.manga?.trackRecords.nodes?.filter(
										(e) => e.trackerId === tabSet
									)}
								<div class="h-72 overflow-auto">
									{#if $items.error}
										<div class="whitespace-pre-wrap p-4">
											{JSON.stringify($items.error, null, 4)}
										</div>
									{:else if $items.fetching}
										{#each new Array(3).fill(0) as _}
											<span
												class="flex w-full p-1 pl-4 text-left hover:variant-ghost-surface"
											>
												<div class="w-1/5 flex-shrink-0 pr-1">
													<div
														class="placeholder aspect-cover h-full w-full animate-pulse rounded-lg"
													/>
												</div>
												<div class="w-full">
													<div class="placeholder mb-2 h-7 w-full" />
													<div class="text-sm xl:text-base">
														<div class="mb-2 grid w-full grid-cols-2 gap-1">
															<div
																class="placeholder h-4 w-full animate-pulse"
															/>
															<div
																class="placeholder h-4 w-full animate-pulse"
															/>
															<div
																class="placeholder h-4 w-full animate-pulse"
															/>
															<div
																class="placeholder h-4 w-full animate-pulse"
															/>
														</div>
														{#each new Array(3).fill(0) as _}
															<div
																class="placeholder mt-1 line-clamp-3 h-4 w-full animate-pulse"
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
								<!-- <div>
									<div class="h-24 pl-4">
										<div class="mb-2 line-clamp-1 text-lg font-bold">
											Tracking: {ThisTrack ? ThisTrack.title : 'None'}
										</div>
										{#if ThisTrack}
											<div class="flex justify-between pr-4">
												<button
													class="variant-filled-surface btn mb-4"
													on:click={() => trackThis(ThisTrack)}
												>
													Untrack
												</button>
												<a
													target="_blank"
													class="variant-filled-surface btn mb-4"
													href={ThisTrack.remoteUrl}
												>
													Open tracked manga
												</a>
											</div>
										{/if}
									</div>
								</div> -->
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
