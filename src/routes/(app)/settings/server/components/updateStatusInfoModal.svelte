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
	import ModalTemplate from '$lib/components/ModalTemplate.svelte';
	import type { subscriptionStateReturn } from '$lib/util.svelte';

	interface Props {
		update: subscriptionStateReturn<ResultOf<typeof updateStatusChanged>>;
		// OperationResultStore<ResultOf<typeof updateStatusChanged>> &	Pausable;
	}

	let { update }: Props = $props();

	const modalStore = getModalStore();
</script>

{#if $modalStore[0]}
	{@const updateStatusChanged = update.data?.updateStatusChanged}
	<ModalTemplate
		titleText={'Update Info (' +
			(updateStatusChanged?.isRunning ? 'Running)' : 'Complete)')}
	>
		{#if updateStatusChanged}
			<Accordion>
				{#if updateStatusChanged.failedJobs.mangas.totalCount > 0}
					<AccordionItem>
						<!-- <svelte:fragment slot="lead">(icon)</svelte:fragment> -->
						{#snippet summary()}
							Failed Jobs
						{/snippet}
						{#snippet content()}
							<ul>
								{#each updateStatusChanged.failedJobs.mangas.nodes as manga}
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
						{/snippet}
					</AccordionItem>
				{/if}
				{#if updateStatusChanged.runningJobs.mangas.totalCount > 0}
					<AccordionItem>
						<!-- <svelte:fragment slot="lead">(icon)</svelte:fragment> -->
						{#snippet summary()}
							Running Jobs
						{/snippet}
						{#snippet content()}
							<ul>
								{#each updateStatusChanged.runningJobs.mangas.nodes as manga}
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
						{/snippet}
					</AccordionItem>
				{/if}
				{#if updateStatusChanged.completeJobs.mangas.totalCount > 0}
					<AccordionItem>
						<!-- <svelte:fragment slot="lead">(icon)</svelte:fragment> -->
						{#snippet summary()}
							Completed Jobs
						{/snippet}
						{#snippet content()}
							<ul>
								{#each updateStatusChanged.completeJobs.mangas.nodes as manga}
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
						{/snippet}
					</AccordionItem>
				{/if}
				{#if updateStatusChanged.pendingJobs.mangas.totalCount > 0}
					<AccordionItem>
						<!-- <svelte:fragment slot="lead">(icon)</svelte:fragment> -->
						{#snippet summary()}
							Pending Jobs
						{/snippet}
						{#snippet content()}
							<ul>
								{#each updateStatusChanged.pendingJobs.mangas.nodes as manga}
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
						{/snippet}
					</AccordionItem>
				{/if}
				<!-- ... -->
			</Accordion>
		{/if}
	</ModalTemplate>
{/if}
