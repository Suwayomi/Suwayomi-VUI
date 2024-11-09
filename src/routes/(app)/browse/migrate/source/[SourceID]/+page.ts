// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { browser } from '$app/environment';
import { sourceMigrationManga, sourceMigrationSource } from '$lib/gql/Queries';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params, fetch }) => {
	if (browser)
		(async () => {
			const mod = await import('$lib/gql/graphqlClient');
			mod.client
				.query(
					sourceMigrationManga,
					{ sourceId: params.SourceID },
					{
						fetch
					}
				)
				.toPromise();
			mod.client
				.query(
					sourceMigrationSource,
					{ sourceId: params.SourceID },
					{
						fetch
					}
				)
				.toPromise();
		})();
	return params;
};
