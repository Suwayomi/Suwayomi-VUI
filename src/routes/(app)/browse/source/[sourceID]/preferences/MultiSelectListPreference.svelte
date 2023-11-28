<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { updateSourcePreference, type SourceQuery } from '$lib/generated';
	import { popup } from '@skeletonlabs/skeleton';

	export let pref: Extract<
		SourceQuery['source']['preferences'][0],
		{ __typename?: 'MultiSelectListPreference' | undefined }
	>;
	export let index: number;
	export let id: string;

	let selected = pref.MultiSelectListCurrentValue ?? pref.MultiSelectListDefault;
	function handelchange() {
		updateSourcePreference({
			variables: {
				source: id,
				multiSelectState: selected,
				position: index
			}
		});
	}
</script>

<label class="ml-4 mr-3">
	<div>{pref.MultiSelectListTitle}</div>
	<select
		bind:value={selected}
		multiple
		on:change={handelchange}
		class="select"
		use:popup={{
			event: 'focus-blur',
			target: `${id} ${index}`,
			placement: 'bottom'
		}}
	>
		{#each pref.entryValues as value, index}
			<option {value}> {pref.entries[index]}</option>
		{/each}
	</select>
</label>
<div class="card p-4 max-w-sm z-50" data-popup="{id} {index}">
	<p>{pref.summary}</p>
	<div class="card arrow z-50" style="border-radius:0" />
</div>
