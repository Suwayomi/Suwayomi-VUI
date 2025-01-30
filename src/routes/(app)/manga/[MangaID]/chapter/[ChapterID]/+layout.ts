// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { browser } from '$app/environment';
import { fetchChapterPages } from '$lib/gql/Mutations';
import { client } from '$lib/gql/graphqlClient';

export const ssr = false;
export const prerender = false;

export const load: LayoutLoad = ({ params }) => {
	const MangaID = parseInt(params.MangaID);
	const ChapterID = parseInt(params.ChapterID);
	if (isNaN(MangaID)) error(400, 'MangaID should be a number');
	if (isNaN(ChapterID)) error(400, 'MangaID should be a number');
	if (browser)
		return {
			MangaID,
			ChapterID,
			pre: client
				.mutation(
					fetchChapterPages,
					{ chapterId: ChapterID },
					{
						fetch
					}
				)
				.toPromise()
		};

	return {
		MangaID,
		ChapterID
	};
};
