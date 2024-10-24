<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import Image from '$lib/components/Image.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import TrackLogin from './TrackLogin.svelte';
	import { onMount } from 'svelte';
	import { getContextClient, queryStore } from '@urql/svelte';
	import { trackers } from '$lib/gql/Queries';
	import { type ResultOf } from '$lib/gql/graphql';
	import { TrackerTypeFragment } from '$lib/gql/Fragments';
	import ModalTemplate from '$lib/components/ModalTemplate.svelte';
	const modalStore = getModalStore();
	const client = getContextClient();
	let Trackers = queryStore({ client, query: trackers });

	onMount(() => {
		window.addEventListener('storage', message_receive);
		return () => {
			window.removeEventListener('storage', message_receive);
		};
	});

	function message_receive(event: StorageEvent) {
		if (event.key === 'VUI3_TRACKER_LOGIN' && event.newValue === 'true') {
			localStorage.setItem('VUI3_TRACKER_LOGIN', 'false');
			client.query(trackers, {}, { requestPolicy: 'network-only' }).toPromise();
			Trackers = queryStore({
				client,
				query: trackers,
				requestPolicy: 'cache-first'
			});
		}
	}

	function clickedTracker(tracker: ResultOf<typeof TrackerTypeFragment>) {
		modalStore.trigger({
			type: 'component',
			backdropClasses: '!p-0',
			component: { ref: TrackLogin, props: { tracker } }
		});
		const tmp = $modalStore[0];
		$modalStore[0] = $modalStore[1];
		$modalStore[1] = tmp;
	}
</script>

{#if $modalStore[0]}
	<ModalTemplate titleText="Tracking">
		<div class="pl-4">
			{#if $Trackers.error}
				<div class="white-space-pre-wrap">
					{JSON.stringify($Trackers.error, null, 4)}
				</div>
			{:else if $Trackers.fetching}
				{#each new Array(4).fill(0) as _}
					<div class="flex w-full p-1 pl-4 text-left">
						<div
							class="placeholder mr-1 aspect-square h-full w-1/5 animate-pulse rounded-xl"
						></div>
						<div class="h-full w-full space-y-2">
							<div class="placeholder h-6 w-full animate-pulse"></div>
							<div class="placeholder h-4 w-2/3"></div>
						</div>
					</div>
				{/each}
			{:else if $Trackers.data}
				{#each $Trackers.data.trackers.nodes as tracker}
					<button
						class="block w-full hover:variant-ghost-surface"
						onclick={() => {
							clickedTracker(tracker);
						}}
					>
						<div class="flex w-full p-1 pl-4 text-left">
							<div class="w-1/5 flex-shrink-0 pr-1">
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
								<span class="flex items-center space-x-2 text-sm xl:text-base">
									Logged in: {tracker.isLoggedIn}
								</span>
							</div>
						</div>
					</button>
				{/each}
			{/if}
		</div>
	</ModalTemplate>
{/if}
