<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import type { FilterChangeInput, SourceQuery } from '$lib/generated';

	export let filter: Extract<
		SourceQuery['source']['filters'][0],
		{ __typename?: 'TextFilter' | undefined }
	>;
	export let filters: FilterChangeInput[];
	export let index: number;

	let text = filters.find((e) => e.position === index)?.textState ?? filter.TextDefault;

	$: if (text !== filter.TextDefault) {
		filters = filters.filter((e) => e.position !== index);
		filters.push({
			position: index,
			textState: text
		});
		filters = filters;
	} else {
		filters = filters.filter((e) => e.position !== index);
	}
</script>

<label>
	<span>{filter.name}</span>
	<input class="input" type="text" bind:value={text} />
</label>
