// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { localStorageStore } from '@skeletonlabs/skeleton';
import * as devalue from 'devalue';
import {
	ExtensionsDoc,
	SourcesDoc,
	type ExtensionsQuery,
	type FetchExtensionsMutation,
	type InstallExternalExtensionMutation,
	type SourcesQuery,
	type UpdateExtensionMutation
} from '$lib/generated';
import { Meta } from '$lib/simpleStores';
import type { ApolloCache, FetchResult } from '@apollo/client';
import { get } from 'svelte/store';

export const lastFetched = localStorageStore<Date>('lastFetchedExtensions', new Date(0), {
	serializer: devalue
});

export const langFilter = localStorageStore<Set<string>>(
	'ExtensionsLangFilter',
	new Set(['all', 'en']),
	{
		serializer: devalue
	}
);

export function fetchExtensionsUpdater(
	cache: ApolloCache<unknown>,
	{ data }: FetchResult<FetchExtensionsMutation>
) {
	if (!data) return;
	let filteredExtensions = data.fetchExtensions.extensions;
	if (!get(Meta).nsfw) filteredExtensions = filteredExtensions.filter((e) => !e.isNsfw);
	cache.writeQuery({
		query: ExtensionsDoc,
		data: { extensions: { nodes: filteredExtensions } },
		variables: { isNsfw: get(Meta).nsfw ? null : false }
	});
	lastFetched.set(new Date());
}

function updateExtentionsList(
	cache: ApolloCache<unknown>,
	extension: UpdateExtensionMutation['updateExtension']['extension'],
	ext: ExtensionsQuery['extensions']['nodes'][0]
) {
	const extensionsData = structuredClone(
		cache.readQuery<ExtensionsQuery>({
			query: ExtensionsDoc,
			variables: { isNsfw: get(Meta).nsfw ? null : false }
		})
	);
	if (!extensionsData) throw new Error('failed to read extensions');
	const { extensions } = extensionsData;

	if (extension) {
		const index = extensions.nodes.findIndex(
			(extension) => extension.pkgName === ext.pkgName && extension.repo === ext.repo
		);
		if (index) extensions.nodes[index] = extension;
		else extensions.nodes.push(extension);
	}

	cache.writeQuery({
		query: ExtensionsDoc,
		data: { extensions },
		variables: { isNsfw: get(Meta).nsfw ? null : false }
	});
}

function updateSourcesList(
	cache: ApolloCache<unknown>,
	extension: UpdateExtensionMutation['updateExtension']['extension'],
	ext: ExtensionsQuery['extensions']['nodes'][0]
) {
	const sourcesData = structuredClone(
		cache.readQuery<SourcesQuery>({
			query: SourcesDoc,
			variables: { isNsfw: get(Meta).nsfw ? null : false }
		})
	);
	if (!sourcesData) throw new Error('failed to read sources');
	const { sources } = sourcesData;

	if (extension?.isInstalled) {
		extension.source.nodes.forEach((source) => {
			if (!sources.nodes.find((existingSource) => existingSource.id === source.id)) {
				sources.nodes.push(source);
			}
		});
	} else {
		sources.nodes = sources.nodes.filter(
			(existingSource) =>
				existingSource.extension.repo !== ext.repo ||
				existingSource.extension.pkgName !== ext.pkgName
		);
	}

	cache.writeQuery({
		query: SourcesDoc,
		variables: { isNsfw: get(Meta).nsfw ? null : false },
		data: { sources }
	});
}

export function UpdateExtensionUpdater(
	cache: ApolloCache<unknown>,
	{ data }: Omit<FetchResult<UpdateExtensionMutation>, 'context'>,
	ext: ExtensionsQuery['extensions']['nodes'][0]
): void {
	if (!data) return;
	try {
		updateExtentionsList(cache, data.updateExtension.extension, ext);
	} catch {}
	try {
		updateSourcesList(cache, data.updateExtension.extension, ext);
	} catch {}
}

export function installExternalExtensionUpdater(
	cache: ApolloCache<unknown>,
	{ data }: FetchResult<InstallExternalExtensionMutation>
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
