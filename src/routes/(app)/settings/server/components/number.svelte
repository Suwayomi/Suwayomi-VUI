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
</script>

<label
	class="flex h-16 w-full cursor-pointer items-center text-left hover:variant-glass-surface"
>
	{title}
	<div class="flex flex-1 flex-nowrap items-center justify-end space-x-2 pl-2">
		<input
			class="hidden flex-1 sm:inline sm:max-w-96"
			on:change
			type="range"
			bind:value
			{max}
		/>
		<input
			on:change
			class="input max-w-32 flex-1 sm:max-w-48"
			bind:value
			title="backup Interval"
			type="number"
		/>
	</div>
</label>
