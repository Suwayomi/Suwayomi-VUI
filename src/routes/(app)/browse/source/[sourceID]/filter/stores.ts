// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { FilterChangeInput } from '$lib/generated';
import { writable } from 'svelte/store';

export const filters = writable<FilterChangeInput[]>([]);
export const filtersSause = writable('');
