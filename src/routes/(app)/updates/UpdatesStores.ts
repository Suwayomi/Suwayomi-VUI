// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { type Writable, writable } from 'svelte/store';
import type { UpdatesQuery } from '$lib/generated';

export type UpdateNode = UpdatesQuery['chapters']['nodes'][0];

export const selected: Writable<UpdateNode[]> = writable([]);
export const selectMode = writable(false);
