<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import IconButton from '$lib/components/IconButton.svelte';
	import {
		clearDownloader,
		startDownloader,
		stopDownloader,
		type DownloadChangedSubscription
	} from '$lib/generated';
	import type { FetchResult, Observable } from '@apollo/client';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import DownloadsFilterModal from './DownloadsFilterModal.svelte';

	export let downloads: Observable<FetchResult<DownloadChangedSubscription>>;
	const modalStore = getModalStore();
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
			clearDownloader({});
		}}
	/>

	<IconButton
		name="mdi:{$downloads?.data?.downloadChanged.state === 'STARTED' ? 'pause' : 'play'}"
		on:click={() => {
			if ($downloads?.data?.downloadChanged.state === 'STARTED') {
				stopDownloader({});
				return;
			}
			startDownloader({});
		}}
	/>
</div>
