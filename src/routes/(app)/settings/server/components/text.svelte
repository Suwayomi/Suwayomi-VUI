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

<label class="text-left flex items-center w-full h-16 hover:variant-glass-surface cursor-pointer">
	{title}
	<div class="flex items-center flex-nowrap flex-1 justify-end space-x-2">
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
