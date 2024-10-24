<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import type { CssClasses } from '@skeletonlabs/skeleton';
	import IconWrapper from './IconWrapper.svelte';

	interface Props {
		name?: string;
		hover?: CssClasses;
		height?: CssClasses;
		tabindex?: number | null | undefined;
		class?: CssClasses;
		onclick?: (e: MouseEvent) => void;
		[key: string]: unknown;
	}

	let {
		name = 'mdi:home',
		hover = 'hover:variant-glass-surface',
		height = 'h-full',
		tabindex = undefined,
		class: classname,
		onclick = () => {},
		...propsrest
	}: Props = $props();
</script>

<button
	{...propsrest}
	{tabindex}
	{onclick}
	class="{height} aspect-square {hover} {classname ?? ''}"
>
	<IconWrapper width="100%" height="100%" {name} class="m-0  p-2 text-5xl" />
</button>
