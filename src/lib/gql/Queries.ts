// Copyright (c) 2024 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
import {
	CategoryTypeFragment,
	ChapterTypeFragment,
	ExtensionTypeFragment,
	MangaTypeFragment,
	SourceTypeFragment,
	TrackerTypeFragment,
	TrackRecordTypeFragment
} from './Fragments';
import { graphql } from './graphql';

export const getCategories = graphql(
	/* GraphQL */ `
		query categories($notEqualTo: Int = null) {
			categories(filter: { id: { notEqualTo: $notEqualTo } }) {
				nodes {
					...CategoryTypeFragment
				}
			}
		}
	`,
	[CategoryTypeFragment]
);

export const getCategory = graphql(
	/* GraphQL */ `
		query category($id: Int!) {
			category(id: $id) {
				id
				mangas {
					nodes {
						id
						title
						inLibrary
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
						chapters {
							totalCount
						}
					}
				}
			}
		}
	`,
	[]
);

export const getManga = graphql(
	/* GraphQL */ `
		query getManga($id: Int!) {
			manga(id: $id) {
				...MangaTypeFragment
				chapters {
					totalCount
					nodes {
						...ChapterTypeFragment
					}
				}
			}
		}
	`,
	[ChapterTypeFragment, MangaTypeFragment]
);

export const getSingleChapter = graphql(
	/* GraphQL */ `
		query getSingleChapter($id: Int!) {
			chapter(id: $id) {
				...ChapterTypeFragment
			}
		}
	`,
	[ChapterTypeFragment]
);

export const getExtensions = graphql(
	/* GraphQL */ `
		query getExtensions($isNsfw: Boolean = null) {
			extensions(condition: { isNsfw: $isNsfw }) {
				nodes {
					...ExtensionTypeFragment
				}
			}
		}
	`,
	[ExtensionTypeFragment]
);

export const getSources = graphql(
	/* GraphQL */ `
		query getSources($isNsfw: Boolean = null) {
			sources(condition: { isNsfw: $isNsfw }) {
				nodes {
					...SourceTypeFragment
					isNsfw
					extension {
						pkgName
						repo
					}
				}
			}
		}
	`,
	[SourceTypeFragment]
);

export const sourcesMigration = graphql(
	/* GraphQL */ `
		query sourcesMigration {
			sources {
				nodes {
					...SourceTypeFragment
				}
			}
			mangas(condition: { inLibrary: true }) {
				totalCount
				nodes {
					id
					sourceId
				}
			}
		}
	`,
	[SourceTypeFragment]
);

export const sourceMigrationManga = graphql(
	/* GraphQL */ `
		query sourceMigrationManga($sourceId: LongString!) {
			mangas(condition: { inLibrary: true, sourceId: $sourceId }) {
				nodes {
					id
					title
					thumbnailUrl
				}
			}
		}
	`,
	[]
);

export const sourceMigrationSource = graphql(
	/* GraphQL */ `
		query sourceMigrationSource($sourceId: LongString!) {
			source(id: $sourceId) {
				displayName
				id
			}
		}
	`,
	[]
);

export const MangaTitleMigration = graphql(
	/* GraphQL */ `
		query MangaTitleMigration($id: Int!) {
			manga(id: $id) {
				title
			}
		}
	`,
	[]
);

export const InfoForMigration = graphql(
	/* GraphQL */ `
		query InfoForMigration($id: Int!) {
			manga(id: $id) {
				chapters {
					nodes {
						id
						isRead
						isBookmarked
						chapterNumber
					}
				}
				categories {
					nodes {
						id
					}
				}
			}
		}
	`,
	[]
);

export const metas = graphql(
	/* GraphQL */ `
		query metas {
			metas {
				nodes {
					value
					key
				}
			}
		}
	`,
	[]
);

export const updates = graphql(
	/* GraphQL */ `
		query updates($offset: Int = 0) {
			chapters(
				orderBy: FETCHED_AT
				offset: $offset
				first: 100
				orderByType: DESC
				filter: { inLibrary: { equalTo: true } }
			) {
				nodes {
					id
					name
					fetchedAt
					isBookmarked
					isDownloaded
					isRead
					manga {
						id
						title
						thumbnailUrl
					}
				}
				pageInfo {
					hasNextPage
				}
			}
		}
	`,
	[]
);

export const chapters = graphql(
	/* GraphQL */ `
		query chapters($id: Int!) {
			manga(id: $id) {
				id
				title
				meta {
					value
					key
				}
				chapters {
					nodes {
						id
						name
						pageCount
						lastPageRead
						sourceOrder
					}
				}
			}
		}
	`,
	[]
);

export const getSource = graphql(
	/* GraphQL */ `
		query source($id: LongString!) {
			source(id: $id) {
				displayName
				id
				lang
				name
				supportsLatest
				isConfigurable
				preferences {
					... on CheckBoxPreference {
						__typename
						CheckBoxCheckBoxCurrentValue: currentValue
						summary
						CheckBoxDefault: default
						key
						CheckBoxTitle: title
					}
					... on EditTextPreference {
						__typename
						EditTextCurrentValue: currentValue
						EditTextDefault: default
						EditTextTitle: title
						text
						summary
						key
						dialogTitle
						dialogMessage
					}
					... on SwitchPreference {
						__typename
						SwitchCurrentValue: currentValue
						summary
						key
						SwitchDefault: default
						SwitchTitle: title
					}
					... on MultiSelectListPreference {
						__typename
						dialogMessage
						dialogTitle
						MultiSelectListTitle: title
						summary
						key
						entryValues
						entries
						MultiSelectListDefault: default
						MultiSelectListCurrentValue: currentValue
					}
					... on ListPreference {
						__typename
						ListCurrentValue: currentValue
						ListDefault: default
						ListTitle: title
						summary
						key
						entryValues
						entries
					}
				}
				filters {
					... on TriStateFilter {
						__typename
						name
						TriStateDefault: default
					}
					... on CheckBoxFilter {
						__typename
						CheckBoxDefault: default
						name
					}
					... on TextFilter {
						__typename
						name
						TextDefault: default
					}
					... on SortFilter {
						__typename
						values
						name
						SortDefault: default {
							ascending
							index
						}
					}
					... on SeparatorFilter {
						__typename
						name
					}
					... on SelectFilter {
						__typename
						values
						name
						SelectDefault: default
					}
					... on HeaderFilter {
						__typename
						name
					}
					... on GroupFilter {
						__typename
						name
						filters {
							... on TriStateFilter {
								__typename
								name
								TriStateDefault: default
							}
							... on CheckBoxFilter {
								__typename
								CheckBoxDefault: default
								name
							}
							... on TextFilter {
								__typename
								name
								TextDefault: default
							}
							... on SortFilter {
								__typename
								values
								name
								SortDefault: default {
									ascending
									index
								}
							}
							... on SeparatorFilter {
								__typename
								name
							}
							... on SelectFilter {
								__typename
								values
								name
								SelectDefault: default
							}
							... on HeaderFilter {
								__typename
								name
							}
						}
					}
				}
			}
		}
	`,
	[]
);

export const validateBackup = graphql(
	/* GraphQL */ `
		query validateBackup($backup: Upload!) {
			validateBackup(input: { backup: $backup }) {
				missingSources {
					id
					name
				}
			}
		}
	`,
	[]
);

export const ConditionalChaptersOfGivenManga = graphql(
	/* GraphQL */ `
		query ConditionalChaptersOfGivenManga(
			$in: [Int!]!
			$isBookmarked: Boolean = null
			$isDownloaded: Boolean = null
			$isRead: Boolean = null
		) {
			chapters(
				filter: { mangaId: { in: $in } }
				condition: {
					isDownloaded: $isDownloaded
					isRead: $isRead
					isBookmarked: $isBookmarked
				}
			) {
				nodes {
					id
				}
			}
		}
	`,
	[]
);

export const getabout = graphql(
	/* GraphQL */ `
		query getabout {
			aboutServer {
				buildTime
				buildType
				discord
				github
				name
				revision
				version
			}
		}
	`,
	[]
);

export const restoreStatus = graphql(
	/* GraphQL */ `
		query restoreStatus($id: String!) {
			restoreStatus(id: $id) {
				mangaProgress
				state
				totalManga
			}
		}
	`,
	[]
);

export const trackers = graphql(
	/* GraphQL */ `
		query trackers($isLoggedIn: Boolean = null) {
			trackers(condition: { isLoggedIn: $isLoggedIn }) {
				nodes {
					...TrackerTypeFragment
				}
			}
		}
	`,
	[TrackerTypeFragment]
);

export const searchTracker = graphql(
	/* GraphQL */ `
		query searchTracker($query: String!, $trackerId: Int!) {
			searchTracker(input: { query: $query, trackerId: $trackerId }) {
				trackSearches {
					coverUrl
					publishingStatus
					publishingType
					startDate
					summary
					title
					totalChapters
					trackingUrl
					trackerId
					remoteId
				}
			}
		}
	`,
	[]
);

export const trackRecords = graphql(
	/* GraphQL */ `
		query trackRecords {
			trackRecords {
				nodes {
					...TrackRecordTypeFragment
				}
			}
		}
	`,
	[TrackRecordTypeFragment]
);

export const serverSettings = graphql(
	/* GraphQL */ `
		query serverSettings {
			settings {
				autoDownloadNewChapters
				backupInterval
				backupPath
				backupTTL
				backupTime
				basicAuthEnabled
				basicAuthPassword
				basicAuthUsername
				debugLogsEnabled
				downloadAsCbz
				downloadsPath
				electronPath
				excludeCompleted
				excludeEntryWithUnreadChapters
				excludeNotStarted
				extensionRepos
				excludeUnreadChapters
				flareSolverrEnabled
				flareSolverrSessionName
				flareSolverrSessionTtl
				flareSolverrTimeout
				flareSolverrUrl
				globalUpdateInterval
				gqlDebugLogsEnabled
				initialOpenInBrowserEnabled
				ip
				localSourcePath
				maxSourcesInParallel
				port
				socksProxyEnabled
				socksProxyHost
				socksProxyPort
				systemTrayEnabled
				updateMangas
				webUIChannel
				webUIFlavor
				webUIInterface
				webUIUpdateCheckInterval
			}
		}
	`,
	[]
);
