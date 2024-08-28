<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { updateSourcePreference } from '$lib/gql/Mutations';
	import type { getSource } from '$lib/gql/Queries';
	import { getContextClient, queryStore } from '@urql/svelte';
	import type { ResultOf } from '$lib/gql/graphql';

	export let pref: Extract<
		ResultOf<typeof getSource>['source']['preferences'][0],
		{ __typename: 'ListPreference' | undefined }
	>;

	export let index: number;
	export let id: string;

	let selected = pref.ListCurrentValue ?? pref.ListDefault;
	const client = getContextClient();
	function handelchange() {
		client
			.mutation(updateSourcePreference, {
				source: id,
				listState: selected,
				position: index
			})
			.toPromise();
	}
</script>

<label class="ml-4 mr-3">
	<div class="flex justify-between">
		<span>{pref.ListTitle}</span>
		{#if pref.summary && pref.summary !== '%s'}
			<span>{pref.summary}</span>
		{/if}
	</div>
	<select bind:value={selected} on:change={handelchange} class="select">
		{#each pref.entryValues as value, index}
			<option {value}> {pref.entries[index]}</option>
		{/each}
	</select>
</label>
