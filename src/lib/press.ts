// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { ActionReturn } from 'svelte/action';

interface Attributes {
	onlongPress: (e: CustomEvent<boolean>) => void;
}

export function longPress(
	node: HTMLElement,
	threshold = 500
): ActionReturn<number, Attributes> {
	const handle_mousedown = () => {
		const move = (e: MouseEvent | TouchEvent) => {
			if (window.TouchEvent && e instanceof TouchEvent) {
				cancel();
			} else if (e instanceof MouseEvent) {
				const diff = Math.abs(e.movementX) + Math.abs(e.movementY);
				if (diff > 2) cancel();
			}
		};

		const timeout = setTimeout(() => {
			node.dispatchEvent(new CustomEvent('longPress'));
			removeListeners(node, move, cancel);
		}, threshold);

		const cancel = () => {
			clearTimeout(timeout);
			removeListeners(node, move, cancel);
		};

		addListeners(node, move, cancel);
	};

	if (window.TouchEvent) {
		node.addEventListener('touchstart', handle_mousedown);
	}
	node.addEventListener('mousedown', handle_mousedown);
	return {
		destroy: () => {
			node.removeEventListener('mousedown', handle_mousedown);
			if (window.TouchEvent) {
				node.removeEventListener('touchstart', handle_mousedown);
			}
		}
	};
}

function addListeners(
	node: HTMLElement,
	move: (e: MouseEvent | TouchEvent) => void,
	cancel: () => void
) {
	node.addEventListener('mousemove', move);
	node.addEventListener('mouseup', cancel);
	if (window.TouchEvent) {
		node.addEventListener('touchend', cancel);
		node.addEventListener('touchcancel', cancel);
		node.addEventListener('touchmove', move);
	}
}

function removeListeners(
	node: HTMLElement,
	move: (e: MouseEvent | TouchEvent) => void,
	cancel: () => void
) {
	node.removeEventListener('mousemove', move);
	node.removeEventListener('mouseup', cancel);
	if (window.TouchEvent) {
		node.removeEventListener('touchend', cancel);
		node.removeEventListener('touchcancel', cancel);
		node.removeEventListener('touchmove', move);
	}
}
