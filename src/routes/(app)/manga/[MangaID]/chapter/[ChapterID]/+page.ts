// Copyright (c) 2025 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { browser } from '$app/environment';
import { client } from '$lib/gql/graphqlClient';
import { fetchChapterPages } from '$lib/gql/Mutations';
import type { PageLoad } from './$types';
import { readerState } from './chapterStores.svelte';

export const load: PageLoad = async ({ parent }) => {
	if (browser) {
		const data = await parent();
		return {
			pre: readerState.ChapterPagesMap.has(data.ChapterID)
				? undefined
				: client
						.mutation(
							fetchChapterPages,
							{ chapterId: data.ChapterID },
							{
								fetch
							}
						)
						.toPromise()
		};
	}
};
