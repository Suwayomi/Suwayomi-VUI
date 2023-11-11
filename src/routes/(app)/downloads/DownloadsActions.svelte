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
