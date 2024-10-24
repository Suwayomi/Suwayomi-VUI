<!-- @migration-task Error while migrating Svelte code: Unexpected token -->
<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import type { CssClasses } from '@skeletonlabs/skeleton';

	import { fade } from 'svelte/transition';
	import Image from './Image.svelte';

	interface Props {
		thumbnailUrl?: string;
		title?: string;
		titleA?: string | undefined;
		fit?: CssClasses;
		rounded?: CssClasses;
		aspect?: CssClasses;
		draggable?: boolean;
		children?: import('svelte').Snippet;
		[key: string]: unknown;
	}

	let {
		thumbnailUrl = '',
		title = '',
		titleA = undefined,
		fit = 'object-cover',
		rounded = 'rounded-lg',
		aspect = '',
		draggable = true,
		children,
		...rest
	}: Props = $props();
</script>

<div
	class="relative h-full w-full {rest.class as string | undefined ?? ''}"
	in:fade
>
	<Image
		{draggable}
		{fit}
		{aspect}
		src={thumbnailUrl}
		alt={title}
		title={titleA}
		{rounded}
	/>
	{@render children?.()}
</div>
