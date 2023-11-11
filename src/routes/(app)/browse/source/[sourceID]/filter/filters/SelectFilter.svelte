<script lang="ts">
	import type { FilterChangeInput, SourceQuery } from '$lib/generated';

	export let filter: Extract<
		SourceQuery['source']['filters'][0],
		{ __typename?: 'SelectFilter' | undefined }
	>;
	export let filters: FilterChangeInput[];
	export let index: number;

	let selected = filters.find((e) => e.position === index)?.selectState ?? filter.SelectDefault;

	$: if (selected !== filter.SelectDefault) {
		filters = filters.filter((e) => e.position !== index);
		filters.push({
			position: index,
			selectState: selected
		});
		filters = filters;
	} else {
		filters = filters.filter((e) => e.position !== index);
	}
</script>

<label>
	<span>{filter.name}</span>
	<select bind:value={selected} class="select">
		{#each filter.values as value, index}
			<option value={index}>{value}</option>
		{/each}
	</select>
</label>
