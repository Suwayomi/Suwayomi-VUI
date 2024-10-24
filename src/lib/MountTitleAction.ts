// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { onDestroy } from 'svelte';
import type { ComponentProps, Component } from 'svelte';
import { readonly, writable } from 'svelte/store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type actionStoreT<TComponent extends Component<any>> = {
	component: TComponent;
	props: ComponentProps<TComponent>;
};

// i dont really like that i cant type this nicely, AppBarData is typed good though
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const actionStore = writable<actionStoreT<Component<any>> | null>(null);

const titleStore = writable<string>('Loading...');

export const action = readonly(actionStore);
export const title = readonly(titleStore);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AppBarData<TComponent extends Component<any>>(
	title: string,
	action?: actionStoreT<TComponent>
) {
	if (action) actionStore.set(action);
	titleStore.set(title);
	onDestroy(() => {
		actionStore.set(null);
		titleStore.set('Loading...');
	});
}
