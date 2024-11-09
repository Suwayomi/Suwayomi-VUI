// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { LayoutLoad } from './$types';
import { browser } from '$app/environment';
import { getSource } from '$lib/gql/Queries';

export const load: LayoutLoad = ({ params, fetch }) => {
	if (browser)
		(async () => {
			const mod = await import('$lib/gql/graphqlClient');
			mod.client
				.query(
					getSource,
					{ id: params.sourceID },
					{
						fetch
					}
				)
				.toPromise();
		})();
	return { ...params };
};
