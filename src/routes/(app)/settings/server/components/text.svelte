<!--
 Copyright (c) 2024 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->
<script lang="ts">
	export let title: string;
	export let value: string;
	export let type: string = 'text';
</script>

<label
	class="flex h-16 w-full cursor-pointer items-center text-left hover:variant-glass-surface"
>
	{title}
	<div class="flex flex-1 flex-nowrap items-center justify-end space-x-2">
		{#if type === 'password'}
			<input
				on:change
				class="input max-w-32 sm:max-w-[36.5rem]"
				bind:value
				title="basicAuthPassword"
				type="password"
			/>
		{:else}
			<input
				on:change
				class="input max-w-32 sm:max-w-[36.5rem]"
				bind:value
				title="basicAuthPassword"
				type="text"
			/>
		{/if}
	</div>
</label>
