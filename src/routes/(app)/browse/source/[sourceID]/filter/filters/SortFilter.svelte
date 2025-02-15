<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import Slide from '$lib/components/Slide.svelte';
	import { AccordionItem } from '@skeletonlabs/skeleton';

	import type { getSource } from '$lib/gql/Queries';
	import type { ResultOf, VariablesOf } from '$lib/gql/graphql';
	import type { fetchSourceManga } from '$lib/gql/Mutations';
	import { OTT } from '$lib/util.svelte';
	interface Props {
		filter: Extract<
			ResultOf<typeof getSource>['source']['filters'][0],
			{ __typename: 'SortFilter' | undefined }
		>;
		filters: VariablesOf<typeof fetchSourceManga>['filters'];
		index: number;
	}

	let { filter, filters = $bindable(), index }: Props = $props();

	let selected = $state(
		filters?.find((e) => e.position === index)?.sortState?.index ??
			filter.SortDefault?.index ??
			0
	);
	let checked = $state(
		filters?.find((e) => e.position === index)?.sortState?.ascending ??
			filter.SortDefault?.ascending ??
			false
	);

	$effect(() => {
		OTT([filter, selected, checked], () => {
			if (
				selected !== filter.SortDefault?.index ||
				checked !== filter.SortDefault?.ascending
			) {
				filters = filters?.filter((e) => e.position !== index) ?? [];
				filters.push({
					position: index,
					sortState: {
						ascending: checked,
						index: selected
					}
				});
				filters = filters;
			} else {
				filters = filters?.filter((e) => e.position !== index);
			}
		});
	});
</script>

<AccordionItem>
	{#snippet summary()}
		{filter.name}
	{/snippet}
	{#snippet content()}
		<Slide
			bind:checked
			class="my-1 w-full p-1 pl-1 hover:variant-glass-surface"
			labelClass="w-full ml-1"
		>
			Ascending
		</Slide>
		<select bind:value={selected} class="select w-full">
			{#each filter.values as value, index}
				<option value={index}>{value}</option>
			{/each}
		</select>
	{/snippet}
</AccordionItem>
