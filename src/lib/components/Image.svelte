<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import type { CssClasses } from '@skeletonlabs/skeleton';
	import { createEventDispatcher, onDestroy } from 'svelte';

	export let src: string | null | undefined = '';
	export let alt: string = '';
	export let title: string | undefined = undefined;

	type Event = {
		failed: void;
	};
	const dispatch = createEventDispatcher<Event>();

	enum state {
		loading = 'loading',
		error = 'error',
		loaded = 'loaded'
	}

	let State = state.loading;
	if (src === '') State = state.error;
	let img: HTMLImageElement | undefined;

	$: if (typeof src !== 'string') {
		error();
	}

	function load(
		// eslint-disable-next-line no-undef
		e: globalThis.Event & {
			currentTarget: EventTarget & Element;
		}
	) {
		e.currentTarget.classList.remove('hidden');
		State = state.loaded;
	}
	function error() {
		State = state.error;
		dispatch('failed');
	}

	onDestroy(() => {
		if (img) {
			img.src = '';
		}
	});

	export let width: CssClasses = 'w-full';
	export let height: CssClasses = 'h-full';
	export let fit: CssClasses = 'object-cover';
	export let aspect: CssClasses = '';
	export let rounded: CssClasses = 'rounded-lg';
	export let LoadingHeight: CssClasses = '';
	export let LoadingWidth: CssClasses = '';
	export let draggable = true;
	export let reload_button = false;
</script>

<div
	class="relative {aspect}
		{State === state.loading && LoadingWidth.length ? LoadingWidth : width}
		{State === state.loading && LoadingHeight.length ? LoadingHeight : height}
		{$$props.class}"
>
	{#if State === state.error}
		<div
			class="card flex items-center justify-center {rounded} {aspect}
			{LoadingWidth.length ? LoadingWidth : width}
			{LoadingHeight.length ? LoadingHeight : height}
			{$$props.class}"
		>
			<div class="flex flex-col space-y-2">
				<div>Failed.</div>
				{#if reload_button}
					<button
						class="variant-filled-surface btn"
						on:click|capture|stopPropagation={() => {
							State = state.loading;
							if (!img) return;
							img.src = '';
							window.requestAnimationFrame(() => {
								if (!img) return;
								img.src = src ?? '';
							});
						}}
					>
						Reload
					</button>
				{/if}
			</div>
		</div>
	{:else if State === state.loading}
		<div
			class="placeholder absolute bottom-0 left-0 right-0 top-0 animate-pulse {rounded} {aspect}
			{LoadingWidth.length ? LoadingWidth : width}
			{LoadingHeight.length ? LoadingHeight : height}
			 {$$props.class}"
		/>
	{/if}
	{#if State !== state.error}
		<img
			bind:this={img}
			on:load={load}
			on:error={error}
			class="{aspect} {width} {height} {fit} {rounded} {$$props.class}"
			{title}
			{src}
			{alt}
			{draggable}
		/>
	{/if}
</div>
