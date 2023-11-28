// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { GetMangaQuery } from '$lib/generated';
// import { localStorageStore } from "@skeletonlabs/skeleton";
import { writable, type Writable } from 'svelte/store';

export type chaptertype = GetMangaQuery['manga']['chapters']['nodes'][0];

export const selectmode = writable(false);
export const selected: Writable<chaptertype[]> = writable([]);
