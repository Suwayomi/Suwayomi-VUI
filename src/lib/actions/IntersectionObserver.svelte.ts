import type { Action } from 'svelte/action';
import type { SvelteSet } from 'svelte/reactivity';
type Callback = (entry: IntersectionObserverEntry) => void;
const Callbacks = new WeakMap<Element, Callback>();
const Observers = new WeakMap<IntersectionObserverInit, IntersectionObserver>();

export type Options = IntersectionObserverInit & {
	callback: Callback;
};

function newObserver(init: IntersectionObserverInit) {
	const observer = new IntersectionObserver((entries) => {
		for (const entry of entries) {
			const callback = Callbacks.get(entry.target);
			if (callback) {
				callback(entry);
			}
		}
	}, init);
	Observers.set(init, observer);
	return observer;
}

function observe(node: Element, options: Options) {
	const { callback } = options;

	const observer = Observers.get(options) || newObserver(options);

	Callbacks.set(node, callback);
	observer.observe(node);

	return () => {
		observer.unobserve(node);
		Callbacks.delete(node);
	};
}

export const IntersectionObserverAction: Action<Element, Options> = (
	node: Element,
	options: Options
) => {
	let unobserve = observe(node, options);
	return {
		update(options: Options) {
			unobserve();
			unobserve = observe(node, options);
		},
		destroy() {
			unobserve();
		}
	};
};

export function MakeSimpleCallback<T>(set: SvelteSet<T>, key: T): Callback {
	return (entry) => {
		if (entry.isIntersecting) {
			set.add(key);
		} else {
			set.delete(key);
		}
	};
}
