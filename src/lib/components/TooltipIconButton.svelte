<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import type { CssClasses } from '@skeletonlabs/skeleton';
	import IconButton from './IconButton.svelte';
	import Tooltip from './Tooltip.svelte';
	import type { OffsetOptions, Placement } from '@floating-ui/dom';

	interface Props {
		tip: string;
		name?: string;
		tipclass?: CssClasses;
		placement?: Placement;
		hover?: CssClasses;
		offset?: OffsetOptions;
		onclick?: (e: MouseEvent) => void;
		[key: string]: unknown;
	}

	let {
		tip,
		name = 'mdi:home',
		tipclass = 'z-50',
		placement = 'top',
		hover = 'hover:variant-glass-surface',
		offset = 0,
		onclick = () => {},
		...rest
	}: Props = $props();

	function parsedRest(rest: Record<string, unknown>) {
		const { class: _, ...tmp } = rest;
		return tmp;
	}
</script>

<Tooltip
	{...parsedRest(rest)}
	{offset}
	{tipclass}
	{placement}
	{tip}
	class="h-full cursor-pointer {rest.class}"
>
	<IconButton {name} {hover} {onclick} />
</Tooltip>
