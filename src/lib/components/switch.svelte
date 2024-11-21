<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import IconWrapper from './IconWrapper.svelte';

	// Types
	import type { CssClasses } from '@skeletonlabs/skeleton';

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
		class?: CssClasses;
		// Provide a semantic label.
		label?: string;
		children?: import('svelte').Snippet;
		onkeydown?: (
			e: KeyboardEvent & {
				currentTarget: EventTarget & HTMLDivElement;
			}
		) => void;
		[key: string]: unknown;
	}

	let {
		name = '',
		checked = $bindable(null),
		size = 'md',
		inactive = 'bg-surface-400 dark:bg-surface-700',
		active = 'bg-surface-900 dark:bg-surface-300',
		border = '',
		rounded = 'rounded-full',
		labelClass = 'ml-3',
		label = '',
		class: clasNames = '',
		onkeydown = () => {},
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
	let trackSize: string = $derived.by(() => {
		switch (size) {
			case 'sm':
				return 'w-12 h-6';
			case 'lg':
				return 'w-20 h-10';
			default:
				return 'w-16 h-8';
		}
	});

	// A11y Input Handlers
	function onKeyDown(
		event: KeyboardEvent & {
			currentTarget: EventTarget & HTMLDivElement;
		}
	) {
		// Enter/Space to toggle element
		if (['Enter', ' '].includes(event.key)) {
			event.preventDefault();
			if (onkeydown) onkeydown(event);
			const inputElem = event.currentTarget.firstChild as HTMLLabelElement;
			inputElem.click();
		}
	}

	// Interactive
	let cTrackActive = $derived(checked ? active : inactive);

	let cThumbBackground = $derived(checked ? 'bg-white/75' : 'bg-white');

	let cThumbPos = $derived(checked ? 'translate-x-full' : '');

	// Reactive Classes
	let classesDisabled = $derived(
		rest.disabled === true
			? 'opacity-50'
			: 'hover:brightness-[105%] dark:hover:brightness-110 cursor-pointer'
	);
	let classesBase = $derived(
		`${cBase} ${rounded} ${classesDisabled} ${clasNames}`
	);
	let classesLabel = $derived(`${cLabel} cursor-pointer`);
	let classesTrack = $derived(
		`${cTrack} ${border} ${rounded} ${trackSize} ${cTrackActive}`
	);
	let classesThumb = $derived(
		`${cThumb} ${rounded} ${cThumbBackground} ${cThumbPos}`
	);
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
			{...rest}
			disabled={rest.disabled as boolean | undefined | null}
		/>
		<!-- Label -->
		{#if children}
			<div class="slide-toggle-text flex-1 {labelClass}">
				{@render children?.()}
			</div>
		{/if}
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
