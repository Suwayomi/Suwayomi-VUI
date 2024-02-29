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

export const fetchExtensions = graphql(
	/* GraphQL */ `
		mutation fetchExtensions {
			fetchExtensions(input: {}) {
				extensions {
					...ExtensionTypeFragment
				}
			}
		}
	`,
	[ExtensionTypeFragment]
);

export const updateChapters = graphql(
	/* GraphQL */ `
		mutation updateChapters(
			$ids: [Int!]!
			$isBookmarked: Boolean
			$isRead: Boolean
			$lastPageRead: Int
		) {
			updateChapters(
				input: {
					ids: $ids
					patch: {
						isRead: $isRead
						isBookmarked: $isBookmarked
						lastPageRead: $lastPageRead
					}
				}
			) {
				chapters {
					isBookmarked
					isDownloaded
					isRead
					id
				}
			}
		}
	`,
	[]
);

export const updateChapter = graphql(
	/* GraphQL */ `
		mutation updateChapter(
			$isRead: Boolean = null
			$lastPageRead: Int!
			$id: Int!
		) {
			updateChapter(
				input: {
					id: $id
					patch: { isRead: $isRead, lastPageRead: $lastPageRead }
				}
			) {
				chapter {
					id
					isRead
					lastPageRead
				}
			}
		}
	`,
	[]
);

export const updateMangas = graphql(
	/* GraphQL */ `
		mutation updateMangas($ids: [Int!]!, $inLibrary: Boolean!) {
			updateMangas(input: { patch: { inLibrary: $inLibrary }, ids: $ids }) {
				mangas {
					...MangaTypeFragment
				}
			}
		}
	`,
	[MangaTypeFragment]
);

export const setGlobalMeta = graphql(
	/* GraphQL */ `
		mutation setGlobalMeta($key: String!, $value: String!) {
			setGlobalMeta(input: { meta: { key: $key, value: $value } }) {
				meta {
					value
					key
				}
			}
		}
	`,
	[]
);

export const deleteGlobalMeta = graphql(
	/* GraphQL */ `
		mutation deleteGlobalMeta($key: String!) {
			deleteGlobalMeta(input: { key: $key }) {
				clientMutationId
			}
		}
	`,
	[]
);

export const setMangaMeta = graphql(
	/* GraphQL */ `
		mutation setMangaMeta($value: String!, $id: Int!, $key: String!) {
			setMangaMeta(
				input: { meta: { key: $key, mangaId: $id, value: $value } }
			) {
				meta {
					manga {
						meta {
							key
							mangaId
							value
						}
						id
					}
				}
			}
		}
	`,
	[]
);

export const setSourceMeta = graphql(
	/* GraphQL */ `
		mutation setSourceMeta(
			$value: String!
			$sourceId: LongString!
			$key: String!
		) {
			setSourceMeta(
				input: { meta: { key: $key, sourceId: $sourceId, value: $value } }
			) {
				meta {
					source {
						...SourceTypeFragment
						isNsfw
						extension {
							pkgName
							repo
						}
					}
				}
			}
		}
	`,
	[SourceTypeFragment]
);

export const deleteSourceMeta = graphql(
	/* GraphQL */ `
		mutation deleteSourceMeta($key: String!, $sourceId: LongString!) {
			deleteSourceMeta(input: { key: $key, sourceId: $sourceId }) {
				source {
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

export const deleteMangaMeta = graphql(
	/* GraphQL */ `
		mutation deleteMangaMeta($id: Int!, $key: String!) {
			deleteMangaMeta(input: { key: $key, mangaId: $id }) {
				manga {
					id
					meta {
						key
						value
					}
				}
			}
		}
	`,
	[]
);

export const fetchMangaInfo = graphql(
	/* GraphQL */ `
		mutation fetchMangaInfo($id: Int!) {
			fetchManga(input: { id: $id }) {
				manga {
					...MangaTypeFragment
				}
			}
		}
	`,
	[MangaTypeFragment]
);

export const fetchMangaChapters = graphql(
	/* GraphQL */ `
		mutation fetchMangaChapters($id: Int!) {
			fetchChapters(input: { mangaId: $id }) {
				chapters {
					...ChapterTypeFragment
				}
			}
		}
	`,
	[ChapterTypeFragment]
);

export const updateExtension = graphql(
	/* GraphQL */ `
		mutation updateExtension(
			$pkgName: String!
			$install: Boolean = null
			$uninstall: Boolean = null
			$update: Boolean = null
		) {
			updateExtension(
				input: {
					id: $pkgName
					patch: { install: $install, uninstall: $uninstall, update: $update }
				}
			) {
				extension {
					...ExtensionTypeFragment
					source {
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
			}
		}
	`,
	[ExtensionTypeFragment, SourceTypeFragment]
);

export const fetchSourceManga = graphql(
	/* GraphQL */ `
		mutation fetchSourceManga(
			$page: Int!
			$source: LongString!
			$type: FetchSourceMangaType!
			$query: String
			$filters: [FilterChangeInput!]
		) {
			fetchSourceManga(
				input: {
					page: $page
					source: $source
					type: $type
					query: $query
					filters: $filters
				}
			) {
				hasNextPage
				mangas {
					id
					title
					inLibrary
					thumbnailUrl
				}
			}
		}
	`,
	[]
);

export const updateSourcePreference = graphql(
	/* GraphQL */ `
		mutation updateSourcePreference(
			$position: Int!
			$source: LongString!
			$multiSelectState: [String!] = null
			$listState: String = null
			$editTextState: String = null
			$switchState: Boolean = null
			$checkBoxState: Boolean = null
		) {
			updateSourcePreference(
				input: {
					change: {
						position: $position
						multiSelectState: $multiSelectState
						listState: $listState
						editTextState: $editTextState
						checkBoxState: $checkBoxState
						switchState: $switchState
					}
					source: $source
				}
			) {
				clientMutationId
				source {
					id
					preferences {
						... on CheckBoxPreference {
							CheckBoxCheckBoxCurrentValue: currentValue
							summary
							CheckBoxDefault: default
							key
							CheckBoxTitle: title
						}
						... on EditTextPreference {
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
							SwitchCurrentValue: currentValue
							summary
							key
							SwitchDefault: default
							SwitchTitle: title
						}
						... on MultiSelectListPreference {
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
							ListCurrentValue: currentValue
							ListDefault: default
							ListTitle: title
							summary
							key
							entryValues
							entries
						}
					}
				}
			}
		}
	`,
	[]
);

export const updateCategoryOrder = graphql(
	/* GraphQL */ `
		mutation updateCategoryOrder($id: Int!, $position: Int!) {
			updateCategoryOrder(input: { id: $id, position: $position }) {
				categories {
					...CategoryTypeFragment
				}
			}
		}
	`,
	[CategoryTypeFragment]
);

export const createCategory = graphql(
	/* GraphQL */ `
		mutation createCategory(
			$name: String!
			$default: Boolean!
			$includeInDownload: IncludeOrExclude!
			$includeInUpdate: IncludeOrExclude!
		) {
			createCategory(
				input: {
					name: $name
					default: $default
					includeInDownload: $includeInDownload
					includeInUpdate: $includeInUpdate
				}
			) {
				category {
					...CategoryTypeFragment
				}
			}
		}
	`,
	[CategoryTypeFragment]
);

export const deleteCategory = graphql(
	/* GraphQL */ `
		mutation deleteCategory($categoryId: Int!) {
			deleteCategory(input: { categoryId: $categoryId }) {
				category {
					...CategoryTypeFragment
				}
			}
		}
	`,
	[CategoryTypeFragment]
);

export const updateCategory = graphql(
	/* GraphQL */ `
		mutation updateCategory(
			$id: Int!
			$name: String = null
			$default: Boolean = null
			$includeInDownload: IncludeOrExclude = null
			$includeInUpdate: IncludeOrExclude = null
		) {
			updateCategory(
				input: {
					id: $id
					patch: {
						default: $default
						name: $name
						includeInDownload: $includeInDownload
						includeInUpdate: $includeInUpdate
					}
				}
			) {
				category {
					...CategoryTypeFragment
				}
			}
		}
	`,
	[CategoryTypeFragment]
);

export const updateMangasCategories = graphql(
	/* GraphQL */ `
		mutation updateMangasCategories(
			$addTo: [Int!] = null
			$clear: Boolean = null
			$id: [Int!]!
		) {
			updateMangasCategories(
				input: {
					ids: $id
					patch: { addToCategories: $addTo, clearCategories: $clear }
				}
			) {
				mangas {
					id
					categories {
						nodes {
							id
						}
					}
				}
			}
		}
	`,
	[]
);

export const updateMangaCategories = graphql(
	/* GraphQL */ `
		mutation updateMangaCategories(
			$addTo: [Int!] = null
			$clear: Boolean = null
			$id: Int!
		) {
			updateMangaCategories(
				input: {
					id: $id
					patch: { addToCategories: $addTo, clearCategories: $clear }
				}
			) {
				manga {
					id
					categories {
						nodes {
							id
						}
					}
				}
			}
		}
	`,
	[]
);

export const fetchChapterPages = graphql(
	/* GraphQL */ `
		mutation fetchChapterPages($chapterId: Int!) {
			fetchChapterPages(input: { chapterId: $chapterId }) {
				pages
			}
		}
	`,
	[]
);

export const ChaptersMigration = graphql(
	/* GraphQL */ `
		mutation ChaptersMigration(
			$ids: [Int!]!
			$lastPageRead: Int = null
			$isRead: Boolean = null
			$isBookmarked: Boolean = null
		) {
			updateChapters(
				input: {
					ids: $ids
					patch: {
						isBookmarked: $isBookmarked
						isRead: $isRead
						lastPageRead: $lastPageRead
					}
				}
			) {
				clientMutationId
			}
		}
	`,
	[]
);

export const fetchChaptersMigration = graphql(
	/* GraphQL */ `
		mutation fetchChaptersMigration($id: Int!) {
			fetchChapters(input: { mangaId: $id }) {
				chapters {
					id
					chapterNumber
				}
			}
		}
	`,
	[]
);

export const createBackup = graphql(
	/* GraphQL */ `
		mutation createBackup {
			createBackup {
				url
			}
		}
	`,
	[]
);

export const restoreBackup = graphql(
	/* GraphQL */ `
		mutation restoreBackup($backup: Upload!) {
			restoreBackup(input: { backup: $backup }) {
				status {
					mangaProgress
					state
					totalManga
				}
				id
			}
		}
	`,
	[]
);

export const clearDownloader = graphql(
	/* GraphQL */ `
		mutation clearDownloader {
			clearDownloader(input: { clientMutationId: "" }) {
				downloadStatus {
					state
				}
			}
		}
	`,
	[]
);

export const dequeueChapterDownloads = graphql(
	/* GraphQL */ `
		mutation dequeueChapterDownloads($ids: [Int!]!) {
			dequeueChapterDownloads(input: { ids: $ids }) {
				clientMutationId
			}
		}
	`,
	[]
);

export const enqueueChapterDownloads = graphql(
	/* GraphQL */ `
		mutation enqueueChapterDownloads($ids: [Int!]!) {
			enqueueChapterDownloads(input: { ids: $ids }) {
				clientMutationId
			}
		}
	`,
	[]
);

export const reorderChapterDownload = graphql(
	/* GraphQL */ `
		mutation reorderChapterDownload($chapterId: Int!, $to: Int!) {
			reorderChapterDownload(input: { chapterId: $chapterId, to: $to }) {
				clientMutationId
			}
		}
	`,
	[]
);

export const startDownloader = graphql(
	/* GraphQL */ `
		mutation startDownloader {
			startDownloader(input: { clientMutationId: "" }) {
				downloadStatus {
					state
				}
			}
		}
	`,
	[]
);

export const stopDownloader = graphql(
	/* GraphQL */ `
		mutation stopDownloader {
			stopDownloader(input: { clientMutationId: "" }) {
				downloadStatus {
					state
				}
			}
		}
	`,
	[]
);

export const deleteDownloadedChapter = graphql(
	/* GraphQL */ `
		mutation deleteDownloadedChapter($id: Int!) {
			deleteDownloadedChapter(input: { id: $id }) {
				chapters {
					...ChapterTypeFragment
				}
			}
		}
	`,
	[ChapterTypeFragment]
);

export const deleteDownloadedChapters = graphql(
	/* GraphQL */ `
		mutation deleteDownloadedChapters($ids: [Int!]!) {
			deleteDownloadedChapters(input: { ids: $ids }) {
				chapters {
					...ChapterTypeFragment
				}
			}
		}
	`,
	[ChapterTypeFragment]
);

export const clearCachedImages = graphql(
	/* GraphQL */ `
		mutation clearCachedImages {
			clearCachedImages(
				input: {
					cachedPages: true
					cachedThumbnails: true
					downloadedThumbnails: true
				}
			) {
				clientMutationId
			}
		}
	`,
	[]
);

export const installExternalExtension = graphql(
	/* GraphQL */ `
		mutation installExternalExtension($extensionFile: Upload!) {
			installExternalExtension(input: { extensionFile: $extensionFile }) {
				extension {
					...ExtensionTypeFragment
					source {
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
			}
		}
	`,
	[ExtensionTypeFragment, SourceTypeFragment]
);

export const loginTrackerOAuth = graphql(
	/* GraphQL */ `
		mutation loginTrackerOAuth($callbackUrl: String!, $trackerId: Int!) {
			loginTrackerOAuth(
				input: { callbackUrl: $callbackUrl, trackerId: $trackerId }
			) {
				isLoggedIn
				tracker {
					...TrackerTypeFragment
				}
			}
		}
	`,
	[TrackerTypeFragment]
);

export const logoutTracker = graphql(
	/* GraphQL */ `
		mutation logoutTracker($trackerId: Int!) {
			logoutTracker(input: { trackerId: $trackerId }) {
				isLoggedIn
				tracker {
					...TrackerTypeFragment
				}
			}
		}
	`,
	[TrackerTypeFragment]
);

export const loginTrackerCredentials = graphql(
	/* GraphQL */ `
		mutation loginTrackerCredentials(
			$password: String!
			$trackerId: Int!
			$username: String!
		) {
			loginTrackerCredentials(
				input: {
					password: $password
					trackerId: $trackerId
					username: $username
				}
			) {
				tracker {
					...TrackerTypeFragment
				}
			}
		}
	`,
	[TrackerTypeFragment]
);

export const bindTrack = graphql(
	/* GraphQL */ `
		mutation bindTrack(
			$mangaId: Int!
			$remoteId: LongString!
			$trackerId: Int!
		) {
			bindTrack(
				input: { mangaId: $mangaId, remoteId: $remoteId, trackerId: $trackerId }
			) {
				trackRecord {
					...TrackRecordTypeFragment
				}
			}
		}
	`,
	[TrackRecordTypeFragment]
);

export const updateTrack = graphql(
	/* GraphQL */ `
		mutation updateTrack($input: UpdateTrackInput!) {
			updateTrack(input: $input) {
				trackRecord {
					...TrackRecordTypeFragment
				}
			}
		}
	`,
	[TrackRecordTypeFragment]
);

export const setServerSettings = graphql(
	/* GraphQL */ `
		mutation setServerSettings($settings: PartialSettingsTypeInput = {}) {
			setSettings(input: { settings: $settings }) {
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
					excludeNotStarted
					excludeEntryWithUnreadChapters
					excludeUnreadChapters
					flareSolverrEnabled
					extensionRepos
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
		}
	`,
	[]
);