<script lang="ts">
	import Slide from '$lib/components/Slide.svelte';
	import type { FilterChangeInput, SourceQuery } from '$lib/generated';
	import { AccordionItem } from '@skeletonlabs/skeleton';

	export let filter: Extract<
		SourceQuery['source']['filters'][0],
		{ __typename?: 'SortFilter' | undefined }
	>;
	export let filters: FilterChangeInput[];
	export let index: number;

	let selected =
		filters.find((e) => e.position === index)?.sortState?.index ?? filter.SortDefault?.index ?? 0;
	let checked =
		filters.find((e) => e.position === index)?.sortState?.ascending ??
		filter.SortDefault?.ascending ??
		false;

	$: if (selected !== filter.SortDefault?.index || checked !== filter.SortDefault?.ascending) {
		filters = filters.filter((e) => e.position !== index);
		filters.push({
			position: index,
			sortState: {
				ascending: checked,
				index: selected
			}
		});
		filters = filters;
	} else {
		filters = filters.filter((e) => e.position !== index);
	}
</script>

<AccordionItem>
	<svelte:fragment slot="summary">{filter.name}</svelte:fragment>
	<svelte:fragment slot="content">
		<Slide
			bind:checked
			class="w-full hover:variant-glass-surface p-1 pl-1 my-1"
			labelclass="w-full ml-1"
		>
			Ascending
		</Slide>
		<select bind:value={selected} class="select w-full">
			{#each filter.values as value, index}
				<option value={index}>{value}</option>
			{/each}
		</select>
	</svelte:fragment>
</AccordionItem>
