<!--
 Copyright (c) 2024 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->
<script lang="ts">
	import Image from '$lib/components/Image.svelte';
	import type { updateStatusChanged } from '$lib/gql/Subscriptions';
	import {
		Accordion,
		AccordionItem,
		getModalStore
	} from '@skeletonlabs/skeleton';
	import type { OperationResultStore, Pausable } from '@urql/svelte';
	import type { ResultOf } from 'gql.tada';

	export let update: OperationResultStore<
		ResultOf<typeof updateStatusChanged>
	> &
		Pausable;

	const modalStore = getModalStore();
</script>

{#if $modalStore[0] && $update.data?.updateStatusChanged.isRunning}
	<div class="card w-modal max-h-screen space-y-4 rounded-lg p-0 shadow-xl">
		<h1 class="h3 pl-4 pt-4">
			Update Info ({$update.data?.updateStatusChanged.isRunning
				? 'Running'
				: 'Complete'})
		</h1>
		<div class="border-y border-surface-700">
			<div
				class="grid max-h-96 grid-cols-1 gap-1 space-y-1 overflow-y-auto p-1"
			>
				<Accordion>
					{#if $update.data?.updateStatusChanged.failedJobs.mangas.totalCount > 0}
						<AccordionItem>
							<!-- <svelte:fragment slot="lead">(icon)</svelte:fragment> -->
							<svelte:fragment slot="summary">Failed Jobs</svelte:fragment>
							<svelte:fragment slot="content">
								<ul>
									{#each $update.data?.updateStatusChanged.failedJobs.mangas.nodes as manga}
										<a href="/manga/{manga.id}">
											<li
												class="flex h-24 flex-nowrap items-center divide-y-[1px] divide-surface-700 px-4 hover:variant-glass-surface"
											>
												<div class="mr-2 aspect-cover h-full py-1">
													<Image
														src={manga.thumbnailUrl}
														class="rounded-sm"
														height="h-full"
														width="w-auto"
														aspect="aspect-cover"
													/>
												</div>
												{manga.title}
											</li>
										</a>
									{/each}
								</ul>
							</svelte:fragment>
						</AccordionItem>
					{/if}
					{#if $update.data?.updateStatusChanged.runningJobs.mangas.totalCount > 0}
						<AccordionItem>
							<!-- <svelte:fragment slot="lead">(icon)</svelte:fragment> -->
							<svelte:fragment slot="summary">Running Jobs</svelte:fragment>
							<svelte:fragment slot="content">
								<ul>
									{#each $update.data?.updateStatusChanged.runningJobs.mangas.nodes as manga}
										<a href="/manga/{manga.id}">
											<li
												class="flex h-24 flex-nowrap items-center divide-y-[1px] divide-surface-700 px-4 hover:variant-glass-surface"
											>
												<div class="mr-2 aspect-cover h-full py-1">
													<Image
														src={manga.thumbnailUrl}
														class="rounded-sm"
														height="h-full"
														width="w-auto"
														aspect="aspect-cover"
													/>
												</div>
												{manga.title}
											</li>
										</a>
									{/each}
								</ul>
							</svelte:fragment>
						</AccordionItem>
					{/if}
					{#if $update.data?.updateStatusChanged.completeJobs.mangas.totalCount > 0}
						<AccordionItem>
							<!-- <svelte:fragment slot="lead">(icon)</svelte:fragment> -->
							<svelte:fragment slot="summary">Completed Jobs</svelte:fragment>
							<svelte:fragment slot="content">
								<ul>
									{#each $update.data?.updateStatusChanged.completeJobs.mangas.nodes as manga}
										<a href="/manga/{manga.id}">
											<li
												class="flex h-24 flex-nowrap items-center divide-y-[1px] divide-surface-700 px-4 hover:variant-glass-surface"
											>
												<div class="mr-2 aspect-cover h-full py-1">
													<Image
														src={manga.thumbnailUrl}
														class="rounded-sm"
														height="h-full"
														width="w-auto"
														aspect="aspect-cover"
													/>
												</div>
												{manga.title}
											</li>
										</a>
									{/each}
								</ul>
							</svelte:fragment>
						</AccordionItem>
					{/if}
					{#if $update.data?.updateStatusChanged.pendingJobs.mangas.totalCount > 0}
						<AccordionItem>
							<!-- <svelte:fragment slot="lead">(icon)</svelte:fragment> -->
							<svelte:fragment slot="summary">Pending Jobs</svelte:fragment>
							<svelte:fragment slot="content">
								<ul>
									{#each $update.data?.updateStatusChanged.pendingJobs.mangas.nodes as manga}
										<a href="/manga/{manga.id}">
											<li
												class="flex h-24 flex-nowrap items-center divide-y-[1px] divide-surface-700 px-4 hover:variant-glass-surface"
											>
												<div class="mr-2 aspect-cover h-full py-1">
													<Image
														src={manga.thumbnailUrl}
														class="rounded-sm"
														height="h-full"
														width="w-auto"
														aspect="aspect-cover"
													/>
												</div>
												{manga.title}
											</li>
										</a>
									{/each}
								</ul>
							</svelte:fragment>
						</AccordionItem>
					{/if}
					<!-- ... -->
				</Accordion>
			</div>
		</div>
		<div class="p-4" />
	</div>
{/if}
