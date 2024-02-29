<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import IconWrapper from './IconWrapper.svelte';
	import { createEventDispatcher } from 'svelte';

	// Types
	import type { CssClasses, SvelteEvent } from '@skeletonlabs/skeleton';
	import type { TriState } from '$lib/util';

	// Event Dispatcher
	type SlideToggleEvent = {
		keyup: SvelteEvent<KeyboardEvent, HTMLDivElement>;
		changeE: boolean;
	};
	const dispatch = createEventDispatcher<SlideToggleEvent>();

	// Props
	/**
	 * Required. Set a unique name for the input.
	 * @type {string}
	 */
	export let name: string = '';
	/** The checked state of the input element. */
	export let checked: boolean | null = null;

	export let triState = true;

	// Props (styles)
	export let size: 'sm' | 'md' | 'lg' = 'md';
	/** Provide classes to set the inactive state background color. */
	export let inactive: CssClasses = 'bg-surface-400 dark:bg-surface-700';
	/** Provide classes to set the active state background color. */
	export let active: CssClasses = 'bg-surface-900 dark:bg-surface-300';
	/** Provide classes to set the active state background color. */
	export let indeterminate: CssClasses = 'bg-surface-500 dark:bg-surface-500';
	/** Provide classes to set the border styles. */
	export let border: CssClasses = '';
	/** Provide classes to set border radius styles. */
	export let rounded: CssClasses = 'rounded-full';
	/** Provide classes for the label div */
	export let labelClass: CssClasses = 'ml-3';

	// Props (a11y)
	/** Provide a semantic label. */
	export let label = '';

	// Base Styles
	const cBase = 'inline-block';
	const cLabel = 'unstyled flex items-center';
	const cTrack = 'flex transition-all duration-[200ms] cursor-pointer';
	const cThumb =
		'w-[50%] h-full scale-[0.8] transition-all duration-[200ms] shadow';

	// Set track size
	let trackSize: string;
	// prettier-ignore
	switch (size) {
		case 'sm': trackSize = 'w-12 h-6'; break;
		case 'lg': trackSize = 'w-20 h-10'; break;
		default: trackSize = 'w-16 h-8';
	}

	// A11y Input Handlers
	function onKeyDown(event: SvelteEvent<KeyboardEvent, HTMLDivElement>) {
		// Enter/Space to toggle element
		if (['Enter', 'Space'].includes(event.code)) {
			event.preventDefault();
			/** @event {{ event }} keyup Fires when the component is focused and key is pressed. */
			dispatch('keyup', event);
			const inputElem = event.currentTarget.firstChild as HTMLLabelElement;
			inputElem.click();
		}
	}

	// Interactive
	let cTrackActive = '';
	$: if (state === 0) {
		cTrackActive = indeterminate;
	} else if (state === 1) {
		cTrackActive = active;
	} else {
		cTrackActive = inactive;
	}

	let cThumbBackground = '';
	$: if (state === 0) {
		cThumbBackground = 'bg-white';
	} else if (state === 1) {
		cThumbBackground = 'bg-white/75';
	} else {
		cThumbBackground = 'bg-white';
	}

	let cThumbPos = '';
	$: if (state === 0) {
		cThumbPos = 'translate-x-[50%]';
	} else if (state === 1) {
		cThumbPos = 'translate-x-full';
	} else {
		cThumbPos = '';
	}
	// Reactive Classes
	$: classesDisabled =
		$$props.disabled === true
			? 'opacity-50'
			: 'hover:brightness-[105%] dark:hover:brightness-110 cursor-pointer';
	$: classesBase = `${cBase} ${rounded} ${classesDisabled} ${$$props.class}`;
	$: classesLabel = `${cLabel} cursor-pointer`;
	$: classesTrack = `${cTrack} ${border} ${rounded} ${trackSize} ${cTrackActive}`;
	$: classesThumb = `${cThumb} ${rounded} ${cThumbBackground} ${cThumbPos}`;

	// Prune $$restProps to avoid overwriting $$props.class
	function prunedRestProps() {
		delete $$restProps.class;
		return $$restProps;
	}

	export let state: TriState = checked === null ? 0 : checked ? 1 : 2;
	export function handelClick() {
		if (triState) {
			switch (state) {
				case 0:
					state = 1;
					break;
				case 1:
					state = 2;
					break;
				case 2:
					state = 0;
					break;
			}
		} else {
			switch (state) {
				case 1:
					state = 2;
					checked = false;
					dispatch('changeE', checked);
					break;
				case 2:
					state = 1;
					checked = true;
					dispatch('changeE', checked);
					break;
			}
		}
	}
</script>

<div
	id={label}
	class="slide-toggle {classesBase} "
	on:keydown={onKeyDown}
	role="switch"
	aria-label={label}
	aria-checked={checked}
	tabindex="0"
>
	<label class="slide-toggle-label {classesLabel}">
		<!-- Hidden Input -->
		<input
			type="checkbox"
			class="slide-toggle-input hidden"
			bind:checked
			{name}
			on:click={handelClick}
			on:keydown
			on:keyup
			on:keypress
			on:mouseover
			on:change
			on:focus
			on:blur
			{...prunedRestProps()}
			disabled={$$props.disabled}
		/>
		<!-- Label -->
		{#if $$slots.default}<div class="slide-toggle-text flex-1 {labelClass}">
				<slot />
			</div>{/if}
		<!-- Slider Track/Thumb -->
		<div
			class="slide-toggle-track {classesTrack}"
			class:cursor-not-allowed={$$props.disabled}
		>
			<div
				class="slide-toggle-thumb text-surface-500 {classesThumb} aspect-square"
				class:cursor-not-allowed={$$props.disabled}
			>
				{#if state === 1}
					<IconWrapper name="mdi:check" class="w-full h-full aspect-square" />
				{:else if state === 2}
					<IconWrapper name="mdi:close" class="w-full h-full aspect-square" />
				{/if}
			</div>
		</div>
	</label>
</div>
