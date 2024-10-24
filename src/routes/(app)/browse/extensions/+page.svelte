<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { AppBarData } from '$lib/MountTitleAction';
	import { ErrorHelp, Partition, groupBy } from '$lib/util';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import Nav from '../Nav.svelte';
	import { FindLangName } from '../languages';
	import ExtensionsActions from './ExtensionsActions.svelte';
	import { langFilter, lastFetched } from './ExtensionsStores';
	import ExtensionCard from './ExtensionCard.svelte';
	import { Meta } from '$lib/simpleStores';
	import { queryStore } from '@urql/svelte';
	import {
		getContextClient,
		type OperationResultStore,
		type Pausable
	} from '@urql/svelte';
	import { getExtensions } from '$lib/gql/Queries';
	import { ExtensionTypeFragment } from '$lib/gql/Fragments';
	import { type ResultOf } from '$lib/gql/graphql';
	import { fetchExtensions } from '$lib/gql/Mutations';

	const client = getContextClient();

	const query = queryParam('q', ssp.string(), { pushHistory: false });
	type TExtension = ResultOf<typeof ExtensionTypeFragment>;

	let extensions:
		| (OperationResultStore<ResultOf<typeof getExtensions>> & Pausable)
		| undefined;

	checkIfFetchNewExtensions();

	async function checkIfFetchNewExtensions() {
		if ($lastFetched.getTime() > new Date().getTime() - 60000) {
			await ErrorHelp(
				'failed to fetch new extensions',
				client.mutation(fetchExtensions, {}).toPromise()
			);
			$lastFetched = new Date();
		}
		extensions = queryStore({
			client,
			query: getExtensions,
			variables: { isNsfw: $Meta.nsfw ? null : false }
		});
	}

	function getLangs(
		extensionsQuery: ResultOf<typeof getExtensions> | undefined
	) {
		if (extensionsQuery?.extensions?.nodes) {
			return extensionsQuery.extensions.nodes.reduce(
				(accumulatedSet, currentExtension) => {
					if (!accumulatedSet.has(currentExtension.lang)) {
						accumulatedSet.add(currentExtension.lang);
					}
					return accumulatedSet;
				},
				new Set<string>()
			);
		}
		return new Set<string>();
	}

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

		return [
			...always,
			...groupBy(notInstalledExtensions, (extension) => extension.lang)
		];
	}
	let langs = $derived(getLangs($extensions?.data));
	$effect(() => {
		AppBarData('Extensions', {
			component: ExtensionsActions,
			props: { langs }
		});
	});
	let filteredExtensions = $derived(
		$extensions?.data?.extensions.nodes?.filter((ele) => {
			if (!$langFilter.has(ele.lang)) return false;
			if ($query !== '' && $query !== null) {
				return ele.name.toLowerCase().includes($query.toLocaleLowerCase());
			}
			return true;
		}) as TExtension[] | undefined
	);
	let groupExtensions = $derived(groupSources(filteredExtensions, langs));
</script>

<Nav>
	{#snippet children()}
		{#if $extensions === undefined || $extensions.fetching}
			<div class="px-4">
				{#each new Array(5) as _}
					<div class="placeholder m-2 h-8 max-w-xs animate-pulse md:h-10"></div>
					{#each new Array(5) as _}
						<div class="m-1 h-28">
							<div class="card variant-ghost flex h-full w-full items-center">
								<div class="h-full w-auto p-1">
									<div
										class="placeholder aspect-square h-full w-auto animate-pulse rounded-lg"
									></div>
								</div>
								<div
									class="flex h-full w-full max-w-xs flex-col justify-center"
								>
									<div
										class="placeholder my-2 max-w-[10rem] animate-pulse"
									></div>
									<div class="my-2">
										<div class="placeholder animate-pulse"></div>
									</div>
								</div>
							</div>
						</div>
					{/each}
				{/each}
			</div>
		{:else if $extensions.error}
			<div class="white-space-pre-wrap">
				{JSON.stringify($extensions.error, null, 4)}
			</div>
		{:else if groupExtensions}
			<div class="px-4">
				{#each groupExtensions as [lang, sause]}
					<h2 class="h2 p-2">
						{FindLangName(lang)}
					</h2>
					{#each sause as ext (ext.pkgName + ext.repo)}
						<ExtensionCard {ext} />
					{/each}
				{/each}
			</div>
		{/if}
	{/snippet}
</Nav>
