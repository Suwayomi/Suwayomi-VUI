<!--
 Copyright (c) 2024 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->
<script lang="ts">
	interface Props {
		value: number;
		max: number;
		title: string;
		onchange: () => void;
	}

	let {
		value = $bindable(),
		max,
		title,
		onchange = () => {}
	}: Props = $props();
</script>

<label
	class="flex h-16 w-full cursor-pointer items-center text-left hover:variant-glass-surface"
>
	{title}
	<div class="flex flex-1 flex-nowrap items-center justify-end space-x-2 pl-2">
		<input
			class="hidden flex-1 sm:inline sm:max-w-96"
			{onchange}
			type="range"
			bind:value
			{max}
		/>
		<input
			{onchange}
			class="input max-w-32 flex-1 sm:max-w-48"
			bind:value
			title="backup Interval"
			type="number"
		/>
	</div>
</label>
