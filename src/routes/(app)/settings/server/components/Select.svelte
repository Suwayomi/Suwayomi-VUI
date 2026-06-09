<!--
 Copyright (c) 2024 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->
<script lang="ts">
	type SelectOption = string | { value: string; label: string };

	interface Props {
		value: string;
		title: string;
		options: Array<SelectOption>;
		onchange: () => void;
	}

	let {
		value = $bindable(),
		title,
		options,
		onchange = () => {}
	}: Props = $props();

	function optionValue(opt: SelectOption): string {
		return typeof opt === 'string' ? opt : opt.value;
	}

	function optionLabel(opt: SelectOption): string {
		return typeof opt === 'string' ? opt.toLocaleLowerCase() : opt.label;
	}
</script>

<label
	class="flex h-16 w-full cursor-pointer items-center text-left hover:variant-glass-surface"
>
	{title}
	<div class="flex flex-1 flex-nowrap items-center justify-end space-x-2">
		<select class="input max-w-32 sm:max-w-[36.5rem]" bind:value {onchange}>
			{#each options as option}
				<option value={optionValue(option)}>{optionLabel(option)}</option>
			{/each}
		</select>
	</div>
</label>
