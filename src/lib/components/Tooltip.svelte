<script lang="ts">
	import type { OffsetOptions, Placement } from '@floating-ui/dom';
	import { popup, type CssClasses, type PopupSettings } from '@skeletonlabs/skeleton';
	export let tip: string;
	export let tipclass: CssClasses = 'z-50';
	export let placement: Placement = 'top';
	export let offset: OffsetOptions = 0;

	const popupHover: PopupSettings = {
		event: 'hover',
		target: tip,
		placement,
		middleware: {
			offset: offset
		}
	};
</script>

<div use:popup={popupHover} class={$$props.class}>
	<slot />
</div>

<div class={tipclass} data-popup={tip}>
	<div class="card p-2 variant-filled-surface">
		<slot name="tooltip">
			<p>{tip}</p>
		</slot>
		<div class="arrow variant-filled-surface" />
	</div>
</div>
