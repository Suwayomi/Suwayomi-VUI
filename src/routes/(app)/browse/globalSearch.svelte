<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import GlobalSearchActions from './globalsearch/GlobalSearchActions.svelte';
	import PQueue from 'p-queue';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import { onDestroy } from 'svelte';
	import MediaQuery2 from '$lib/components/MediaQuery2.svelte';
	import { SpecificSourceFilter } from './BrowseStores';
	import HorisontalmangaElement from './HorisontalmangaElement.svelte';
	import { AppBarData } from '$lib/MountTitleAction';
	import { Meta, display } from '$lib/simpleStores';
	import { groupBy } from '$lib/util';
	import { getContextClient, CombinedError } from '@urql/svelte';
	import { getSources } from '$lib/gql/Queries';
	import { type ResultOf } from '$lib/gql/graphql';
	import { fetchSourceManga } from '$lib/gql/Mutations';
	import { writable } from 'svelte/store';

	export let title: string = 'Loading...';
	export let OpenModal: ((id: number) => void) | undefined = undefined;

	const queue = new PQueue({ concurrency: 4 });
	const query = queryParam('q', ssp.string(), { pushHistory: false });

	let lastQuery = $query;

	$: if ($query !== lastQuery) {
		lastQuery = $query;
	}

	let rawSources = writable<{
		data: ResultOf<typeof getSources> | undefined;
		error: CombinedError | undefined;
		fetching: boolean;
	}>({
		data: undefined,
		error: undefined,
		fetching: true
	});

	const client = getContextClient();
	client
		.query(getSources, { isNsfw: $Meta.nsfw ? null : false })
		.toPromise()
		.then((ee) => {
			rawSources.update((e) => {
				e.data = ee.data;
				e.error = ee.error;
				e.fetching = false;
				return e;
			});
		});

	$: langs = getLanguages($rawSources.data);

	function getLanguages(extensions: ResultOf<typeof getSources> | undefined) {
		if (extensions?.sources?.nodes !== undefined) {
			return extensions?.sources?.nodes.reduce(
				(accumulator, currentNode) => {
					if (!accumulator.has(currentNode.lang)) {
						return accumulator.add(currentNode.lang);
					}
					return accumulator;
				},
				new Set<string>(['pinned'])
			);
		}
		return new Set<string>(['pinned']);
	}

	let alterableRaw: sourceWithManga[] | undefined = undefined;

	$: filteredSources = $rawSources.data?.sources?.nodes
		?.filter((source) => {
			if (!$SpecificSourceFilter.has(source.id)) return false;
			return true;
		})
		.sort((a, b) => {
			if (a.meta.find((e) => e.key === 'pinned')) return -1;
			if (b.meta.find((e) => e.key === 'pinned')) return 1;
			return 0;
		});

	$: AppBarData(title, {
		component: GlobalSearchActions,
		props: {
			rawSources: $rawSources.data?.sources?.nodes.sort((a, b) => {
				if (a.meta.find((e) => e.key === 'pinned')) return -1;
				if (b.meta.find((e) => e.key === 'pinned')) return 1;
				return 0;
			}),
			langs
		}
	});

	$: filteredSources, $query, onQueryChange();
	function onQueryChange() {
		const Query = $query;
		alterableRaw = structuredClone(filteredSources);
		queue.clear();
		if (Query) {
			filteredSources?.forEach(async (souc) => {
				await queue.add(async () => {
					if (!alterableRaw) return;
					const id = alterableRaw?.findIndex((ele) => ele.id === souc.id);
					if (id === -1) return;
					alterableRaw[id].Loading = true;
					try {
						let response = await getMangasFromSource(souc.id, Query);
						if (Query === $query) {
							alterableRaw[id].Loading = false;
							alterableRaw[id].mangas = response.data?.fetchSourceManga?.mangas;
						}
					} catch (error) {
						console.error(error);
						alterableRaw[id].Loading = false;
						alterableRaw[id].error = error;
					}
				});
			});
		}
	}

	function getMangasFromSource(source: string, query: string) {
		return client
			.mutation(fetchSourceManga, {
				source,
				query,
				type: 'SEARCH',
				page: 1
			})
			.toPromise();
	}

	type sourceNode = ResultOf<typeof getSources>['sources']['nodes'][number];
	type sourceWithManga = sourceNode & {
		mangas?: NonNullable<
			ResultOf<typeof fetchSourceManga>['fetchSourceManga']
		>['mangas'];
		Loading?: boolean;
		error?: unknown;
	};

	$: groupSources = doGroupSources(alterableRaw);

	function doGroupSources(
		filteredSources: ResultOf<typeof getSources>['sources']['nodes'] | undefined
	) {
		if (!filteredSources) return [];
		return groupBy(filteredSources, (item) =>
			item.meta.find((e) => e.key === 'pinned') ? 'Pinned' : item.lang
		) as [string, sourceWithManga[]][];
	}

	onDestroy(() => {
		queue.clear();
	});
</script>

<MediaQuery2 let:gridnumber>
	{#if $query === null || $query === ''}
		<div class="flex justify-center p-8">
			Try searching for a manga in the top right
		</div>
	{/if}
	{#if $rawSources.fetching}
		{#each new Array(5) as _}
			<div class="placeholder m-4 h-12 max-w-xs animate-pulse" />
			{#each new Array(5) as _}
				<div class="placeholder m-4 ml-8 h-10 max-w-sm animate-pulse" />
			{/each}
		{/each}
	{:else if $rawSources.error}
		<div class="white-space-pre-wrap">
			{JSON.stringify($rawSources.error, null, 4)}
		</div>
	{:else if !filteredSources?.length}
		<div class="flex justify-center p-8">
			Sources filtered to nothing, try changing filters in the top right
		</div>
	{:else if groupSources}
		{#each groupSources as [Lang, sous]}
			<div class="m-4 text-5xl">
				{Lang}
			</div>
			{#each sous as source}
				{@const sorcFrag = source}
				<div class="my-4 ml-8 text-4xl">{sorcFrag.displayName}</div>
				{#if source.Loading}
					<div class="overflow-x-auto">
						<div
							class="flex flex-nowrap"
							style="width:calc({10 / gridnumber} * 100%)"
						>
							{#each new Array(10) as _}
								<div class="m-1 flex h-full w-full flex-col flex-nowrap">
									<div class="aspect-cover h-full w-auto">
										<div
											class="placeholder h-full w-full animate-pulse
                        {$Meta.Display === display.Compact && 'rounded-lg'}
                        {$Meta.Display === display.Comfortable &&
												'rounded-none rounded-t-lg'}"
										/>
									</div>
									{#if $Meta.Display === display.Comfortable}
										<div
											class="placeholder h-12 animate-pulse rounded-none rounded-b-lg px-2 text-center"
										/>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{:else if source.error}
					<div class="white-space-pre-wrap">
						{JSON.stringify(source.error, null, 4)}
					</div>
				{:else if source.mangas}
					<HorisontalmangaElement
						mangas={source.mangas}
						{gridnumber}
						{OpenModal}
					/>
				{/if}
			{/each}
		{/each}
	{/if}
</MediaQuery2>
