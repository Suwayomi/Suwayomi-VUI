<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import TriStateSlide from '$lib/components/TriStateSlide.svelte';
	import type { TriState } from '$lib/util';
	import type { getSource } from '$lib/gql/Queries';
	import type { ResultOf, VariablesOf } from 'gql.tada';
	import type { fetchSourceManga } from '$lib/gql/Mutations';
	export let filter: Extract<
		ResultOf<typeof getSource>['source']['filters'][0],
		{ __typename?: 'TriStateFilter' | undefined }
	>;

	export let filters: VariablesOf<typeof fetchSourceManga>['filters'];
	export let index: number;

	const tmpp = filters?.find((e) => e.position === index)?.triState;
	let state: TriState =
		TriToonetwothree(tmpp) ?? TriToonetwothree(filter.TriStateDefault);

	function TriToonetwothree(tri: (typeof filter)['TriStateDefault']): TriState;
	function TriToonetwothree(
		tri: (typeof filter)['TriStateDefault'] | undefined | null
	): TriState | undefined;
	function TriToonetwothree(
		tri: (typeof filter)['TriStateDefault'] | undefined | null
	): unknown {
		switch (tri) {
			case 'IGNORE':
				return 0;
			case 'EXCLUDE':
				return 2;
			case 'INCLUDE':
				return 1;
		}
		return undefined;
	}

	function OneTwoThreetoTri(tri: TriState) {
		switch (tri) {
			case 0:
				return 'IGNORE';
			case 2:
				return 'EXCLUDE';
			case 1:
				return 'INCLUDE';
		}
	}

	$: if (state !== TriToonetwothree(filter.TriStateDefault)) {
		filters = filters?.filter((e) => e.position !== index) ?? [];
		filters.push({
			position: index,
			triState: OneTwoThreetoTri(state)
		});
		filters = filters;
	} else {
		filters = filters?.filter((e) => e.position !== index);
	}
</script>

<TriStateSlide
	bind:state
	class="w-full hover:variant-glass-surface p-1 pl-1 my-1"
	labelClass="w-full ml-1"
>
	{filter.name}
</TriStateSlide>
