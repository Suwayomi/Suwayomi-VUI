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
	import { onDestroy } from 'svelte';

	interface Props {
		root?: Element | Document | undefined;
		top?: number;
		bottom?: number;
		left?: number;
		right?: number;
		children?: import('svelte').Snippet<[{ intersecting: boolean }]>;
		[key: string]: unknown;
		onintersect?: (e: boolean) => void;
		onelem?: (e: { isInt: boolean; elem: HTMLDivElement | undefined }) => void;
	}

	let {
		root = undefined,
		top = 0,
		bottom = 0,
		left = 0,
		right = 0,
		children,
		onintersect = () => {},
		onelem = () => {},
		...restProps
	}: Props = $props();

	let intersecting = $state(false);

	let container: HTMLDivElement | undefined = $state();

	let observer: IntersectionObserver | undefined;

	$effect(() => {
		if (!container) return;
		observer?.unobserve(container);
		observer = new IntersectionObserver(
			(entries) => {
				intersecting = entries[entries.length - 1].isIntersecting;
				onintersect(intersecting);
				onelem({ isInt: intersecting, elem: container });
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
		observer?.disconnect();
	});
</script>

<div bind:this={container} {...restProps}>
	{@render children?.({ intersecting })}
</div>
