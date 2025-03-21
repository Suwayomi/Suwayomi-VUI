// Copyright (c) 2024 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { Client, fetchExchange, subscriptionExchange } from '@urql/svelte';
import { cacheExchange, type Cache } from '@urql/exchange-graphcache';
import { createClient as createWSClient } from 'graphql-ws';
import {
	getCategories,
	getCategory,
	getExtensions,
	getManga,
	getSingleChapter,
	getSources,
	metas,
	serverSettings
} from './Queries';
import {
	ChapterTypeFragment,
	ExtensionTypeFragment,
	MangaTypeFragment,
	TrackRecordTypeFragment
} from './Fragments';
import type {
	bindTrack,
	createCategory,
	deleteGlobalMeta,
	deleteMangaMeta,
	fetchExtensions,
	fetchMangaChapters,
	fetchMangaInfo,
	fetchTrack,
	installExternalExtension,
	setGlobalMeta,
	setMangaMeta,
	setServerSettings,
	trackProgress,
	unbindTrack,
	updateExtension,
	updateMangas,
	updateMangasCategories,
	updateTrack
} from './Mutations';
import type { ResultOf, VariablesOf } from '$lib/gql/graphql';
import { introspection } from '../../graphql-env';
import { gmState } from '$lib/simpleStores.svelte';
import type { DownloadChanged } from './Subscriptions';

export const client = new Client({
	url: '/api/graphql',
	exchanges: [
		cacheExchange({
			keys: {
				MangaNodeList: () => null,
				CategoryNodeList: () => null,
				ChapterNodeList: () => null,
				ExtensionNodeList: () => null,
				SourceMetaType: () => null,
				SourceNodeList: () => null,
				SettingsType: () => null,
				GlobalMetaType: () => null,
				GlobalMetaNodeList: () => null,
				MangaMetaType: () => null,
				TrackRecordNodeList: () => null,
				TriStateFilter: () => null,
				TextFilter: () => null,
				ListPreference: () => null,
				SwitchPreference: () => null,
				MultiSelectListPreference: () => null,
				EditTextPreference: () => null,
				CheckBoxPreference: () => null,
				SeparatorFilter: () => null,
				HeaderFilter: () => null,
				SortFilter: () => null,
				SortSelection: () => null,
				CheckBoxFilter: () => null,
				GroupFilter: () => null,
				SelectFilter: () => null,
				SearchTrackerPayload: () => null,
				TrackSearchType: (e) => e.remoteId!.toString(),
				TrackRecordType: (e) => e.id!.toString(),
				ExtensionType: (e) =>
					(e.pkgName as string) + (e.versionName as string) + e.repo,
				TrackStatusType: () => null,
				TrackerNodeList: () => null,
				CategoryMetaType: (e) =>
					(e.categoryId as number).toString() + (e.key as string)
			},
			updates: {
				Mutation: {
					updateMangasCategories(result, _, cache, info) {
						const res = result as ResultOf<typeof updateMangasCategories>;
						const variables = info.variables as VariablesOf<
							typeof updateMangasCategories
						>;
						updateMangasCategoriesUpdater(res, variables, cache);
					},
					fetchExtensions(result, _, cache, info) {
						const res = result as ResultOf<typeof fetchExtensions>;
						const variables = info.variables as VariablesOf<
							typeof fetchExtensions
						>;
						fetchExtensionsUpdater(res, variables, cache);
					},
					installExternalExtension(result, _, cache, info) {
						const res = result as ResultOf<typeof installExternalExtension>;
						const variables = info.variables as VariablesOf<
							typeof installExternalExtension
						>;
						installExternalExtensionUpdater(res, variables, cache);
					},
					updateExtension(result, _, cache, info) {
						const res = result as ResultOf<typeof updateExtension>;
						const variables = info.variables as VariablesOf<
							typeof updateExtension
						>;
						updateExtensionUpdater(res, variables, cache);
					},
					updateTrack(result, _, cache, info) {
						const res = result as ResultOf<typeof updateTrack>;
						const variables = info.variables as VariablesOf<typeof updateTrack>;
						updateTrackUpdater(res, variables, cache);
					},
					bindTrack(result, _, cache, info) {
						const res = result as ResultOf<typeof bindTrack>;
						const variables = info.variables as VariablesOf<typeof bindTrack>;
						bindTrackUpdater(res, variables, cache);
					},
					fetchManga(result, _, cache, info) {
						const res = result as ResultOf<typeof fetchMangaInfo>;
						const variables = info.variables as VariablesOf<
							typeof fetchMangaInfo
						>;
						fetchMangaInfoUpdater(res, variables, cache);
					},
					fetchChapters(result, _, cache, info) {
						const res = result as ResultOf<typeof fetchMangaChapters>;
						const variables = info.variables as VariablesOf<
							typeof fetchMangaChapters
						>;
						fetchMangaChaptersUpdater(res, variables, cache);
					},
					createCategory(result, _, cache, info) {
						const res = result as ResultOf<typeof createCategory>;
						const variables = info.variables as VariablesOf<
							typeof createCategory
						>;
						createCategoryUpdater(res, variables, cache);
					},
					setSettings(result, _, cache, info) {
						const res = result as ResultOf<typeof setServerSettings>;
						const variables = info.variables as VariablesOf<
							typeof setServerSettings
						>;
						setServerSettingsUpdater(res, variables, cache);
					},
					setGlobalMeta(result, _, cache, info) {
						const res = result as ResultOf<typeof setGlobalMeta>;
						const variables = info.variables as VariablesOf<
							typeof setGlobalMeta
						>;
						setGlobalMetaUpdater(res, variables, cache);
					},
					deleteGlobalMeta(result, _, cache, info) {
						const res = result as ResultOf<typeof deleteGlobalMeta>;
						const variables = info.variables as VariablesOf<
							typeof deleteGlobalMeta
						>;
						deleteGlobalMetaUpdater(res, variables, cache);
					},
					setMangaMeta(result, _, cache, info) {
						const res = result as ResultOf<typeof setMangaMeta>;
						const variables = info.variables as VariablesOf<
							typeof setMangaMeta
						>;
						setMangaMetaUpdater(res, variables, cache);
					},
					deleteMangaMeta(result, _, cache, info) {
						const res = result as ResultOf<typeof deleteMangaMeta>;
						const variables = info.variables as VariablesOf<
							typeof deleteMangaMeta
						>;
						deleteMangaMetaUpdater(res, variables, cache);
					},
					updateMangas(result, _, cache, info) {
						const res = result as ResultOf<typeof updateMangas>;
						const variables = info.variables as VariablesOf<
							typeof updateMangas
						>;
						updateMangasUpdater(res, variables, cache);
					},
					fetchTrack(result, _, cache, info) {
						const res = result as ResultOf<typeof fetchTrack>;
						const variables = info.variables as VariablesOf<typeof fetchTrack>;
						fetchTrackUpdater(res, variables, cache);
					},
					unbindTrack(result, _, cache, info) {
						const res = result as ResultOf<typeof unbindTrack>;
						const variables = info.variables as VariablesOf<typeof unbindTrack>;
						unbindTrackUpdater(res, variables, cache);
					},
					trackProgress(result, _, cache, info) {
						const res = result as ResultOf<typeof trackProgress>;
						const variables = info.variables as VariablesOf<
							typeof trackProgress
						>;
						trackProgressUpdater(res, variables, cache);
					}
				},
				Query: {
					chapter(result, _, cache, info) {
						const res = result as ResultOf<typeof getSingleChapter>;
						const variables = info.variables as VariablesOf<
							typeof getSingleChapter
						>;
						getSingleChapterUpdater(res, variables, cache);
					}
				},
				Subscription: {
					downloadStatusChanged(result, _, cache, info) {
						const res = result as ResultOf<typeof DownloadChanged>;
						const variables = info.variables as VariablesOf<
							typeof DownloadChanged
						>;
						newDownloadChangedUpdater(res, variables, cache);
					}
				}
			},
			schema: introspection
		}),
		fetchExchange,
		subscriptionExchange({
			forwardSubscription(request) {
				const input = { ...request, query: request.query || '' };
				return {
					subscribe(sink) {
						if (typeof window !== 'undefined') {
							const wsClient = createWSClient({
								url:
									window.location.origin.replace(/^http/, 'ws') + '/api/graphql'
							});
							const unsubscribe = wsClient.subscribe(input, sink);
							return {
								unsubscribe
							};
						}
						return { unsubscribe: () => {} };
					}
				};
			}
		})
	]
});

function newDownloadChangedUpdater(
	data: ResultOf<typeof DownloadChanged> | undefined,
	_vars: VariablesOf<typeof DownloadChanged>,
	cache: Cache
) {
	if (!data?.downloadStatusChanged) return;
	if (!data.downloadStatusChanged.updates) return;

	data.downloadStatusChanged.updates.forEach((update) => {
		if (update.download.state !== 'FINISHED') return;
		const chapter = cache.readFragment(ChapterTypeFragment, {
			id: update.download.chapter.id
		} as ResultOf<typeof ChapterTypeFragment>);
		if (!chapter) return;
		chapter.isDownloaded = true;
		cache.writeFragment(ChapterTypeFragment, chapter, {
			id: update.download.chapter.id
		});

		const manga = cache.readFragment(MangaTypeFragment, {
			id: update.download.manga.id
		} as ResultOf<typeof MangaTypeFragment>);
		if (!manga) return;
		manga.downloadCount++;
		cache.writeFragment(MangaTypeFragment, manga, {
			id: update.download.manga.id
		});
	});
}

function trackProgressUpdater(
	data: ResultOf<typeof trackProgress> | undefined,
	_vars: VariablesOf<typeof trackProgress>,
	cache: Cache
) {
	if (!data?.trackProgress) return;
	data.trackProgress.trackRecords.forEach((record) => {
		cache.writeFragment(TrackRecordTypeFragment, record, {
			id: record.id
		});
	});
}

function unbindTrackUpdater(
	data: ResultOf<typeof unbindTrack> | undefined,
	vars: VariablesOf<typeof unbindTrack>,
	cache: Cache
) {
	if (!data) return;
	const trak = cache.readFragment(TrackRecordTypeFragment, {
		id: vars.recordId
	} as ResultOf<typeof TrackRecordTypeFragment>);
	if (!trak) return;
	const manga = cache.readFragment(MangaTypeFragment, {
		id: trak.mangaId
	} as ResultOf<typeof MangaTypeFragment>);
	if (!manga) return;

	manga.trackRecords.nodes = manga.trackRecords.nodes.filter(
		(record) => record.id !== vars.recordId
	);
	cache.writeFragment(MangaTypeFragment, manga, {
		id: trak.mangaId
	});
}

function fetchTrackUpdater(
	data: ResultOf<typeof fetchTrack> | undefined,
	vars: VariablesOf<typeof fetchTrack>,
	cache: Cache
) {
	if (!data) return;

	let trak = cache.readFragment(TrackRecordTypeFragment, {
		id: vars.recordId
	} as ResultOf<typeof TrackRecordTypeFragment>);
	if (!trak) return;

	trak = {
		...trak,
		...data.fetchTrack.trackRecord
	};

	cache.writeFragment(TrackRecordTypeFragment, trak, {
		id: vars.recordId
	});
}

function updateMangasUpdater(
	data: ResultOf<typeof updateMangas> | undefined,
	vars: VariablesOf<typeof updateMangas>,
	cache: Cache
) {
	if (!data?.updateMangas) return;
	const updateMangas = data.updateMangas;
	updateMangas.mangas.forEach((manga) => {
		(manga.categories.nodes.length
			? manga.categories.nodes
			: [{ id: 0 }]
		).forEach((category) => {
			cache.updateQuery(
				{
					query: getCategory,
					variables: {
						id: category.id
					}
				},
				(categoryData) => {
					if (!categoryData) return categoryData;
					categoryData.category.mangas.nodes =
						categoryData.category.mangas.nodes.filter(
							(m) => !vars.ids.includes(m.id)
						);
					categoryData.category.mangas.nodes.push(...updateMangas.mangas);
					return categoryData;
				}
			);
		});
	});
}

function getSingleChapterUpdater(
	data: ResultOf<typeof getSingleChapter> | undefined,
	vars: VariablesOf<typeof getSingleChapter>,
	cache: Cache
) {
	if (!data) return;

	cache.writeFragment(ChapterTypeFragment, data.chapter, {
		id: vars.id
	});
}

function deleteMangaMetaUpdater(
	data: ResultOf<typeof deleteMangaMeta> | undefined,
	vars: VariablesOf<typeof deleteMangaMeta>,
	cache: Cache
) {
	if (!data?.deleteMangaMeta) return;
	const mangaData = cache.readQuery({
		query: getManga,
		variables: { id: vars.id }
	});
	if (!mangaData?.manga) return;
	const frag = mangaData.manga;
	frag.meta = data.deleteMangaMeta.manga.meta;
	cache.writeFragment(MangaTypeFragment, frag, {
		id: frag.id
	});
}

function setMangaMetaUpdater(
	data: ResultOf<typeof setMangaMeta> | undefined,
	vars: VariablesOf<typeof setMangaMeta>,
	cache: Cache
) {
	if (!data?.setMangaMeta) return;
	const mangaData = cache.readQuery({
		query: getManga,
		variables: { id: vars.id }
	});
	if (!mangaData?.manga) return;
	const frag = mangaData.manga;
	frag.meta = data.setMangaMeta.meta.manga.meta;
	cache.writeFragment(MangaTypeFragment, frag, {
		id: frag.id
	});
}

function deleteGlobalMetaUpdater(
	data: ResultOf<typeof deleteGlobalMeta> | undefined,
	vars: VariablesOf<typeof deleteGlobalMeta>,
	cache: Cache
) {
	if (!data) return;
	cache.updateQuery(
		{
			query: metas
		},
		(metasData) => {
			if (!metasData) return metasData;
			metasData.metas.nodes =
				metasData.metas.nodes.filter((e) => e.key !== vars.key) ?? [];
			return metasData;
		}
	);
}

function setGlobalMetaUpdater(
	data: ResultOf<typeof setGlobalMeta> | undefined,
	vars: VariablesOf<typeof setGlobalMeta>,
	cache: Cache
) {
	if (!data?.setGlobalMeta) return;
	const setGlobalMeta = data.setGlobalMeta;
	cache.updateQuery(
		{
			query: metas
		},
		(metasData) => {
			if (!metasData) return metasData;
			metasData.metas.nodes =
				metasData?.metas.nodes.filter((e) => e.key !== vars.key) ?? [];
			metasData.metas.nodes.push(setGlobalMeta.meta);
			return metasData;
		}
	);
}

function setServerSettingsUpdater(
	data: ResultOf<typeof setServerSettings> | undefined,
	_vars: VariablesOf<typeof setServerSettings>,
	cache: Cache
) {
	if (!data) return;
	cache.updateQuery(
		{
			query: serverSettings
		},
		() => {
			return data.setSettings;
		}
	);
}

function createCategoryUpdater(
	data: ResultOf<typeof createCategory> | undefined,
	_vars: VariablesOf<typeof createCategory>,
	cache: Cache
) {
	if (!data?.createCategory) return;
	const createCategory = data.createCategory;
	cache.updateQuery(
		{
			query: getCategories,
			variables: {}
		},
		(categories) => {
			if (!categories) return categories;
			categories.categories.nodes.push(createCategory.category);
			return categories;
		}
	);
}

function fetchMangaChaptersUpdater(
	data: ResultOf<typeof fetchMangaChapters> | undefined,
	vars: VariablesOf<typeof fetchMangaChapters>,
	cache: Cache
) {
	if (!data?.fetchChapters) return;
	const fetchChapters = data.fetchChapters;
	cache.updateQuery(
		{
			query: getManga,
			variables: { id: vars.id }
		},
		(manga) => {
			if (!manga?.manga) {
				return manga;
			}
			manga.manga.chapters.nodes = fetchChapters.chapters;
			manga.manga.chapters.totalCount = fetchChapters.chapters.length;
			return manga;
		}
	);
}

function fetchMangaInfoUpdater(
	data: ResultOf<typeof fetchMangaInfo> | undefined,
	vars: VariablesOf<typeof fetchMangaInfo>,
	cache: Cache
) {
	if (!data?.fetchManga) return;
	const fetchManga = data.fetchManga;
	cache.writeFragment(MangaTypeFragment, fetchManga.manga, {
		id: vars.id
	});
}

function bindTrackUpdater(
	data: ResultOf<typeof bindTrack> | undefined,
	_vars: VariablesOf<typeof bindTrack>,
	cache: Cache
) {
	if (!data) return;

	const trackRecord = data.bindTrack.trackRecord;
	if (!trackRecord) return;

	const frag = cache.readFragment(MangaTypeFragment, {
		id: trackRecord.mangaId
	} as ResultOf<typeof MangaTypeFragment>);
	if (!frag) return;

	frag.trackRecords.nodes = frag.trackRecords.nodes.filter(
		(ee) => ee.id !== trackRecord.id
	);
	frag.trackRecords.nodes.push(data.bindTrack.trackRecord);
	cache.writeFragment(MangaTypeFragment, frag, {
		id: frag.id
	});
}

function updateTrackUpdater(
	data: ResultOf<typeof updateTrack> | undefined,
	vars: VariablesOf<typeof updateTrack>,
	cache: Cache
) {
	if (!data) return;

	const trackRecord = cache.readFragment(TrackRecordTypeFragment, {
		id: vars.input.recordId
	} as ResultOf<typeof TrackRecordTypeFragment>);
	if (!trackRecord) return;

	const frag = cache.readFragment(MangaTypeFragment, {
		id: trackRecord.mangaId
	} as ResultOf<typeof MangaTypeFragment>);
	if (!frag) return;

	if (!data.updateTrack.trackRecord) return;
	// if (!data.updateTrack.trackRecord) {
	// 	frag.trackRecords.nodes = frag.trackRecords.nodes.filter(
	// 		(ee) => ee.id !== trackRecord.id
	// 	);
	// } else {
	const ind = frag.trackRecords.nodes.findIndex((e) => e.id === trackRecord.id);
	frag.trackRecords.nodes[ind] = data.updateTrack.trackRecord;
	// }

	cache.writeFragment(MangaTypeFragment, frag, {
		id: frag.id
	});
}

function updateExtensionUpdater(
	data: ResultOf<typeof updateExtension> | undefined,
	vars: VariablesOf<typeof updateExtension>,
	cache: Cache
) {
	if (!data?.updateExtension) return;
	try {
		updateExtentionsList(cache, data.updateExtension.extension, vars);
	} catch {}
	try {
		updateSourcesList(cache, data.updateExtension.extension, vars);
	} catch {}
}

function installExternalExtensionUpdater(
	data: ResultOf<typeof installExternalExtension> | undefined,
	_: VariablesOf<typeof installExternalExtension>,
	cache: Cache
) {
	if (!data?.installExternalExtension) return;
	try {
		updateExtentionsList(
			cache,
			data.installExternalExtension.extension,
			data.installExternalExtension.extension
		);
	} catch {}
	try {
		updateSourcesList(
			cache,
			data.installExternalExtension.extension,
			data.installExternalExtension.extension
		);
	} catch {}
}

function fetchExtensionsUpdater(
	data: ResultOf<typeof fetchExtensions> | undefined,
	_: VariablesOf<typeof fetchExtensions>,
	cache: Cache
) {
	if (!data?.fetchExtensions) return;
	let filteredExtensions = data.fetchExtensions.extensions;
	import('$lib/simpleStores.svelte').then((mod) => {
		const gmState = mod.gmState;
		if (!gmState.value.nsfw)
			filteredExtensions = filteredExtensions.filter((e) => !e.isNsfw);
		filteredExtensions.forEach((e) => {
			cache.writeFragment(ExtensionTypeFragment, e, {
				isNsfw: gmState.value.nsfw ? null : false
			});
		});
		import('../../../src/routes/(app)/browse/extensions/ExtensionsStores').then(
			(mod) => {
				mod.lastFetched.value = new Date();
			}
		);
	});
}

function updateMangasCategoriesUpdater(
	data: ResultOf<typeof updateMangasCategories> | undefined,
	variables: VariablesOf<typeof updateMangasCategories>,
	cache: Cache
) {
	if (!variables.addTo || !data?.updateMangasCategories) return;
	const mangaIds = data.updateMangasCategories.mangas.map((manga) => manga.id);
	mangaIds.forEach((id) => {
		cache.updateQuery({ query: getManga, variables: { id } }, (manga) => {
			if (!manga) return manga;
			manga.manga.categories.nodes = manga.manga.categories.nodes.filter(
				(ee) => !variables.removeFrom?.includes(ee.id)
			);
			variables.addTo?.forEach((categoryId) => {
				if (manga.manga.categories.nodes.find((ee) => ee.id === categoryId))
					return;
				manga.manga.categories.nodes.push({
					id: categoryId
				});
			});
			return manga;
		});
	});

	const categories = cache.readQuery({
		query: getCategories
	});
	if (!categories) return;
	categories.categories.nodes.forEach((category) => {
		const mangas = variables.id
			.map((id) => {
				const manga = cache.readFragment(MangaTypeFragment, {
					id
				} as ResultOf<typeof MangaTypeFragment>);
				return manga;
			})
			.filter((manga) => manga !== null);

		mangas.forEach((manga) => {
			const addto = variables.addTo ?? [];

			if (manga.categories.nodes.length === 0) {
				addto.push(0);
			}

			addto.forEach((cat) => {
				cache.updateQuery(
					{
						query: getCategory,
						variables: { id: cat }
					},
					(data) => {
						if (!data) return data;
						data.category.mangas.nodes = data.category.mangas.nodes.filter(
							(e) => e.id !== manga.id
						);
						data.category.mangas.nodes.push(manga);
						return data;
					}
				);
			});

			if (
				variables.removeFrom?.includes(category.id) ||
				(category.id === 0 && manga.categories.nodes.length !== 0) ||
				(variables.clear &&
					(!manga.categories.nodes.find((e) => e.id === category.id) ||
						(manga.categories.nodes.length === 0 && category.id === 0)))
			) {
				cache.updateQuery(
					{
						query: getCategory,
						variables: { id: category.id }
					},
					(data) => {
						if (!data) return data;
						data.category.mangas.nodes = data.category.mangas.nodes.filter(
							(e) => e.id !== manga.id
						);
						return data;
					}
				);
			}
		});
	});
}

function updateExtentionsList<T extends { pkgName: string }>(
	cache: Cache,
	extension: NonNullable<
		ResultOf<typeof updateExtension>['updateExtension']
	>['extension'],
	ext: T
) {
	cache.updateQuery(
		{
			query: getExtensions,
			variables: { isNsfw: gmState.value.nsfw ? null : false }
		},
		(extensionsData) => {
			if (!extensionsData) return extensionsData;
			if (extension) {
				const index = extensionsData.extensions.nodes.findIndex(
					(extension) => extension.pkgName === ext.pkgName
				);
				if (index) extensionsData.extensions.nodes[index] = extension;
				else extensionsData.extensions.nodes.push(extension);
			}
			return extensionsData;
		}
	);
}

function updateSourcesList<T extends { pkgName: string }>(
	cache: Cache,
	extension: NonNullable<
		ResultOf<typeof updateExtension>['updateExtension']
	>['extension'],
	ext: T
) {
	cache.updateQuery(
		{
			query: getSources,
			variables: { isNsfw: gmState.value.nsfw ? null : false }
		},
		(sourcesData) => {
			if (!sourcesData) return sourcesData;
			if (!extension) return sourcesData;

			if (extension?.isInstalled) {
				extension.source.nodes.forEach((source) => {
					if (
						!sourcesData.sources.nodes.find(
							(existingSource) => existingSource.id === source.id
						)
					) {
						sourcesData.sources.nodes.push(source);
					}
				});
			} else {
				sourcesData.sources.nodes = sourcesData.sources.nodes.filter(
					(existingSource) => existingSource.extension.pkgName !== ext.pkgName
				);
			}
			return sourcesData;
		}
	);
}
