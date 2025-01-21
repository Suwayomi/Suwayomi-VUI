<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { IntersectionObserverAction } from '$lib/actions/IntersectionObserver.svelte';
	interface Props {
		root?: Element | Document | undefined;
		top?: number;
		bottom?: number;
		left?: number;
		right?: number;
		children?: import('svelte').Snippet<[{ intersecting: boolean }]>;
		[key: string]: unknown;
		onintersect?: (e: boolean) => void;
	}

	let {
		root = undefined,
		top = 0,
		bottom = 0,
		left = 0,
		right = 0,
		children,
		onintersect = () => {},
		...restProps
	}: Props = $props();

	let intersecting = $state(false);
</script>

<div
	use:IntersectionObserverAction={{
		root,
		rootMargin: `${bottom}px ${left}px ${top}px ${right}px`,
		callback: (e) => {
			if (e.isIntersecting) {
				intersecting = true;
			} else {
				intersecting = false;
			}
			onintersect(intersecting);
		}
	}}
	{...restProps}
>
	{@render children?.({ intersecting })}
</div>
