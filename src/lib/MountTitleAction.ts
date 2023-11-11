import { afterUpdate, onDestroy } from 'svelte';
import { action as actionStore, title as titleStore, type ComponentWritable } from './simpleStores';

export function AppBarData(title: string, action?: ComponentWritable<null>) {
	afterUpdate(() => {
		if (action) actionStore.set(action);
		titleStore.set(title);
	});
	onDestroy(() => {
		actionStore.set(null);
		titleStore.set('Loading...');
	});
}
