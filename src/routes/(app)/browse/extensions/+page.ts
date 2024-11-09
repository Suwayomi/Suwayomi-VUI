// Copyright (c) 2024 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { browser } from '$app/environment';
import { getExtensions } from '$lib/gql/Queries';
import { gmState } from '$lib/simpleStores.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ fetch }) => {
	if (browser)
		(async () => {
			const mod = await import('$lib/gql/graphqlClient');
			mod.client
				.query(
					getExtensions,
					{ isNsfw: gmState.value.nsfw ? null : false },
					{
						fetch
					}
				)
				.toPromise();
		})();
};
