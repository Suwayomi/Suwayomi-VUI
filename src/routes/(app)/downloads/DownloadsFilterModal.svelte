<script lang="ts">
	import Slide from '$lib/components/Slide.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { filter, type Filter } from './downloadsStores';

	const modalStore = getModalStore();

	let QUEUED = !$filter.has('QUEUED');
	let DOWNLOADING = !$filter.has('DOWNLOADING');
	let FINISHED = !$filter.has('FINISHED');
	let ERROR = !$filter.has('ERROR');

	function handel(params: boolean, set: Filter) {
		if (!params) {
			$filter.add(set);
			$filter = $filter;
			return;
		}
		$filter.delete(set);
		$filter = $filter;
	}
</script>

{#if $modalStore[0]}
	<div class="card p-4 w-modal shadow-xl space-y-4 rounded-lg">
		<Slide
			class="w-full outline-0"
			on:change={() => {
				handel(QUEUED, 'QUEUED');
			}}
			bind:checked={QUEUED}>Queued</Slide
		>
		<Slide
			class="w-full outline-0"
			on:change={() => {
				handel(DOWNLOADING, 'DOWNLOADING');
			}}
			bind:checked={DOWNLOADING}>Downloading</Slide
		>
		<Slide
			class="w-full outline-0"
			on:change={() => {
				handel(FINISHED, 'FINISHED');
			}}
			bind:checked={FINISHED}>Finished</Slide
		>
		<Slide
			class="w-full outline-0"
			on:change={() => {
				handel(ERROR, 'ERROR');
			}}
			bind:checked={ERROR}>Error</Slide
		>
	</div>
{/if}
