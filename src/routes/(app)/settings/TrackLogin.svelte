<!--
 Copyright (c) 2024 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->
<script lang="ts">
	import type { TrackerTypeFragment } from '$lib/gql/Fragments';
	import { loginTrackerCredentials, logoutTracker } from '$lib/gql/Mutations';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { getContextClient } from '@urql/svelte';
	import type { ResultOf } from '$lib/gql/graphql';
	import ModalTemplate from '$lib/components/ModalTemplate.svelte';

	const client = getContextClient();
	const modalStore = getModalStore();
	export let tracker: ResultOf<typeof TrackerTypeFragment>;

	async function logout() {
		await client.mutation(logoutTracker, { trackerId: tracker.id });
	}
	const urlAdon = JSON.stringify({
		redirectUrl: `${window.location.origin}/trackers/auth`,
		trackerId: tracker.id,
		client: 'VUI3'
	});

	let username = '';
	let password = '';

	async function login() {
		await client
			.mutation(loginTrackerCredentials, {
				username,
				password,
				trackerId: tracker.id
			})
			.toPromise();
		modalStore.close();
	}
</script>

{#if $modalStore[0]}
	<ModalTemplate title="Login to {tracker.name}">
		{#if tracker.isLoggedIn}
			<button
				class="block w-full p-2 text-center text-xl font-semibold hover:variant-ghost-surface"
				on:click={() => {
					logout();
					modalStore.close();
				}}>Logout</button
			>
		{:else if tracker.authUrl}
			<a
				class="block w-full p-2 text-center text-xl font-semibold hover:variant-ghost-surface"
				target="_blank"
				href={`${tracker.authUrl}&state=${urlAdon}`}
				on:click={modalStore.close}
			>
				Login
			</a>
		{:else}
			<div class="space-y-2 px-4">
				<input
					class="input"
					title="Username"
					type="text"
					bind:value={username}
				/>
				<input
					class="input"
					title="Password"
					type="password"
					bind:value={password}
				/>
				<button class="variant-filled-surface btn float-right" on:click={login}>
					Login
				</button>
			</div>
		{/if}
	</ModalTemplate>
{/if}
