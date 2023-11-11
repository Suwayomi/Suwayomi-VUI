<script lang="ts">
	import { queryParam, ssp } from 'sveltekit-search-params';
	import TooltipIconButton from './TooltipIconButton.svelte';

	let inputElement: HTMLInputElement;
	// eslint-disable-next-line no-undef
	let timeoutCancel: NodeJS.Timeout | undefined = undefined;
	const query = queryParam('q', ssp.string());
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

	function handelchange() {
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
	class="overflow-hidden
			max-w-[16rem]
			transition-all duration-500 ease-in-out
			{searchElementHidden ? 'max-w-[0rem] sm:max-w-[1rem] opacity-0' : ''}"
>
	<input
		bind:this={inputElement}
		class="input h-full"
		title="Input (text)"
		type="text"
		placeholder="input text"
		bind:value
		on:change={handelchange}
		on:keydown={handelEscapeInput}
	/>
</div>
<TooltipIconButton
	on:click={handelSearch}
	name="mdi:{searchElementHidden ? 'search' : 'close'}"
	tip="Search"
	tipclass="z-50"
/>
