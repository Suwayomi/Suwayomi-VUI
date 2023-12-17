<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { AppBarData } from '$lib/MountTitleAction';
	import {
		ExtensionsDoc,
		fetchExtensions,
		extensions as getExtensions,
		type Exact,
		type ExtensionsQuery,
		type FetchExtensionsMutation,
		type InputMaybe
	} from '$lib/generated';
	import { ErrorHelp, Partition, groupBy } from '$lib/util';
	import type { ApolloQueryResult, ObservableQuery } from '@apollo/client';
	import type { Readable } from 'svelte/motion';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import Nav from '../Nav.svelte';
	import { FindLangName } from '../languages';
	import ExtensionsActions from './ExtensionsActions.svelte';
	import { langFilter, lastFetched } from './ExtensionsStores';
	import ExtensionCard from './ExtensionCard.svelte';
	import { Meta } from '$lib/simpleStores';
	import type { ApolloCache, FetchResult } from '@apollo/client';

	const query = queryParam('q', ssp.string(), { pushHistory: false });
	type TExtension = ExtensionsQuery['extensions']['nodes'][0];

	let extensions: Readable<
		ApolloQueryResult<ExtensionsQuery> & {
			query: ObservableQuery<
				ExtensionsQuery,
				Exact<{
					isNsfw?: InputMaybe<boolean> | undefined;
				}>
			>;
		}
	>;

	checkIfFetchNewExtensions();

	async function checkIfFetchNewExtensions() {
		if ($lastFetched.valueOf() + 8.64e7 < Date.now().valueOf()) {
			await ErrorHelp(
				'failed to fetch new extensions',
				fetchExtensions({
					update: fetchExtensionsUpdater
				})
			);
		}
		extensions = getExtensions({ variables: { isNsfw: $Meta.nsfw ? null : false } });
	}

	function fetchExtensionsUpdater(
		cache: ApolloCache<unknown>,
		{ data }: FetchResult<FetchExtensionsMutation>
	) {
		if (!data) return;
		let filteredExtensions = data.fetchExtensions.extensions;
		if (!$Meta.nsfw) filteredExtensions = filteredExtensions.filter((e) => !e.isNsfw);
		cache.writeQuery({
			query: ExtensionsDoc,
			data: { extensions: { nodes: filteredExtensions } },
			variables: { isNsfw: $Meta.nsfw ? null : false }
		});
		$lastFetched = new Date();
	}

	$: langs = getLangs($extensions?.data);
	$: AppBarData('Extensions', { component: ExtensionsActions, props: { langs } });

	function getLangs(extensionsQuery: ExtensionsQuery | undefined) {
		if (extensionsQuery?.extensions?.nodes) {
			return extensionsQuery.extensions.nodes.reduce((accumulatedSet, currentExtension) => {
				if (!accumulatedSet.has(currentExtension.lang)) {
					accumulatedSet.add(currentExtension.lang);
				}
				return accumulatedSet;
			}, new Set<string>());
		}
		return new Set<string>();
	}

	$: filteredExtensions = $extensions?.data?.extensions?.nodes.filter((ele) => {
		if (!$langFilter.has(ele.lang)) return false;
		if ($query !== '' && $query !== null) {
			return ele.name.toLowerCase().includes($query.toLocaleLowerCase());
		}
		return true;
	}) as TExtension[] | undefined;

	$: groupExtensions = groupSources(filteredExtensions, langs);

	function groupSources(
		filteredExtensions: TExtension[] | undefined,
		languages: Set<string>
	): [string, TExtension[]][] | undefined {
		if (!filteredExtensions) return undefined;

		const [extensionsWithUpdate, extensionsWithoutUpdate] = Partition(
			filteredExtensions,
			(extension) => extension.hasUpdate
		);
		const [installedExtensions, notInstalledExtensions] = Partition(
			extensionsWithoutUpdate,
			(extension) => extension.isInstalled
		);

		const always = [
			['Update Pending', extensionsWithUpdate],
			['Installed', installedExtensions]
		] as [string, TExtension[]][];

		if (!(notInstalledExtensions?.length || languages.size)) return always;

		return [...always, ...groupBy(notInstalledExtensions, (extension) => extension.lang)];
	}
</script>

<Nav let:scrollingElement>
	{#if $extensions === undefined || $extensions.loading}
		<div class="px-4">
			{#each new Array(5) as _}
				<div class="h-8 md:h-10 m-2 placeholder animate-pulse max-w-xs" />
				{#each new Array(5) as _}
					<div class="h-28 m-1">
						<div class="card variant-ghost flex w-full h-full items-center">
							<div class="p-1 h-full w-auto">
								<div class="placeholder animate-pulse h-full w-auto rounded-lg aspect-square" />
							</div>
							<div class="w-full h-full max-w-xs flex flex-col justify-center">
								<div class="placeholder animate-pulse my-2 max-w-[10rem]" />
								<div class="my-2">
									<div class="placeholder animate-pulse" />
								</div>
							</div>
						</div>
					</div>
				{/each}
			{/each}
		</div>
	{:else if $extensions.errors}
		{JSON.stringify($extensions.errors)}
	{:else if $extensions.error}
		{JSON.stringify($extensions.error)}
	{:else if groupExtensions}
		<div class="px-4">
			{#each groupExtensions as [lang, sause]}
				<h2 class="h2 p-2">
					{FindLangName(lang)}
				</h2>
				{#each sause as ext (ext.pkgName)}
					<ExtensionCard {ext} {scrollingElement} />
				{/each}
			{/each}
		</div>
	{/if}
</Nav>
