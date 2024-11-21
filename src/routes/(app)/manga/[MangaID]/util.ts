// Copyright (c) 2024 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.
import type { mmState } from '$lib/simpleStores.svelte';
import type { ResultOf } from 'gql.tada';
import type { getManga } from '$lib/gql/Queries';

export function filterChapters(mangaMeta: typeof mmState, reading = false) {
	return (
		chapter: ResultOf<typeof getManga>['manga']['chapters']['nodes'][number]
	) => {
		const groupPartials = mangaMeta.value.groupPartials;
		if (groupPartials && groupPartials.length > 0) {
			if (
				!groupPartials
					.map((group) => {
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
			if (mangaMeta.value.ChapterUnread === 'on' && chapter.isRead)
				return false;
			if (mangaMeta.value.ChapterUnread === 'off' && !chapter.isRead)
				return false;

			if (mangaMeta.value.ChapterDownloaded === 'on' && !chapter.isDownloaded)
				return false;
			if (mangaMeta.value.ChapterDownloaded === 'off' && chapter.isDownloaded)
				return false;

			if (mangaMeta.value.ChapterBookmarked === 'on' && !chapter.isBookmarked)
				return false;
			if (mangaMeta.value.ChapterBookmarked === 'off' && chapter.isBookmarked)
				return false;
		}
		return true;
	};
}
