<!--
 Copyright (c) 2024 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->
<script lang="ts">
	import Slide from '$lib/components/Slide.svelte';
	interface Props {
		// your script goes here
		checked: boolean;
		title: string;
		onchange: () => void;
	}

	let { checked = $bindable(), title, onchange = () => {} }: Props = $props();
</script>

<button
	onclick={() => {
		checked = !checked;
		onchange();
	}}
	class="flex h-16 w-full cursor-pointer items-center text-left hover:variant-glass-surface"
>
	<div class="w-full">{title}</div>
	<Slide
		{checked}
		class="pointer-events-none p-1 pl-2 hover:variant-glass-surface focus:outline-0"
	/>
</button>
