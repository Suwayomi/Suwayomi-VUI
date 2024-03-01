<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import IconButton from '$lib/components/IconButton.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import DownloadsFilterModal from './DownloadsFilterModal.svelte';
	import type { downloadChanged } from '$lib/gql/Subscriptions';
	import {
		getContextClient,
		type OperationResultStore,
		type Pausable
	} from '@urql/svelte';
	import type { ResultOf } from '$lib/gql/graphql';
	import {
		clearDownloader,
		startDownloader,
		stopDownloader
	} from '$lib/gql/Mutations';

	export let downloads: OperationResultStore<ResultOf<typeof downloadChanged>> &
		Pausable;
	const modalStore = getModalStore();
	const client = getContextClient();
</script>

<div class="h-full">
	<IconButton
		name="mdi:filter"
		on:click={() => {
			modalStore.trigger({
				type: 'component',
				component: { ref: DownloadsFilterModal }
			});
		}}
	/>

	<IconButton
		name="mdi:notification-clear-all"
		on:click={() => {
			client.mutation(clearDownloader, {}).toPromise();
		}}
	/>

	<IconButton
		name="mdi:{$downloads?.data?.downloadChanged.state === 'STARTED'
			? 'pause'
			: 'play'}"
		on:click={() => {
			if ($downloads?.data?.downloadChanged.state === 'STARTED') {
				client.mutation(stopDownloader, {}).toPromise();
				return;
			}
			client.mutation(startDownloader, {}).toPromise();
		}}
	/>
</div>
