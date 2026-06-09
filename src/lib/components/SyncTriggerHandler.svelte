<!--
 Copyright (c) 2024 Contributors to the Suwayomi project

 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->
<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { getContextClient } from '@urql/svelte';
	import {
		subscriptionState,
		showSyncProgressToast,
		closeSyncProgressToast,
		successToast,
		errortoast
	} from '$lib/util.svelte';
	import { syncSettings } from '$lib/simpleStores.svelte';
	import { startSync } from '$lib/gql/Mutations';
	import { syncStatusChangedSub } from '$lib/gql/Subscriptions';

	const READER_PATH_PATTERN = /^\/manga\/\d+\/chapter\//;
	const MIN_TOAST_MS = 800;

	const client = getContextClient();
	const syncStatus = subscriptionState({ client, query: syncStatusChangedSub });

	let syncToastTimer: ReturnType<typeof setTimeout> | null = null;
	let startTriggered = false;

	function isOnReader(): boolean {
		return READER_PATH_PATTERN.test(page.url.pathname);
	}

	function triggerSync(): void {
		if (isOnReader()) return;
		showSyncProgressToast();
		client.mutation(startSync, {}).toPromise();
	}

	// Close loading toast and show result when sync subscription emits SUCCESS/ERROR
	$effect(() => {
		const state = syncStatus.data?.syncStatusChanged?.state;
		if (!state) return;

		if (syncToastTimer) clearTimeout(syncToastTimer);
		syncToastTimer = setTimeout(() => {
			closeSyncProgressToast();
			if (state === 'SUCCESS') {
				if (!isOnReader()) successToast('Sync completed successfully');
			} else if (state === 'ERROR') {
				if (!isOnReader()) errortoast('Sync failed', syncStatus.data?.syncStatusChanged?.errorMessage ?? '');
			}
		}, MIN_TOAST_MS);

		return () => {
			if (syncToastTimer) clearTimeout(syncToastTimer);
		};
	});

	// Fire syncOnWebUIStart exactly once when settings first load with it enabled
	$effect(() => {
		const s = $syncSettings;
		if (!s?.syncYomiEnabled || !s?.syncOnWebUIStart || startTriggered) return;
		startTriggered = true;
		triggerSync();
	});

	// Register visibilitychange listener once — reads current settings at event time
	onMount(() => {
		function handleVisibility(): void {
			if (document.visibilityState !== 'visible') return;
			const s = get(syncSettings);
			if (!s?.syncYomiEnabled || !s?.syncOnWebUIResume) return;
			triggerSync();
		}

		document.addEventListener('visibilitychange', handleVisibility);
		return () => document.removeEventListener('visibilitychange', handleVisibility);
	});
</script>
