// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { CategoryQuery } from '$lib/generated';
// import { localStorageStore } from '@skeletonlabs/skeleton';
import { writable, type Writable } from 'svelte/store';

export type MangaType = NonNullable<CategoryQuery['category']>['mangas']['nodes'][0];
export const selected: Writable<MangaType[]> = writable([]);
export const selectMode = writable(false);
