<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import type { CssClasses } from '@skeletonlabs/skeleton';
	import { onDestroy } from 'svelte';

	const Estate = {
		loading: 'loading',
		error: 'error',
		loaded: 'loaded'
	} as const;

	type TEstate = keyof typeof Estate;

	let LState: TEstate = $state(Estate.loading);
	let img: HTMLImageElement | undefined = $state();

	function load(
		// eslint-disable-next-line no-undef
		e: globalThis.Event & {
			currentTarget: EventTarget & Element;
		}
	) {
		e.currentTarget.classList.remove('hidden');
		LState = Estate.loaded;
	}
	function error() {
		LState = Estate.error;
		onfailed();
	}

	onDestroy(() => {
		if (img) {
			img.src = '';
		}
	});

	interface Props {
		src?: string | null | undefined;
		alt?: string;
		title?: string | undefined;
		width?: CssClasses;
		height?: CssClasses;
		fit?: CssClasses;
		aspect?: CssClasses;
		rounded?: CssClasses;
		LoadingHeight?: CssClasses;
		LoadingWidth?: CssClasses;
		draggable?: boolean;
		reload_button?: boolean;
		class?: CssClasses;
		onfailed?: () => void;
	}

	let {
		src = '',
		alt = '',
		title = undefined,
		width = 'w-full',
		height = 'h-full',
		fit = 'object-cover',
		aspect = '',
		rounded = 'rounded-lg',
		LoadingHeight = '',
		LoadingWidth = '',
		draggable = true,
		reload_button = false,
		class: classname,
		onfailed = () => {}
	}: Props = $props();
	$effect(() => {
		if (typeof src !== 'string') {
			error();
		}
	});
	$effect(() => {
		if (src === '') LState = Estate.error;
	});
</script>

<div
	class="relative {aspect}
		{LState === Estate.loading && LoadingWidth.length ? LoadingWidth : width}
		{LState === Estate.loading && LoadingHeight.length ? LoadingHeight : height}
		{classname}"
>
	{#if LState === Estate.error}
		<div
			class="card flex items-center justify-center {rounded} {aspect}
			{LoadingWidth.length ? LoadingWidth : width}
			{LoadingHeight.length ? LoadingHeight : height}
			{classname}"
		>
			<div class="flex flex-col space-y-2">
				<div>Failed.</div>
				{#if reload_button}
					<button
						class="variant-filled-surface btn"
						onclickcapture={(e) => {
							e.stopPropagation();
							LState = Estate.loading;
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
	{:else if LState === Estate.loading}
		<div
			class="placeholder absolute bottom-0 left-0 right-0 top-0 animate-pulse {rounded} {aspect}
			{LoadingWidth.length ? LoadingWidth : width}
			{LoadingHeight.length ? LoadingHeight : height}
			 {classname}"
		></div>
	{/if}
	{#if LState !== Estate.error}
		<img
			bind:this={img}
			onload={load}
			onerror={error}
			class="{aspect} {width} {height} {fit} {rounded} {classname}"
			{title}
			{src}
			{alt}
			{draggable}
		/>
	{/if}
</div>
