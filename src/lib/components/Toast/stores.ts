// Toast Store Queue

import { writable } from 'svelte/store';
import { getContext, setContext } from 'svelte';
import type { ToastSettings, Toast } from './types.js';

const toastDefaults: ToastSettings = {
	message: 'Missing Toast Message',
	autohide: true,
	timeout: 5000
};

const TOAST_STORE_KEY = 'toastStore';

/**
 * Retrieves the `toastStore`.
 *
 * This can *ONLY* be called from the **top level** of components!
 *
 * @example
 * ```svelte
 * <script>
 * 	import { getToastStore } from "@skeletonlabs/skeleton";
 *
 * 	const toastStore = getToastStore();
 *
 * 	toastStore.open({ message: "Welcome!" });
 * </script>
 * ```
 */
export function getToastStore(): ToastStore {
	const toastStore = getContext<ToastStore | undefined>(TOAST_STORE_KEY);

	if (!toastStore)
		throw new Error(
			'toastStore is not initialized. Please ensure that `initializeStores()` is invoked in the root layout file of this app!'
		);

	return toastStore;
}

/**
 * Initializes the `toastStore`.
 */
export function initializeToastStore(): ToastStore {
	const toastStore = toastService();

	return setContext(TOAST_STORE_KEY, toastStore);
}

// Note for security; differentiates the queued toasts
function randomUUID(): string {
	const random = Math.random();
	return Number(random).toString(32);
}

export type ToastStore = ReturnType<typeof toastService>;
function toastService() {
	const { subscribe, set, update } = writable<Toast[]>([]);

	/** Remove toast in queue*/
	const close = (id: string) =>
		update((tStore) => {
			if (tStore.length > 0) {
				const index = tStore.findIndex((t) => t.id === id);
				const selectedToast = tStore[index];
				if (selectedToast) {
					// Trigger Callback
					if (selectedToast.callback) selectedToast.callback({ id, status: 'closed' });
					// Clear timeout
					if (selectedToast.timeoutId) clearTimeout(selectedToast.timeoutId);
					// Remove
					tStore.splice(index, 1);
				}
			}
			return tStore;
		});

	// If toast should auto-hide, wait X time, then close by ID
	function handleAutoHide(toast: Toast) {
		if (toast.autohide === true) {
			return setTimeout(() => {
				close(toast.id);
			}, toast.timeout);
		}
	}

	return {
		subscribe,
		close,
		/** Add a new toast to the queue. */
		trigger: (toast: ToastSettings) => {
			const id: string = randomUUID();
			update((tStore) => {
				// Trigger Callback
				if (toast && toast.callback) toast.callback({ id, status: 'queued' });
				// activate autohide when dismiss button is hidden.
				if (toast.hideDismiss) toast.autohide = true;
				// Merge with defaults
				const tMerged: Toast = { ...toastDefaults, ...toast, id };
				// Handle auto-hide, if needed
				tMerged.timeoutId = handleAutoHide(tMerged);
				// Push into store
				tStore.push(tMerged);
				// Return
				return tStore;
			});
			return id;
		},
		/** Remain visible on hover */
		freeze: (index: number) =>
			update((tStore) => {
				if (tStore.length > 0) clearTimeout(tStore[index].timeoutId);
				return tStore;
			}),
		/** Cancel remain visible on leave */
		unfreeze: (index: number) =>
			update((tStore) => {
				if (tStore.length > 0) tStore[index].timeoutId = handleAutoHide(tStore[index]);
				return tStore;
			}),
		/** Remove all toasts from queue */
		clear: () => set([])
	};
}
