<!--
 Copyright (c) 2024 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
-->
<script lang="ts">
	import { ThreeStateSwitch } from 'svelte-skeleton-three-state-switch';
	import type { ComponentProps } from 'svelte';
	import { scale } from 'svelte/transition';

	let {
		state = $bindable(),
		...props
	}: ComponentProps<typeof ThreeStateSwitch> = $props();
</script>

<ThreeStateSwitch {...props} bind:state>
	{#snippet onThumb()}
		<svg
			in:scale={{ delay: 100, duration: 100 }}
			out:scale={{ duration: 100 }}
			aria-hidden="true"
			role="img"
			class="iconify iconify--mdi pointer-events-none absolute top-0 aspect-square h-full w-full text-base-token"
			viewBox="0 0 24 24"
		>
			<path
				fill="currentColor"
				d="M21 7L9 19l-5.5-5.5l1.41-1.41L9 16.17L19.59 5.59z"
			>
			</path>
		</svg>
	{/snippet}
	{#snippet offThumb()}
		<svg
			in:scale={{ delay: 100, duration: 100 }}
			out:scale={{ duration: 100 }}
			aria-hidden="true"
			role="img"
			class="iconify iconify--mdi pointer-events-none absolute top-0 aspect-square h-full w-full text-base-token"
			viewBox="0 0 24 24"
		>
			<path
				fill="currentColor"
				d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
			>
			</path>
		</svg>
	{/snippet}
</ThreeStateSwitch>
