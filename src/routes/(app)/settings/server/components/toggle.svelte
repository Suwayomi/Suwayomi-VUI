<!--
 Copyright (c) 2024 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->
<script lang="ts">
	// your script goes here
	export let checked: boolean;
	export let title: string;
	import Slide from '$lib/components/Slide.svelte';
	import { createEventDispatcher } from 'svelte';
	type Event = {
		change: void;
	};
	const dispatch = createEventDispatcher<Event>();
</script>

<button
	on:click={() => {
		checked = !checked;
		dispatch('change');
	}}
	class=" text-left flex items-center w-full h-16 hover:variant-glass-surface cursor-pointer"
>
	<div class="w-full">{title}</div>
	<Slide
		{checked}
		class=" focus:outline-0 p-1 pl-2 hover:variant-glass-surface pointer-events-none"
	/>
</button>
