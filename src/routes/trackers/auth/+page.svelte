<!--
 Copyright (c) 2024 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { loginTrackerOAuth } from '$lib/gql/Mutations';
	import { getContextClient } from '@urql/svelte';

	const client = getContextClient();

	async function login() {
		const url = new URL(window.location.href);
		const state: { trackerId: number } = JSON.parse(
			url.searchParams.get('state') ?? '{}'
		);
		await client
			.mutation(loginTrackerOAuth, {
				callbackUrl: url.href,
				trackerId: state.trackerId
			})
			.toPromise();
		localStorage.setItem('VUI3_TRACKER_LOGIN', 'true');
		window.close();
	}
	login();
</script>
