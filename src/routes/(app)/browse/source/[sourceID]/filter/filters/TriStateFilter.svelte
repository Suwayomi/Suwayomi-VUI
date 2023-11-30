<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import TriStateSlide from '$lib/components/TriStateSlide.svelte';
	import {
		TriState as TriStateenum,
		type FilterChangeInput,
		type SourceQuery
	} from '$lib/generated';
	import type { TriState } from '$lib/util';

	export let filter: Extract<
		SourceQuery['source']['filters'][0],
		{ __typename?: 'TriStateFilter' | undefined }
	>;
	export let filters: FilterChangeInput[];
	export let index: number;

	const tmpp = filters.find((e) => e.position === index)?.triState;
	let state: TriState = TriToonetwothree(tmpp) ?? TriToonetwothree(filter.TriStateDefault);

	function TriToonetwothree(tri: TriStateenum): TriState;
	function TriToonetwothree(tri: TriStateenum | undefined | null): TriState | undefined;
	function TriToonetwothree(tri: unknown): unknown {
		switch (tri) {
			case TriStateenum.Ignore:
				return 0;
			case TriStateenum.Exclude:
				return 2;
			case TriStateenum.Include:
				return 1;
		}
		return undefined;
	}

	function OneTwoThreetoTri(tri: TriState) {
		switch (tri) {
			case 0:
				return TriStateenum.Ignore;
			case 2:
				return TriStateenum.Exclude;
			case 1:
				return TriStateenum.Include;
		}
	}

	$: if (state !== TriToonetwothree(filter.TriStateDefault)) {
		filters = filters.filter((e) => e.position !== index);
		filters.push({
			position: index,
			triState: OneTwoThreetoTri(state)
		});
		filters = filters;
	} else {
		filters = filters.filter((e) => e.position !== index);
	}
</script>

<TriStateSlide
	bind:state
	class="w-full hover:variant-glass-surface p-1 pl-1 my-1"
	labelClass="w-full ml-1"
>
	{filter.name}
</TriStateSlide>
