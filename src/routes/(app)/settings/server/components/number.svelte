<!--
 Copyright (c) 2024 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->
<script lang="ts">
	export let value: number;
	export let max: number;
	export let title: string;
	import { createEventDispatcher } from 'svelte';
	type Event = {
		change: {
			value: number;
			reset: (def: number) => void;
		};
	};
	function reset(def: number) {
		value = def;
	}
	const dispatch = createEventDispatcher<Event>();
</script>

<label class="text-left flex items-center w-full h-16 hover:variant-glass-surface cursor-pointer">
	{title}
	<div class="flex items-center flex-nowrap flex-1 justify-end space-x-2 pl-2">
		<input
			class="sm:max-w-96 flex-1 hidden sm:inline"
			on:change={() => dispatch('change', { value, reset })}
			type="range"
			bind:value
			{max}
		/>
		<input
			on:change={() => dispatch('change', { value, reset })}
			class="input max-w-32 sm:max-w-48 flex-1"
			bind:value
			title="backup Interval"
			type="number"
		/>
	</div>
</label>
