import type { ActionReturn } from 'svelte/action';

interface Attributes {
	'on:longpress': (e: CustomEvent<boolean>) => void;
}

export function longpress(node: HTMLElement, threshold = 500): ActionReturn<number, Attributes> {
	const handle_mousedown = (ee: MouseEvent | TouchEvent) => {
		let previousTouch: null | Touch = null;
		if (window.TouchEvent && ee instanceof TouchEvent) {
			previousTouch = ee.touches[0];
		}
		const move = (e: MouseEvent | TouchEvent) => {
			let [movementX, movementY] = [0, 0];
			if (window.TouchEvent && e instanceof TouchEvent) {
				const touch = e.touches[0];
				if (previousTouch) {
					movementX = touch.pageX - previousTouch.pageX;
					movementY = touch.pageY - previousTouch.pageY;
				}
				previousTouch = touch;
			} else if (e instanceof MouseEvent) {
				movementX = e.movementX;
				movementY = e.movementY;
			}
			const diff = Math.abs(movementX) + Math.abs(movementY);
			if (diff > 20) cancel();
		};

		const timeout = setTimeout(() => {
			node.dispatchEvent(new CustomEvent('longpress'));
			removeListners(node, move, cancel);
		}, threshold);

		const cancel = () => {
			clearTimeout(timeout);
			removeListners(node, move, cancel);
		};
		addListners(node, move, cancel);
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

function addListners(
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

function removeListners(
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
