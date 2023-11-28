<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { AppBarData } from '$lib/MountTitleAction';
	import { getToastStore } from '$lib/components/Toast/stores';
	import {
		ExtensionsDoc,
		fetchExtensions,
		extensions as getExtensions,
		type Exact,
		type ExtensionsQuery,
		type FetchExtensionsMutation,
		type InputMaybe
	} from '$lib/generated';
	import { Errorhelp, Partition, groupBy } from '$lib/util';
	import type { ApolloQueryResult, ObservableQuery } from '@apollo/client';
	import type { Readable } from 'svelte/motion';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import Nav from '../Nav.svelte';
	import { FindLangName } from '../languages';
	import ExtentionsActions from './ExtensionsActions.svelte';
	import { langfilt, lastFetched } from './ExtensionsStores';
	import ExtensionCard from './ExtensionCard.svelte';
	import { Meta } from '$lib/simpleStores';

	let toastStore = getToastStore();
	const query = queryParam('q', ssp.string(), { pushHistory: false });
	type Textension = ExtensionsQuery['extensions']['nodes'][0];

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

	checkIfFetchNewExtentions();
	async function checkIfFetchNewExtentions() {
		if ($lastFetched.valueOf() + 8.64e7 < Date.now().valueOf()) {
			await Errorhelp(
				'failed to fetch new extentions',
				fetchExtensions({
					update: (
						cache,
						{
							data: {
								fetchExtensions: { extensions }
							}
						}
					) => {
						let nodes = extensions as FetchExtensionsMutation['fetchExtensions']['extensions'];
						if (!$Meta.nsfw) nodes = nodes.filter((e) => !e.isNsfw);
						cache.writeQuery({
							query: ExtensionsDoc,
							data: { extensions: { nodes } },
							variables: { isNsfw: $Meta.nsfw ? null : false }
						});
						$lastFetched = new Date();
					}
				}),
				toastStore
			);
		}
		extensions = getExtensions({ variables: { isNsfw: $Meta.nsfw ? null : false } });
	}

	$: langs = getLangs($extensions?.data);
	$: AppBarData('Extentions', { component: ExtentionsActions, props: { langs } });
	function getLangs(srces: ExtensionsQuery) {
		if (srces?.extensions?.nodes) {
			return $extensions.data.extensions.nodes.reduce((a, c) => {
				if (!a.has(c.lang)) {
					return a.add(c.lang);
				}
				return a;
			}, new Set() as Set<string>);
		}
		return new Set() as Set<string>;
	}

	$: filteredExtensions = $extensions?.data?.extensions?.nodes.filter((ele) => {
		if (!$langfilt.has(ele.lang)) return false;
		if ($query !== '' && $query !== null) {
			return ele.name.toLowerCase().includes($query.toLocaleLowerCase());
		}
		return true;
	}) as Textension[] | undefined;

	$: groupExtensions = doGroupSources(filteredExtensions, langs);
	function doGroupSources(filteredSrces: Textension[] | undefined, langs: Set<string>) {
		if (!filteredSrces) return undefined;
		const [hasUpdate, DoesntHaveUpdate] = Partition(filteredSrces, (e) => e.hasUpdate);
		const [isInstalled, isntInstalled] = Partition(DoesntHaveUpdate, (e) => e.isInstalled);
		const always = [
			['Update Pending', hasUpdate],
			['Installed', isInstalled]
		] as [string, Textension[]][];
		if (!(isntInstalled?.length || langs.size)) return always;
		return [...always, ...groupBy(isntInstalled, (item) => item.lang)];
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
