<!--
 Copyright (c) 2024 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->
<script lang="ts">
	import { loginTrackerCredentials, logoutTracker, type TrackersQuery } from '$lib/generated';
	import type { ApolloQueryResult } from '@apollo/client';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { Readable } from 'svelte/store';

	const modalStore = getModalStore();
	export let tracker: TrackersQuery['trackers']['nodes'][0];

	async function logout() {
		await logoutTracker({ variables: { trackerId: tracker.id } });
	}
	const urlAdon = JSON.stringify({
		redirectUrl: `${window.location.origin}/trackers/auth`,
		trackerId: tracker.id,
		client: 'VUI3'
	});

	let username = '';
	let password = '';

	async function login() {
		await loginTrackerCredentials({
			variables: {
				username,
				password,
				trackerId: tracker.id
			}
		});
		modalStore.close();
	}
</script>

{#if $modalStore[0]}
	<div class="card p-0 w-modal shadow-xl space-y-4 rounded-lg py-4">
		<span class="h3 font-bold border-b border-surface-700 block pl-4">
			{tracker.name} Login
		</span>
		{#if tracker.isLoggedIn}
			<button
				class="hover:variant-ghost-surface w-full text-center block text-xl p-2 font-semibold"
				on:click={() => {
					logout();
					modalStore.close();
				}}>Logout</button
			>
		{:else if tracker.authUrl}
			<a
				class="hover:variant-ghost-surface w-full text-center block text-xl p-2 font-semibold"
				target="_blank"
				href={`${tracker.authUrl}&state=${urlAdon}`}
				on:click={modalStore.close}
			>
				Login
			</a>
		{:else}
			<div class="space-y-2 px-4">
				<input class="input" title="Username" type="text" bind:value={username} />
				<input class="input" title="Password" type="password" bind:value={password} />
				<button class="btn variant-filled-primary float-right" on:click={login}> Login </button>
			</div>
		{/if}
	</div>
{/if}
