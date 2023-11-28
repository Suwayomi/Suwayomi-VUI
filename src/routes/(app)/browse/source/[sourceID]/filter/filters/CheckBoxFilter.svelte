<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import Slide from '$lib/components/Slide.svelte';
	import type { FilterChangeInput, SourceQuery } from '$lib/generated';

	export let filter: Extract<
		SourceQuery['source']['filters'][0],
		{ __typename?: 'CheckBoxFilter' | undefined }
	>;
	export let filters: FilterChangeInput[];
	export let index: number;

	let checked = filters.find((e) => e.position === index)?.checkBoxState ?? filter.CheckBoxDefault;
	$: if (checked !== filter.CheckBoxDefault) {
		filters = filters.filter((e) => e.position !== index);
		filters.push({
			position: index,
			checkBoxState: checked
		});
		filters = filters;
	} else {
		filters = filters.filter((e) => e.position !== index);
	}
</script>

<Slide
	bind:checked
	class="w-full hover:variant-glass-surface p-1 pl-1 my-1"
	labelclass="w-full ml-1"
>
	{filter.name}
</Slide>
