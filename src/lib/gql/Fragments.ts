// Copyright (c) 2024 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this

import { graphql } from './graphql';

export const TrackRecordTypeFragment = graphql(
	/* GraphQL */ `
		fragment TrackRecordTypeFragment on TrackRecordType @_unmask {
			id
			mangaId
			remoteId
			remoteUrl
			title
			trackerId
		}
	`,
	[]
);

export const ChapterTypeFragment = graphql(
	/* GraphQL */ `
		fragment ChapterTypeFragment on ChapterType @_unmask {
			isBookmarked
			isDownloaded
			isRead
			id
			chapterNumber
			fetchedAt
			lastPageRead
			name
			sourceOrder
			uploadDate
			pageCount
			scanlator
		}
	`,
	[]
);

export const MangaTypeFragment = graphql(
	/* GraphQL */ `
		fragment MangaTypeFragment on MangaType @_unmask {
			artist
			author
			description
			genre
			id
			inLibrary
			lastFetchedAt
			realUrl
			status
			title
			thumbnailUrl
			unreadCount
			downloadCount
			latestFetchedChapter {
				fetchedAt
				id
			}
			latestUploadedChapter {
				uploadDate
				id
			}
			latestReadChapter {
				lastReadAt
				id
			}
			lastReadChapter {
				lastReadAt
				id
			}
			meta {
				value
				key
			}
			source {
				displayName
				id
			}
			categories {
				nodes {
					id
				}
			}
			trackRecords {
				nodes {
					...TrackRecordTypeFragment
				}
			}
		}
	`,
	[TrackRecordTypeFragment]
);

export const SourceTypeFragment = graphql(
	/* GraphQL */ `
		fragment SourceTypeFragment on SourceType @_unmask {
			id
			displayName
			iconUrl
			lang
			meta {
				value
				key
			}
		}
	`,
	[]
);

export const ExtensionTypeFragment = graphql(
	/* GraphQL */ `
		fragment ExtensionTypeFragment on ExtensionType @_unmask {
			name
			repo
			versionName
			pkgName
			lang
			iconUrl
			isNsfw
			isInstalled
			isObsolete
			hasUpdate
		}
	`,
	[]
);

export const CategoryTypeFragment = graphql(
	/* GraphQL */ `
		fragment CategoryTypeFragment on CategoryType @_unmask {
			id
			default
			order
			name
			includeInDownload
			includeInUpdate
			mangas {
				totalCount
			}
		}
	`,
	[]
);

export const TrackerTypeFragment = graphql(
	/* GraphQL */ `
		fragment TrackerTypeFragment on TrackerType @_unmask {
			authUrl
			icon
			id
			isLoggedIn
			name
		}
	`,
	[]
);
