// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { onDestroy } from 'svelte';
import type { Component } from 'svelte';

type actionStateT<T extends Record<string, unknown>> = {
	component: Component<T>;
	props: T;
};
class MakeActionState<T extends Record<string, unknown>> {
	#action = $state<actionStateT<T> | null>(null);
	#title = $state<string>('Loading...');
	AppBarData<TT extends Record<string, unknown>>(
		title: string,
		action?: actionStateT<TT>
	) {
		if (action) this.#action = action as unknown as actionStateT<T>;
		this.#title = title;
		try {
			onDestroy(() => {
				this.#action = null;
				this.#title = 'Loading...';
			});
		} catch {}
	}
	get action() {
		return this.#action;
	}
	get title() {
		return this.#title;
	}
}

export const actionState = new MakeActionState();
