<script lang="ts">
	import type { CssClasses } from '@skeletonlabs/skeleton';
	import IconWrapper from './IconWrapper.svelte';

	export let name: string = 'mdi:home';
	export let hover: CssClasses = 'hover:variant-glass-surface';
	export let height: CssClasses = 'h-full';
</script>

<button class="{height} aspect-square {hover} {$$props.class ?? ''}" on:click>
	<IconWrapper width="100%" height="100%" {name} class="text-5xl  m-0 p-2" />
</button>
