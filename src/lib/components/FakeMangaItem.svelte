<!--
 Copyright (c) 2025 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { display, gmState } from '$lib/simpleStores.svelte';

	type Props = {
		active: boolean;
		count: number;
		lines?: 2 | 3;
	};

	const { active: fetching, count, lines = 2 }: Props = $props();
	function uuidv4() {
		return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
			(
				+c ^
				(crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
			).toString(16)
		);
	}
	const uuid = uuidv4();
</script>

{#if fetching}
	{#each new Array(count) as _, i (i + uuid)}
		<div class="aspect-cover w-full">
			<div
				class="placeholder h-full animate-pulse
{gmState.value.Display === display.Compact && 'rounded-lg'}
{gmState.value.Display === display.Comfortable && 'rounded-none rounded-t-lg'}"
			></div>
			{#if gmState.value.Display === display.Comfortable}
				<div
					class="placeholder {lines === 2
						? 'h-12'
						: 'h-[4.5rem]'} animate-pulse rounded-none rounded-b-lg px-2 text-center"
				></div>
			{/if}
		</div>
	{/each}
{/if}
