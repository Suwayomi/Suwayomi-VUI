<!--
 Copyright 2024 robonau
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
     https://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	type CssClasses = string;

	interface Props {
		size?: 'sm' | 'md' | 'lg';
		on?: CssClasses;
		intermediate?: CssClasses;
		off?: CssClasses;
		onThumb?: Snippet;
		intermediateThumb?: Snippet;
		offThumb?: Snippet;
		onThumbBg?: CssClasses;
		intermediateThumbBg?: CssClasses;
		offThumbBg?: CssClasses;
		border?: CssClasses;
		rounded?: CssClasses;
		label?: string;
		name?: string;
		state?: 'on' | 'intermediate' | 'off';
		children?: Snippet;
		disabled?: boolean | null;
		class?: CssClasses;
		labelBefore?: boolean;
		labelText?: CssClasses;
		title?: string;
		[key: string]: unknown;
	}

	let {
		size = 'md',
		off = 'bg-surface-400 dark:bg-surface-700 cursor-pointer',
		intermediate = 'bg-surface-600 dark:bg-surface-500 cursor-pointer',
		on = 'bg-surface-900 dark:bg-surface-300 cursor-pointer',
		onThumb,
		intermediateThumb,
		offThumb,
		onThumbBg = 'bg-white',
		intermediateThumbBg = 'bg-white/[85%]',
		offThumbBg = 'bg-white/75',
		border = '',
		rounded = 'rounded-full',
		label = '',
		name = '',
		state = $bindable('intermediate'),
		disabled,
		onkeydown,
		children,
		labelBefore = false,
		labelText = 'flex-1',
		class: classNames = '',
		title,
		...rest
	}: Props = $props();

	// Base Styles
	const cBase = 'inline-block';
	const cLabel = 'unstyled flex items-center';
	const cTrack = 'flex transition-all duration-[200ms] cursor-pointer';
	const cThumb =
		'w-1/2 h-full scale-[0.8] transition-all duration-[200ms] shadow';

	// Set track size
	let trackSize = $derived.by(() => {
		switch (size) {
			case 'sm':
				return 'w-12 h-6';
			case 'lg':
				return 'w-20 h-10';
			default:
				return 'w-16 h-8';
		}
	});

	// // Interactive
	let cTrackActive = $derived.by(() => {
		switch (state) {
			case 'on':
				return on;
			case 'intermediate':
				return intermediate;
			case 'off':
				return off;
		}
	});
	let cThumbBackground = $derived.by(() => {
		switch (state) {
			case 'on':
				return onThumbBg;
			case 'intermediate':
				return intermediateThumbBg;
			case 'off':
				return offThumbBg;
		}
	});
	let cThumbPos = $derived.by(() => {
		switch (state) {
			case 'on':
				return 'translate-x-full';
			case 'intermediate':
				return 'translate-x-1/2';
			case 'off':
				return '';
		}
	});

	// // derived Classes
	let classesDisabled = $derived(
		disabled === true
			? 'opacity-50'
			: 'hover:brightness-[105%] dark:hover:brightness-110 cursor-pointer'
	);
	let classesBase = $derived(
		`${cBase} ${rounded} ${classesDisabled} ${classNames ?? ''}`
	);
	let classesLabel = $derived(`${cLabel}`);
	let classesTrack = $derived(
		`${cTrack} ${border} ${rounded} ${trackSize} ${cTrackActive}`
	);
	let classesThumb = $derived(
		`${cThumb} ${rounded} ${cThumbBackground} ${cThumbPos}`
	);

	function OnKeyDown(
		event: KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement }
	) {
		if (['Enter', ' '].includes(event.key)) {
			const inputElem = event.currentTarget.firstChild as HTMLLabelElement;
			inputElem.click();
		}
	}
</script>

<div
	id={label}
	class="slide-toggle {classesBase}"
	data-testid="slide-toggle"
	onkeydown={OnKeyDown}
	role="switch"
	aria-label={label}
	aria-checked={state === 'on' ? 'true' : state === 'off' ? 'false' : 'mixed'}
	tabindex="0"
	{title}
>
	<label class="slide-toggle-label {classesLabel}">
		<!-- Hidden Input -->
		<input
			type="checkbox"
			class="slide-toggle-input hidden"
			checked={state === 'on' ? true : state === 'off' ? false : undefined}
			indeterminate={state === 'intermediate' ? true : undefined}
			onchange={() => {
				if (state === 'on') {
					state = 'off';
				} else if (state === 'off') {
					state = 'intermediate';
				} else {
					state = 'on';
				}
			}}
			{name}
			{disabled}
			{...rest}
		/>
		<!-- Label -->
		{#if labelBefore}
			{#if children}
				<div class="slide-toggle-text ml-3 {labelText}">
					{@render children()}
				</div>
			{:else}
				<div class="slide-toggle-text ml-3 {labelText}">{label}</div>
			{/if}
		{/if}
		<!-- Slider Track/Thumb -->
		<div
			class="slide-toggle-track {classesTrack}"
			class:cursor-not-allowed={disabled}
		>
			<div
				class="slide-toggle-thumb {classesThumb}"
				class:cursor-not-allowed={disabled}
			>
				{#if state === 'on' && onThumb}
					{@render onThumb()}
				{:else if state === 'intermediate' && intermediateThumb}
					{@render intermediateThumb()}
				{:else if state === 'off' && offThumb}
					{@render offThumb()}
				{/if}
			</div>
		</div>
		<!-- Label -->
		{#if !labelBefore}
			{#if children}
				<div class="slide-toggle-text ml-3 {labelText}">
					{@render children()}
				</div>
			{:else}
				<div class="slide-toggle-text ml-3 {labelText}">{label}</div>
			{/if}
		{/if}
	</label>
</div>
