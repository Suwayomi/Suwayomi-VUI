// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { browser } from '$app/environment';
import { getManga } from '$lib/gql/Queries';

export const load: PageLoad = ({ params, fetch }) => {
	const MangaID = parseInt(params.MangaID);
	if (isNaN(MangaID)) error(400, 'MangaID should be a number');
	if (browser)
		(async () => {
			const mod = await import('$lib/gql/graphqlClient');
			mod.client
				.query(
					getManga,
					{ id: MangaID },
					{
						fetch
					}
				)
				.toPromise();
		})();
	return {
		MangaID
	};
};
