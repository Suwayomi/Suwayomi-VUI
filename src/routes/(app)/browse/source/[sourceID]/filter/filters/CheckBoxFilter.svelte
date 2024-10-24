<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import Slide from '$lib/components/Slide.svelte';
	import type { fetchSourceManga } from '$lib/gql/Mutations';
	import type { getSource } from '$lib/gql/Queries';
	import type { ResultOf, VariablesOf } from '$lib/gql/graphql';
	import { untrack } from 'svelte';

	interface Props {
		filter: Extract<
			ResultOf<typeof getSource>['source']['filters'][0],
			{ __typename: 'CheckBoxFilter' | undefined }
		>;
		filters: VariablesOf<typeof fetchSourceManga>['filters'];
		index: number;
	}

	let { filter, filters = $bindable(), index }: Props = $props();

	let checked = $state(
		filters?.find((e) => e.position === index)?.checkBoxState ??
			filter.CheckBoxDefault
	);
	$effect(() => {
		const _ = [checked, filter];
		untrack(() => {
			if (checked !== filter.CheckBoxDefault) {
				filters = filters?.filter((e) => e.position !== index) ?? [];
				filters.push({
					position: index,
					checkBoxState: checked
				});
				filters = filters;
			} else {
				filters = filters?.filter((e) => e.position !== index);
			}
		});
	});
</script>

<Slide
	bind:checked
	class="my-1 w-full p-1 pl-1 hover:variant-glass-surface"
	labelClass="w-full ml-1"
>
	{filter.name}
</Slide>
