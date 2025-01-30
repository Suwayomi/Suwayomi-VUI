<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import LangFilterButton from '$lib/components/LangFilterButton.svelte';
	import Search from '$lib/components/Search.svelte';
	import { SourceLangFilter as langFilter } from './SourcesStores';
	import TooltipIconButton from '$lib/components/TooltipIconButton.svelte';
	import { goto } from '$app/navigation';

	interface Props {
		langs: Set<string>;
	}

	let { langs }: Props = $props();

	let inputElement: HTMLInputElement | undefined = $state();
	// eslint-disable-next-line no-undef
	let timeoutCancel: ReturnType<typeof setTimeout> | undefined = undefined;
	let searchElementHidden = $state(true);

	let value = $state('');

	function handelSearch() {
		searchElementHidden = !searchElementHidden;
		if (!searchElementHidden) {
			setTimeout(() => {
				inputElement?.focus();
			}, 500);
			return;
		}
		clearTimeout(timeoutCancel);
		value = '';
	}

	function handelChange() {
		timeoutCancel = setTimeout(() => {
			goto(`/browse/globalsearch?q=${value}`);
		}, 100);
	}

	function handelEscapeInput(
		e: KeyboardEvent & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) {
		if (e.key == 'Escape') {
			inputElement?.blur();
			handelSearch();
		}
	}
</script>

<div class="flex h-full">
	<Search />
	<div
		class="max-w-[16rem]
			overflow-hidden
			transition-all duration-500 ease-in-out
			{searchElementHidden ? 'max-w-[0rem] opacity-0 sm:max-w-[0rem]' : ''}"
	>
		<input
			bind:this={inputElement}
			class="input h-full"
			title="Input (text)"
			type="text"
			placeholder="input text"
			bind:value
			onchange={handelChange}
			onkeydown={handelEscapeInput}
		/>
	</div>
	<TooltipIconButton
		onclick={handelSearch}
		name="mdi:{searchElementHidden ? 'earth' : 'close'}"
		tip="Global Search"
		tipclass="z-50"
	/>
	<LangFilterButton {langFilter} {langs} />
</div>
