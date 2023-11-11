<script lang="ts">
	import type { CssClasses } from '@skeletonlabs/skeleton';
	import IconButton from './IconButton.svelte';
	import Tooltip from './Tooltip.svelte';
	import type { OffsetOptions, Placement } from '@floating-ui/dom';

	export let tip: string;
	export let name: string = 'mdi:home';
	export let tipclass: CssClasses = 'z-50';
	export let placement: Placement = 'top';
	export let hover: CssClasses = 'hover:variant-glass-surface';
	export let offset: OffsetOptions = 0;
</script>

<Tooltip {offset} {tipclass} {placement} {tip} class=" cursor-pointer h-full {$$props.class}">
	<IconButton {name} {hover} on:click />
</Tooltip>
