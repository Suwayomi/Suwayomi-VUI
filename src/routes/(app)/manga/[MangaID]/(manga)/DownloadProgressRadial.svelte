<script lang="ts">
	import { DownloadState, type DownloadsOnChaptersSubscription } from '$lib/generated';
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	export let download: DownloadsOnChaptersSubscription['downloadChanged']['queue'][0] | undefined;
</script>

{#if download}
	{#if download.state === DownloadState.Downloading}
		<ProgressRadial
			width="w-auto"
			class="h-full aspect-square flex items-center"
			value={Math.round(download.progress * 100)}
			font={150}
		>
			{Math.round(download.progress * 100)}%
		</ProgressRadial>
	{:else if download.state === DownloadState.Queued}
		<div>Queued</div>
	{:else if download.state === DownloadState.Error}
		<div>Error</div>
	{:else if download.state === DownloadState.Finished}
		<div>Finished</div>
	{/if}
{/if}
