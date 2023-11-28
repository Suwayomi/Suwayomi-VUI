// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

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
