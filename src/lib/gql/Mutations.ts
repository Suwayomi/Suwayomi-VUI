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
	`
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
	`
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
	`
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
	`
		mutation updateMangas($ids: [Int!]!, $inLibrary: Boolean!) {
			updateMangas(input: { patch: { inLibrary: $inLibrary }, ids: $ids }) {
				mangas {
					...MangaTypeFragment
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
					lastReadChapter {
						lastReadAt
						id
					}
					trackRecords {
						nodes {
							...TrackRecordTypeFragment
						}
					}
					chapters {
						totalCount
					}
				}
			}
		}
	`,
	[MangaTypeFragment]
);

export const setGlobalMeta = graphql(
	`
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
	`
		mutation deleteGlobalMeta($key: String!) {
			deleteGlobalMeta(input: { key: $key }) {
				clientMutationId
			}
		}
	`,
	[]
);

export const setMangaMeta = graphql(
	`
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
	`
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
	`
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
	`
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
	`
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
	`
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
	`
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
	`
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
	`
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
	`
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
	`
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
	`
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
	`
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
	`
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
	`
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
	`
		mutation fetchChapterPages($chapterId: Int!) {
			fetchChapterPages(input: { chapterId: $chapterId }) {
				pages
			}
		}
	`,
	[]
);

export const ChaptersMigration = graphql(
	`
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
	`
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
	`
		mutation createBackup {
			createBackup {
				url
			}
		}
	`,
	[]
);

export const restoreBackup = graphql(
	`
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
	`
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
	`
		mutation dequeueChapterDownloads($ids: [Int!]!) {
			dequeueChapterDownloads(input: { ids: $ids }) {
				clientMutationId
			}
		}
	`,
	[]
);

export const enqueueChapterDownloads = graphql(
	`
		mutation enqueueChapterDownloads($ids: [Int!]!) {
			enqueueChapterDownloads(input: { ids: $ids }) {
				clientMutationId
			}
		}
	`,
	[]
);

export const reorderChapterDownload = graphql(
	`
		mutation reorderChapterDownload($chapterId: Int!, $to: Int!) {
			reorderChapterDownload(input: { chapterId: $chapterId, to: $to }) {
				clientMutationId
			}
		}
	`,
	[]
);

export const startDownloader = graphql(
	`
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
	`
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
	`
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
	`
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
	`
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
	`
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
	`
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
	`
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
	`
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
	`
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
	`
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
	`
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

export const updateWebUI = graphql(
	`
		mutation updateWebUI {
			updateWebUI(input: {}) {
				updateStatus {
					progress
					state
					info {
						channel
						tag
					}
				}
			}
		}
	`,
	[]
);
