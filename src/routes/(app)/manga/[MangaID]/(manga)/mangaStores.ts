// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { ChapterTypeFragment } from '$lib/gql/Fragments';
import type { ResultOf } from 'gql.tada';
// import { localStorageStore } from "@skeletonlabs/skeleton";
import { writable } from 'svelte/store';

export type chaptertype = ResultOf<typeof ChapterTypeFragment>;

export const selectMode = writable(false);
export const selected = writable<chaptertype[]>([]);
