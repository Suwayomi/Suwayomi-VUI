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

	export let thumbnailUrl = '';
	export let title = '';
	export let titleA: string | undefined = undefined;
	export let fit: CssClasses = 'object-cover';
	export let rounded: CssClasses = 'rounded-lg';
	export let aspect: CssClasses = '';
	export let draggable = true;
</script>

<div class="relative h-full w-full {$$props.class}" in:fade>
	<Image
		{draggable}
		{fit}
		{aspect}
		src={thumbnailUrl}
		alt={title}
		title={titleA}
		{rounded}
	/>
	<slot />
</div>
