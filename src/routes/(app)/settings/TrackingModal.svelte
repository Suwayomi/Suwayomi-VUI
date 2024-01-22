<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import Image from '$lib/components/Image.svelte';
	import { trackers, type TrackersQuery } from '$lib/generated';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import TrackLogin from './TrackLogin.svelte';
	import { onMount } from 'svelte';
	const modalStore = getModalStore();
	let Trackers = trackers({});

	onMount(() => {
		window.addEventListener('storage', message_receive);
		return () => {
			window.removeEventListener('storage', message_receive);
		};
	});

	function message_receive(event: StorageEvent) {
		if (event.key === 'VUI3_TRACKER_LOGIN' && event.newValue === 'true') {
			localStorage.setItem('VUI3_TRACKER_LOGIN', 'false');
			Trackers = trackers({ fetchPolicy: 'network-only', nextFetchPolicy: 'cache-first' });
		}
	}

	function clickedTracker(tracker: TrackersQuery['trackers']['nodes'][0]) {
		modalStore.trigger({
			type: 'component',
			component: { ref: TrackLogin, props: { tracker } }
		});
		const tmp = $modalStore[0];
		$modalStore[0] = $modalStore[1];
		$modalStore[1] = tmp;
	}
</script>

{#if $modalStore[0]}
	<div class="card p-0 w-modal shadow-xl space-y-4 rounded-lg max-h-screen">
		<h1 class="h3 pt-4 pl-4">Tracking</h1>
		<div class="pl-4 border-y border-surface-700">
			<div class="max-h-96 overflow-y-auto grid grid-cols-1 gap-1 pr-4">
				<div class="pl-4">
					{#if $Trackers.error}
						{JSON.stringify($Trackers.error)}
					{:else if $Trackers.errors}
						{JSON.stringify($Trackers.errors)}
					{:else if $Trackers.loading}
						{#each new Array(4).fill(0) as _}
							<div class="flex pl-4 p-1 w-full text-left">
								<div class="w-1/5 mr-1 h-full placeholder animate-pulse aspect-square rounded-xl" />
								<div class="space-y-2 h-full w-full">
									<div class="placeholder animate-pulse h-6 w-full" />
									<div class="placeholder h-4 w-2/3" />
								</div>
							</div>
						{/each}
					{:else if $Trackers.data}
						{#each $Trackers.data.trackers.nodes as tracker}
							<button
								class="block hover:variant-ghost-surface w-full"
								on:click={() => {
									clickedTracker(tracker);
								}}
							>
								<div class="flex pl-4 p-1 w-full text-left">
									<div class="w-1/5 pr-1 flex-shrink-0">
										<Image
											src={tracker.icon}
											alt={tracker.name}
											width="w-auto"
											height="h-auto"
											class="rounded-lg"
										/>
									</div>
									<div class="w-auto space-y-2">
										<span class="line-clamp-1 text-lg font-bold">
											{tracker.name}
										</span>
										<span class="text-sm xl:text-base flex items-center space-x-2">
											Logged in: {tracker.isLoggedIn}
										</span>
									</div>
								</div>
							</button>
						{/each}
					{/if}
				</div>
			</div>
		</div>
		<div class="p-4" />
	</div>
{/if}
