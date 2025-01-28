// Copyright (c) 2025 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this

import type { Action } from 'svelte/action';

// file, You can obtain one at https://mozilla.org/MPL/2.0/.
export interface ScrollToOnMountOptions {
	behavior?: ScrollBehavior;
	position?: 'center' | 'start' | 'end';
	cssQuerySelector: string;
	runNow?: boolean;
}
export const InitScrollTo: Action<Element, ScrollToOnMountOptions> = (
	node: Element,
	options: ScrollToOnMountOptions
) => {
	runIt(node, options);
	return {
		update(options: ScrollToOnMountOptions) {
			runIt(node, options);
		}
	};
};

function runIt(node: Element, options: ScrollToOnMountOptions) {
	const {
		behavior = 'smooth',
		position = 'center',
		runNow = true,
		cssQuerySelector
	} = options;
	if (!runNow || !cssQuerySelector) return;
	const element = node.querySelector(cssQuerySelector);
	if (element && node) {
		const sideElementTop = node.getBoundingClientRect().top;
		const elementTop = element.getBoundingClientRect().top;
		const start = node.scrollTop + elementTop - sideElementTop;
		const elementMinusNodeHeight = element.clientHeight - node.clientHeight;
		const positons = {
			center: elementMinusNodeHeight / 2,
			start: 0,
			end: elementMinusNodeHeight
		} as const;

		node.scrollTo({
			behavior,
			top: start + positons[position]
		});
	}
}
