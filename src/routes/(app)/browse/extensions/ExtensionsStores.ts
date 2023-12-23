// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { localStorageStore } from '@skeletonlabs/skeleton';
import * as devalue from 'devalue';

export const lastFetched = localStorageStore<Date>('lastFetchedExtensions', new Date(0), {
	serializer: devalue
});

export const langFilter = localStorageStore<Set<string>>(
	'ExtensionsLangFilter',
	new Set(['all', 'en']),
	{
		serializer: devalue
	}
);
