<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { popup } from '@skeletonlabs/skeleton';
	import { updateSourcePreference } from '$lib/gql/Mutations';
	import type { getSource } from '$lib/gql/Queries';
	import { getContextClient } from '@urql/svelte';
	import type { ResultOf } from '$lib/gql/graphql';

	interface Props {
		pref: Extract<
			ResultOf<typeof getSource>['source']['preferences'][0],
			{ __typename: 'MultiSelectListPreference' | undefined }
		>;
		index: number;
		id: string;
	}

	let { pref, index, id }: Props = $props();

	let selected = $state(
		pref.MultiSelectListCurrentValue ?? pref.MultiSelectListDefault
	);
	const client = getContextClient();
	function handelchange() {
		client
			.mutation(updateSourcePreference, {
				source: id,
				multiSelectState: selected,
				position: index
			})
			.toPromise();
	}
</script>

<label class="ml-4 mr-3">
	<div>{pref.MultiSelectListTitle}</div>
	<select
		bind:value={selected}
		multiple
		onchange={handelchange}
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
<div class="card z-50 max-w-sm p-4" data-popup="{id} {index}">
	<p>{pref.summary}</p>
	<div class="card arrow z-50" style="border-radius:0"></div>
</div>
