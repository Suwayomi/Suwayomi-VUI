<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	/*
	 * This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
	 */
	import { afterUpdate, onDestroy } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher<{
		intersect: boolean;
		elem: { isInt: boolean; elem: HTMLDivElement };
	}>();

	export let root = undefined as Element | Document | undefined;
	export let top = 0;
	export let bottom = 0;
	export let left = 0;
	export let right = 0;

	let intersecting = false;

	let container: HTMLDivElement;

	let observer: IntersectionObserver | undefined;

	afterUpdate(() => {
		observer?.unobserve(container);
		observer = new IntersectionObserver(
			(entries) => {
				intersecting = entries[entries.length - 1].isIntersecting;
				dispatch('intersect', intersecting);
				dispatch('elem', { isInt: intersecting, elem: container });
			},
			{
				root: root,
				rootMargin: `${bottom}px ${left}px ${top}px ${right}px`,
				threshold: 0
			}
		);
		observer.observe(container);
	});

	onDestroy(() => {
		observer?.unobserve(container);
	});
</script>

<div bind:this={container} {...$$props}>
	<slot {intersecting} />
</div>
