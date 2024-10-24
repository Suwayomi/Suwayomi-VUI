<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import IconWrapper from './IconWrapper.svelte';

	// Types
	import type { CssClasses, SvelteEvent } from '@skeletonlabs/skeleton';

	interface Props {
		/**
		 * Required. Set a unique name for the input.
		 * @type {string}
		 */
		name?: string;
		/** The checked state of the input element. */
		checked?: boolean | null;
		// Props (styles)
		size?: 'sm' | 'md' | 'lg';
		/** Provide classes to set the inactive state background color. */
		inactive?: CssClasses;
		/** Provide classes to set the active state background color. */
		active?: CssClasses;
		/** Provide classes to set the border styles. */
		border?: CssClasses;
		/** Provide classes to set border radius styles. */
		rounded?: CssClasses;
		/** Provide classes for the label div */
		labelClass?: CssClasses;
		// Provide a semantic label.
		label?: string;
		children?: import('svelte').Snippet;
		onchange?: (e: boolean) => void;
		[key: string]: unknown;
	}

	let {
		name = '',
		checked = $bindable(null),
		size = 'md',
		inactive = 'bg-surface-300 dark:bg-surface-700',
		active = 'bg-surface-700 dark:bg-surface-300',
		border = '',
		rounded = 'rounded-full',
		labelClass = 'ml-3',
		label = '',
		onchange = () => {},
		children,
		...rest
	}: Props = $props();

	// Base Styles
	const cBase = 'inline-block';
	const cLabel = 'unstyled flex items-center';
	const cTrack = 'flex transition-all duration-[200ms] cursor-pointer';
	const cThumb =
		'w-[50%] h-full scale-[0.8] transition-all duration-[200ms] shadow';

	// Set track size
	let trackSize: string | undefined = $state();
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
			const inputElem = event.currentTarget.firstChild as HTMLLabelElement;
			inputElem.click();
		}
	}

	// Interactive
	let cTrackActive = $state('');
	let cThumbBackground = $state('');
	let cThumbPos = $state('');
	$effect(() => {
		if (checked) {
			cTrackActive = active;
			cThumbBackground = 'bg-white/75';
			cThumbPos = 'translate-x-full';
		} else {
			cTrackActive = inactive;
			cThumbBackground = 'bg-white';
			cThumbPos = '';
		}
	});

	// Reactive Classes
	let classesDisabled = $derived(
		rest.disabled === true
			? 'opacity-50'
			: 'hover:brightness-[105%] dark:hover:brightness-110 cursor-pointer'
	);
	let classesBase = $derived(
		`${cBase} ${rounded} ${classesDisabled} ${rest.class}`
	);
	let classesLabel = $derived(`${cLabel} cursor-pointer`);
	let classesTrack = $derived(
		`${cTrack} ${border} ${rounded} ${trackSize} ${cTrackActive}`
	);
	let classesThumb = $derived(
		`${cThumb} ${rounded} ${cThumbBackground} ${cThumbPos}`
	);

	// Prune $$restProps to avoid overwriting propstmp.class
	function prunedRestProps() {
		const { class: _, ...tmp } = rest;
		return tmp;
	}

	export function handelClick() {
		switch (checked) {
			case true:
				checked = false;
				onchange(checked);
				break;
			case false:
				checked = true;
				onchange(checked);
				break;
		}
	}
</script>

<div
	id={label}
	class="slide-toggle {classesBase} "
	onkeydown={onKeyDown}
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
			onclick={handelClick}
			{...prunedRestProps()}
			disabled={rest.disabled as boolean | undefined | null}
		/>
		<!-- Label -->
		{#if children}<div class="slide-toggle-text flex-1 {labelClass}">
				{@render children?.()}
			</div>{/if}
		<!-- Slider Track/Thumb -->
		<div
			class="slide-toggle-track {classesTrack}"
			class:cursor-not-allowed={rest.disabled}
		>
			<div
				class="slide-toggle-thumb text-surface-500 {classesThumb} aspect-square"
				class:cursor-not-allowed={rest.disabled}
			>
				{#if checked}
					<IconWrapper name="mdi:check" class="aspect-square h-full w-full" />
				{:else}
					<IconWrapper name="mdi:close" class="aspect-square h-full w-full" />
				{/if}
			</div>
		</div>
	</label>
</div>
