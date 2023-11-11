<script lang="ts">
	import type { CssClasses } from '@skeletonlabs/skeleton';

	import { fade } from 'svelte/transition';
	import Image from './Image.svelte';

	export let thumbnailUrl = '';
	export let title = '';
	export let titla: string | undefined = undefined;
	export let fit: CssClasses = 'object-cover';
	export let rounded: CssClasses = 'rounded-lg';
	export let aspect: CssClasses = '';
</script>

<div class="relative h-full w-full {$$props.class}" in:fade>
	<Image {fit} {aspect} src={thumbnailUrl} alt={title} title={titla} {rounded} />
	<slot />
</div>
