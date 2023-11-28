<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import Slide from '$lib/components/Slide.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { Meta } from '$lib/simpleStores';
	import { MangaUpdates } from '$lib/tracking/mangaUpdates';
	import { getToastStore } from '$lib/components/Toast/stores';
	import Tooltip from '$lib/components/Tooltip.svelte';
	const modalStore = getModalStore();
	const toastStore = getToastStore();

	async function handelLogout() {
		await (await MangaUpdates).logout();
		$Meta.mangaUpdatesTracking.enabled = false;
		$Meta.mangaUpdatesTracking.username = '';
		$Meta.mangaUpdatesTracking.password = '';
	}

	async function test() {
		const fail = `Failed to login: check console for more details`;
		try {
			const tmp = await (await MangaUpdates).login();
			toastStore.trigger({
				message: tmp ?? fail
			});
		} catch (error) {
			toastStore.trigger({
				message: fail,
				background: 'bg-error-500'
			});
		}
	}
</script>

{#if $modalStore[0]}
	<div class="card p-0 w-modal shadow-xl space-y-4 rounded-lg max-h-screen">
		<h1 class="h3 pt-4 pl-4">Tracking</h1>
		<div class="pl-4 border-y border-surface-700">
			<div class="max-h-96 overflow-y-auto grid grid-cols-1 gap-1 pr-4">
				<Tooltip
					class="w-full"
					tip="To make development simple all tracking is client side. Since the mangaUpdates API CORS policy may block the tracking requests you may need to install a CORS browser extension"
				>
					<Slide
						class="w-full outline-0 p-1 hover:variant-glass-surface"
						bind:checked={$Meta.mangaUpdatesTracking.enabled}
					>
						MangaUpdates.com Tracking
					</Slide>
				</Tooltip>
				{#if $Meta.mangaUpdatesTracking?.enabled}
					<div class="pl-4">
						<label class="pl-3 mb-2">
							<span>Username</span>
							<input type="text" bind:value={$Meta.mangaUpdatesTracking.username} class="input" />
						</label>
						<label class="pl-3 mb-2">
							<span>Password</span>
							<input
								type="password"
								bind:value={$Meta.mangaUpdatesTracking.password}
								class="input"
							/>
						</label>
						<div class="flex justify-between px-4 pb-4">
							<button class="btn variant-filled-primary" on:click={test}>Test</button>
							<button class="btn variant-filled-primary" on:click={handelLogout}>logout</button>
						</div>
					</div>
				{/if}
			</div>
		</div>
		<div class="p-4" />
	</div>
{/if}
