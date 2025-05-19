<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import type { OffsetOptions, Placement } from '@floating-ui/dom';
	import {
		popup,
		type CssClasses,
		type PopupSettings
	} from '@skeletonlabs/skeleton';
	interface Props {
		tip: string;
		tipclass?: CssClasses;
		placement?: Placement;
		offset?: OffsetOptions;
		children?: import('svelte').Snippet;
		tooltip?: import('svelte').Snippet;
		[key: string]: unknown;
	}

	let {
		tip,
		tipclass = 'z-50',
		placement = 'top',
		offset = 0,
		children,
		tooltip,
		...rest
	}: Props = $props();

	const popupHover: PopupSettings = {
		event: 'hover',
		target: tip,
		placement,
		middleware: {
			offset: offset
		}
	};
</script>

<div use:popup={popupHover} class={(rest.class as string | undefined) ?? ''}>
	{@render children?.()}
</div>

<div class={tipclass} data-popup={tip}>
	<div class="card variant-filled-surface p-2">
		{#if tooltip}{@render tooltip()}{:else}
			<p>{tip}</p>
		{/if}
		<div class="variant-filled-surface arrow"></div>
	</div>
</div>
