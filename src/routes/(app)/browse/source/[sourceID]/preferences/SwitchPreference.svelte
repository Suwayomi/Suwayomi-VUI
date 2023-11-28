<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import Slide from '$lib/components/Slide.svelte';
	import { updateSourcePreference, type SourceQuery } from '$lib/generated';

	export let pref: Extract<
		SourceQuery['source']['preferences'][0],
		{ __typename?: 'SwitchPreference' | undefined }
	>;
	export let index: number;
	export let id: string;

	let checked = pref.SwitchCurrentValue ?? pref.SwitchDefault;

	function handelcheck(state: CustomEvent<boolean>) {
		updateSourcePreference({
			variables: {
				source: id,
				switchState: state.detail,
				position: index
			}
		});
	}
</script>

<Slide
	on:changee={handelcheck}
	{checked}
	class="w-full hover:variant-glass-surface py-1 px-3 my-1"
	labelclass="w-full ml-1"
>
	<div class="flex flex-col">
		<div>
			{pref.SwitchTitle}
		</div>
		<div class="text-sm text-surface-500">
			{pref.summary}
		</div>
	</div>
</Slide>
