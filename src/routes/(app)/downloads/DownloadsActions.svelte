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
	import { getContextClient } from '@urql/svelte';
	import {
		clearDownloader,
		startDownloader,
		stopDownloader
	} from '$lib/gql/Mutations';
	import { downloadChanged } from '$lib/DownloadChanged.svelte';

	const modalStore = getModalStore();
	const client = getContextClient();
</script>

<div class="h-full">
	<IconButton
		name="mdi:filter"
		onclick={() => {
			modalStore.trigger({
				type: 'component',
				backdropClasses: '!p-0',
				component: { ref: DownloadsFilterModal }
			});
		}}
	/>

	<IconButton
		name="mdi:notification-clear-all"
		onclick={() => {
			client.mutation(clearDownloader, {}).toPromise();
		}}
	/>

	<IconButton
		name="mdi:{downloadChanged.status === 'STARTED' ? 'pause' : 'play'}"
		onclick={() => {
			if (downloadChanged.status === 'STARTED') {
				client.mutation(stopDownloader, {}).toPromise();
				return;
			}
			client.mutation(startDownloader, {}).toPromise();
		}}
	/>
</div>
