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
	unbindTrack,
	updateExtension,
	updateMangaCategories,
	updateMangas,
	updateMangasCategories,
	updateTrack
} from './Mutations';
import type { ResultOf, VariablesOf } from '$lib/gql/graphql';
import { get } from 'svelte/store';
import { lastFetched } from '../../../src/routes/(app)/browse/extensions/ExtensionsStores';
import { Meta } from '$lib/simpleStores';
import { introspection } from '../../graphql-env';
// import type { downloadChanged } from './Subscriptions';

const wsClient = createWSClient({
	url: window.location.origin.replace(/^http/, 'ws') + '/api/graphql'
});

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
				TrackerNodeList: () => null
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
					updateMangaCategories(result, _, cache, info) {
						const res = result as ResultOf<typeof updateMangaCategories>;
						const variables = info.variables as VariablesOf<
							typeof updateMangaCategories
						>;
						updateMangaCategoriesUpdater(res, variables, cache);
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
					// downloadChanged(result, _, cache, info) {
					// 	const res = result as ResultOf<typeof downloadChanged>;
					// 	const variables = info.variables as VariablesOf<typeof downloadChanged>;
					// 	downloadChangedUpdater(res, variables, cache);
					// }
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
						const unsubscribe = wsClient.subscribe(input, sink);
						return { unsubscribe };
					}
				};
			}
		})
	]
});

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
	if (!data) return;
	data.updateMangas.mangas.forEach((manga) => {
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
					categoryData.category.mangas.nodes.push(...data.updateMangas.mangas);
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

function updateMangaCategoriesUpdater(
	data: ResultOf<typeof updateMangaCategories> | undefined,
	vars: VariablesOf<typeof updateMangaCategories>,
	cache: Cache
) {
	if (!data?.updateMangaCategories.manga.categories.nodes) return;
	const nodes = data.updateMangaCategories.manga.categories.nodes;
	// update this mangas categories
	try {
		const manga = cache.readFragment(MangaTypeFragment, {
			id: vars.id
		} as ResultOf<typeof MangaTypeFragment>);
		if (!manga) throw new Error('Manga not found in cache');
		manga.categories.nodes = nodes;
		cache.writeFragment(MangaTypeFragment, manga, { id: vars.id });
	} catch {}

	// update the categories in library
	const dat = cache.readQuery({
		query: getManga,
		variables: { id: vars.id }
	});
	if (!dat) return;
	const oldNodes = dat.manga?.categories.nodes;
	if (!oldNodes) return;
	try {
		const currentManga: ResultOf<
			typeof getCategory
		>['category']['mangas']['nodes'][0] = {
			id: vars.id,
			title: dat.manga.title,
			inLibrary: dat.manga.inLibrary ?? true,
			thumbnailUrl: dat.manga.thumbnailUrl,
			unreadCount: dat.manga.unreadCount ?? 0,
			downloadCount: dat.manga.downloadCount ?? 0,
			latestFetchedChapter: dat.manga.latestFetchedChapter,
			lastReadChapter: dat.manga.lastReadChapter,
			latestUploadedChapter: dat.manga.latestUploadedChapter,
			trackRecords: dat.manga.trackRecords,
			chapters: dat.manga.chapters ?? {
				totalCount: 0
			}
		};
		// add to categories that now have it
		nodes.forEach((newNode) => {
			if (oldNodes.find((oldNode) => oldNode.id === newNode.id)) return;
			try {
				cache.updateQuery(
					{
						query: getCategory,
						variables: { id: newNode.id }
					},
					(Category) => {
						if (!Category) return Category;
						Category.category.mangas.nodes.push(currentManga);
						return Category;
					}
				);
			} catch {}
		});
		// add to 0 if now in default
		if (nodes.length === 0 && oldNodes.length > 0) {
			try {
				cache.updateQuery(
					{
						query: getCategory,
						variables: { id: 0 }
					},
					(Category) => {
						if (!Category) return Category;
						Category.category.mangas.nodes.push(currentManga);
						return Category;
					}
				);
			} catch {}
		}
	} catch {}
	//remove from categories that no longer have it
	oldNodes.forEach((oldNode) => {
		if (nodes.find((newNode) => oldNode.id === newNode.id)) return;
		try {
			cache.updateQuery(
				{
					query: getCategory,
					variables: { id: oldNode.id }
				},
				(Category) => {
					if (!Category) return Category;
					Category.category.mangas.nodes =
						Category.category.mangas.nodes.filter((e) => e.id !== vars.id);
					return Category;
				}
			);
		} catch {}
	});
	// remove from 0 if no longer in default
	if (oldNodes.length === 0 && nodes.length > 0) {
		try {
			cache.updateQuery(
				{
					query: getCategory,
					variables: { id: 0 }
				},
				(Category) => {
					if (!Category) return Category;
					Category.category.mangas.nodes =
						Category.category.mangas.nodes.filter((e) => e.id !== vars.id);
					return Category;
				}
			);
		} catch {}
	}
}

function deleteMangaMetaUpdater(
	data: ResultOf<typeof deleteMangaMeta> | undefined,
	vars: VariablesOf<typeof deleteMangaMeta>,
	cache: Cache
) {
	if (!data) return;
	const mangaData = cache.readQuery({
		query: getManga,
		variables: { id: vars.id }
	});
	if (!mangaData) return;
	const frag = mangaData.manga;
	if (!frag) return;
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
	if (!data) return;
	const mangaData = cache.readQuery({
		query: getManga,
		variables: { id: vars.id }
	});
	if (!mangaData) return;
	const frag = mangaData.manga;
	if (!frag) return;
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
	if (!data) return;
	cache.updateQuery(
		{
			query: metas
		},
		(metasData) => {
			if (!metasData) return metasData;
			metasData.metas.nodes =
				metasData?.metas.nodes.filter((e) => e.key !== vars.key) ?? [];
			metasData.metas.nodes.push(data.setGlobalMeta.meta);
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
	vars: VariablesOf<typeof createCategory>,
	cache: Cache
) {
	if (!data) return;
	cache.updateQuery(
		{
			query: getCategories,
			variables: {}
		},
		(categories) => {
			if (!categories) return categories;
			categories.categories.nodes.push(data.createCategory.category);
			return categories;
		}
	);
}

function fetchMangaChaptersUpdater(
	data: ResultOf<typeof fetchMangaChapters> | undefined,
	vars: VariablesOf<typeof fetchMangaChapters>,
	cache: Cache
) {
	if (!data) return;
	cache.updateQuery(
		{
			query: getManga,
			variables: { id: vars.id }
		},
		(manga) => {
			if (!manga) {
				return manga;
			}
			manga.manga.chapters.nodes = data.fetchChapters.chapters;
			manga.manga.chapters.totalCount = data.fetchChapters.chapters.length;
			return manga;
		}
	);
}

function fetchMangaInfoUpdater(
	data: ResultOf<typeof fetchMangaInfo> | undefined,
	vars: VariablesOf<typeof fetchMangaInfo>,
	cache: Cache
) {
	if (!data) return;
	cache.updateQuery(
		{
			query: getManga,
			variables: {
				id: vars.id
			}
		},
		(manga) => {
			if (!manga)
				return {
					manga: {
						__typename: 'MangaType',
						chapters: {
							__typename: 'ChapterNodeList',
							nodes: [],
							totalCount: 0
						},
						...data.fetchManga.manga
					}
				};
			manga.manga = {
				...manga.manga,
				...data.fetchManga.manga
			};
			return manga;
		}
	);
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
	if (!data) return;
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
	if (!data) return;
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
	if (!data) return;
	let filteredExtensions = data.fetchExtensions.extensions;
	if (!get(Meta).nsfw)
		filteredExtensions = filteredExtensions.filter((e) => !e.isNsfw);
	filteredExtensions.forEach((e) => {
		cache.writeFragment(ExtensionTypeFragment, e, {
			isNsfw: get(Meta).nsfw ? null : false
		});
	});
	lastFetched.set(new Date());
}

function updateMangasCategoriesUpdater(
	data: ResultOf<typeof updateMangasCategories> | undefined,
	variables: VariablesOf<typeof updateMangasCategories>,
	cache: Cache
) {
	if (!variables.addTo || !data) return;
	const mangaIds = data.updateMangasCategories.mangas.map((manga) => manga.id);
	const defaultCategory = variables.addTo?.length === 0 ? [0] : variables.addTo;
	mangaIds.forEach((id) => {
		try {
			const oldData = cache.readQuery({
				query: getManga,
				variables: { id }
			});
			if (!oldData) throw new Error();
			const manga = oldData.manga;
			manga.categories.nodes =
				variables.addTo?.map((categoryId) => ({
					id: categoryId
				})) ?? manga.categories.nodes;
			cache.writeFragment(MangaTypeFragment, manga, {
				id: manga.id
			});
		} catch (error) {}
	});

	const currentCategoryId = parseInt(
		new URLSearchParams(window.location.search).get('tab') ?? '0'
	);
	const currentCategoryData = cache.readQuery({
		query: getCategory,
		variables: { id: currentCategoryId }
	});
	if (!currentCategoryData) return;
	const mangas = currentCategoryData.category.mangas.nodes.filter((manga) =>
		mangaIds.includes(manga.id)
	);

	const categories = cache.readQuery({
		query: getCategories
	});
	categories?.categories.nodes.forEach((frag) => {
		const category = frag;
		try {
			const oldCategoryData = cache.readQuery({
				query: getCategory,
				variables: { id: category.id }
			});
			if (!oldCategoryData) return;
			if (defaultCategory.includes(category.id)) {
				const mangasToAdd: ResultOf<
					typeof getCategory
				>['category']['mangas']['nodes'] = [];
				mangas.forEach((manga) => {
					if (
						!oldCategoryData.category.mangas.nodes.find(
							(m) => m.id === manga.id
						)
					) {
						mangasToAdd.push(manga);
					}
				});
				oldCategoryData.category.mangas.nodes.push(...mangasToAdd);
			} else {
				oldCategoryData.category.mangas.nodes =
					oldCategoryData.category.mangas.nodes.filter(
						(m) => !mangaIds.includes(m.id)
					);
			}
			cache.updateQuery(
				{
					query: getCategory,
					variables: { id: category.id }
				},
				(oldCategoryData) => {
					if (!oldCategoryData) return oldCategoryData;
					if (defaultCategory.includes(category.id)) {
						const mangasToAdd: ResultOf<
							typeof getCategory
						>['category']['mangas']['nodes'] = [];
						mangas.forEach((manga) => {
							if (
								!oldCategoryData.category.mangas.nodes.find(
									(m) => m.id === manga.id
								)
							) {
								mangasToAdd.push(manga);
							}
						});
						oldCategoryData.category.mangas.nodes.push(...mangasToAdd);
					} else {
						oldCategoryData.category.mangas.nodes =
							oldCategoryData.category.mangas.nodes.filter(
								(m) => !mangaIds.includes(m.id)
							);
					}
					return oldCategoryData;
				}
			);
		} catch (error) {}
	});
}

function updateExtentionsList<T extends { pkgName: string }>(
	cache: Cache,
	extension: ResultOf<typeof updateExtension>['updateExtension']['extension'],
	ext: T
) {
	cache.updateQuery(
		{
			query: getExtensions,
			variables: { isNsfw: get(Meta).nsfw ? null : false }
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
	extension: ResultOf<typeof updateExtension>['updateExtension']['extension'],
	ext: T
) {
	cache.updateQuery(
		{
			query: getSources,
			variables: { isNsfw: get(Meta).nsfw ? null : false }
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
