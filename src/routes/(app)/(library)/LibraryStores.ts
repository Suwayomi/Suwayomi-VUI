// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { getCategory } from '$lib/gql/Queries';
import type { ResultOf } from 'gql.tada';
import { writable } from 'svelte/store';

export type MangaType = ResultOf<
	typeof getCategory
>['category']['mangas']['nodes'][0];
export const selected = writable<MangaType[]>([]);
export const selectMode = writable(false);
