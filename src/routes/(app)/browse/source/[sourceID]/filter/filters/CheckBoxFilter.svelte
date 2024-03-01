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

	export let filter: Extract<
		ResultOf<typeof getSource>['source']['filters'][0],
		{ __typename?: 'CheckBoxFilter' | undefined }
	>;
	export let filters: VariablesOf<typeof fetchSourceManga>['filters'];
	export let index: number;

	let checked =
		filters?.find((e) => e.position === index)?.checkBoxState ??
		filter.CheckBoxDefault;
	$: if (checked !== filter.CheckBoxDefault) {
		filters = filters?.filter((e) => e.position !== index) ?? [];
		filters.push({
			position: index,
			checkBoxState: checked
		});
		filters = filters;
	} else {
		filters = filters?.filter((e) => e.position !== index);
	}
</script>

<Slide
	bind:checked
	class="w-full hover:variant-glass-surface p-1 pl-1 my-1"
	labelClass="w-full ml-1"
>
	{filter.name}
</Slide>
