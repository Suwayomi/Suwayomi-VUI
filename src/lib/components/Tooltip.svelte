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
	<div class="card variant-filled-surface p-2">
		<slot name="tooltip">
			<p>{tip}</p>
		</slot>
		<div class="variant-filled-surface arrow" />
	</div>
</div>
