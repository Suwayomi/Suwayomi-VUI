// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { onDestroy } from 'svelte';
import type { ComponentType, ComponentProps } from 'svelte';
import { readonly, writable, type Writable } from 'svelte/store';

type actionStoreT<T extends ComponentType = ComponentType> = {
	component: T;
	props?: ComponentProps<InstanceType<T>>;
};

// i dont really like that i cant type this nicely, AppBarData is typed good though
const actionStore: Writable<actionStoreT | null> = writable(null);

const titleStore: Writable<string> = writable('loading...');

export const action = readonly(actionStore);
export const title = readonly(titleStore);

export function AppBarData<T extends ComponentType>(title: string, action?: actionStoreT<T>) {
	if (action) actionStore.set(action);
	titleStore.set(title);
	onDestroy(() => {
		actionStore.set(null);
		titleStore.set('Loading...');
	});
}
