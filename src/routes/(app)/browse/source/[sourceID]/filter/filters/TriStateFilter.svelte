<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import type { TriState } from '$lib/util.svelte';
	import type { getSource } from '$lib/gql/Queries';
	import type { ResultOf, VariablesOf } from '$lib/gql/graphql';
	import type { fetchSourceManga } from '$lib/gql/Mutations';
	import { untrack } from 'svelte';
	import ThreeStateSwitchCustom from '$lib/components/ThreeStateSwitchCustom.svelte';

	interface Props {
		filter: Extract<
			ResultOf<typeof getSource>['source']['filters'][0],
			{ __typename: 'TriStateFilter' | undefined }
		>;
		filters: VariablesOf<typeof fetchSourceManga>['filters'];
		index: number;
	}

	let { filter, filters = $bindable(), index }: Props = $props();

	const tmpp = filters?.find((e) => e.position === index)?.triState;
	let state: TriState = $state(
		TriToonetwothree(tmpp) ?? TriToonetwothree(filter.TriStateDefault)
	);

	function TriToonetwothree(tri: (typeof filter)['TriStateDefault']): TriState;
	function TriToonetwothree(
		tri: (typeof filter)['TriStateDefault'] | undefined | null
	): TriState | undefined;
	function TriToonetwothree(
		tri: (typeof filter)['TriStateDefault'] | undefined | null
	): unknown {
		switch (tri) {
			case 'IGNORE':
				return 'intermediate';
			case 'EXCLUDE':
				return 'off';
			case 'INCLUDE':
				return '1on';
		}
		return undefined;
	}

	function OneTwoThreetoTri(tri: TriState) {
		switch (tri) {
			case 'intermediate':
				return 'IGNORE';
			case 'off':
				return 'EXCLUDE';
			case 'on':
				return 'INCLUDE';
		}
	}

	$effect(() => {
		const _ = [state, filter];
		untrack(() => {
			if (state !== TriToonetwothree(filter.TriStateDefault)) {
				filters = filters?.filter((e) => e.position !== index) ?? [];
				filters.push({
					position: index,
					triState: OneTwoThreetoTri(state)
				});
				filters = filters;
			} else {
				filters = filters?.filter((e) => e.position !== index);
			}
		});
	});
</script>

<ThreeStateSwitchCustom
	bind:state
	class="my-1 w-full p-1 pl-1 hover:variant-glass-surface"
	labelClass="w-full ml-1"
>
	{filter.name}
</ThreeStateSwitchCustom>
