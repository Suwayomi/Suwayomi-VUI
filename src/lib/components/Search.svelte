<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { queryParam, ssp } from 'sveltekit-search-params';
	import TooltipIconButton from './TooltipIconButton.svelte';

	let inputElement: HTMLInputElement;
	// eslint-disable-next-line no-undef
	let timeoutCancel: NodeJS.Timeout | undefined = undefined;
	const query = queryParam('q', ssp.string(), { pushHistory: false });
	$: searchElementHidden = $query === null || $query === '';
	$: value = $query || '';

	function handelSearch() {
		searchElementHidden = !searchElementHidden;
		if (!searchElementHidden) {
			setTimeout(() => {
				inputElement.focus();
			}, 500);
			return;
		}
		clearTimeout(timeoutCancel);
		$query = '';
		value = '';
	}

	function handelChange() {
		timeoutCancel = setTimeout(() => {
			$query = value;
		}, 100);
	}
	function handelEscapeInput(
		e: KeyboardEvent & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) {
		if (e.key == 'Escape') {
			inputElement.blur();
			handelSearch();
		}
	}
</script>

<div
	class="max-w-[16rem]
			overflow-hidden
			transition-all duration-500 ease-in-out
			{searchElementHidden ? 'max-w-[0rem] opacity-0 sm:max-w-[1rem]' : ''}"
>
	<input
		bind:this={inputElement}
		class="input h-full"
		title="Input (text)"
		type="text"
		placeholder="input text"
		bind:value
		on:change={handelChange}
		on:keydown={handelEscapeInput}
	/>
</div>
<TooltipIconButton
	on:click={handelSearch}
	name="mdi:{searchElementHidden ? 'search' : 'close'}"
	tip="Search"
	tipclass="z-50"
/>
