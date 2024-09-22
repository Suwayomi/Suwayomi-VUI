// Copyright (c) 2024 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.
import { get } from 'svelte/store';
import type { MangaMeta } from '$lib/simpleStores';
import type { ResultOf } from 'gql.tada';
import type { getManga } from '$lib/gql/Queries';

export function filterChapters(
	mangaMeta: ReturnType<typeof MangaMeta>,
	reading = false
) {
	return (
		chapter: ResultOf<typeof getManga>['manga']['chapters']['nodes'][number]
	) => {
		if (get(mangaMeta).groupPartials.length > 0) {
			if (
				!get(mangaMeta)
					.groupPartials.map((group) => {
						return chapter.scanlator
							?.toLowerCase()
							.includes(group.toLowerCase());
					})
					.reduce((a, c) => a || c, false)
			) {
				return false;
			}
		}
		if (!reading) {
			if (get(mangaMeta).ChapterUnread === 1 && chapter.isRead) return false;
			if (get(mangaMeta).ChapterUnread === 2 && !chapter.isRead) return false;

			if (get(mangaMeta).ChapterDownloaded === 1 && !chapter.isDownloaded)
				return false;
			if (get(mangaMeta).ChapterDownloaded === 2 && chapter.isDownloaded)
				return false;

			if (get(mangaMeta).ChapterBookmarked === 1 && !chapter.isBookmarked)
				return false;
			if (get(mangaMeta).ChapterBookmarked === 2 && chapter.isBookmarked)
				return false;
		}
		return true;
	};
}
