<!--
 Copyright (c) 2024 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->
<script lang="ts">
	export let value: string;
	export let title: string;
	export let options: Array<string>;
</script>

<label
	class="flex h-16 w-full cursor-pointer items-center text-left hover:variant-glass-surface"
>
	{title}
	<div class="flex flex-1 flex-nowrap items-center justify-end space-x-2">
		<select class="input max-w-32 sm:max-w-[36.5rem]" bind:value on:change>
			{#each options as option}
				<option class="capitalize" value={option}
					>{option.toLocaleLowerCase()}</option
				>
			{/each}
		</select>
	</div>
</label>
