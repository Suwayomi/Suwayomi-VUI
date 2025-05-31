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
	import { onDestroy, untrack } from 'svelte';
	import MediaQuery2 from '$lib/components/MediaQuery2.svelte';
	import { SpecificSourceFilter } from './BrowseStores';
	import HorisontalmangaElement from './HorisontalmangaElement.svelte';
	import { actionState } from '$lib/MountTitleAction.svelte';
	import { gmState } from '$lib/simpleStores.svelte';

	import { groupBy, OTT, queryState } from '$lib/util.svelte';
	import { getContextClient } from '@urql/svelte';
	import { getSources } from '$lib/gql/Queries';
	import { type ResultOf } from '$lib/gql/graphql';
	import { fetchSourceManga } from '$lib/gql/Mutations';
	import FakeMangaItem from '$lib/components/FakeMangaItem.svelte';

	interface Props {
		title?: string;
		OpenModal?: ((id: number) => void) | undefined;
	}

	let { title = 'Loading...', OpenModal = undefined }: Props = $props();

	const queue = new PQueue({ concurrency: 4 });
	const query = queryParam('q', ssp.string(), { pushHistory: false });

	let lastQuery: string | null = null;

	const client = getContextClient();

	let fetchSources = queryState({
		client,
		query: getSources,
		variables: { isNsfw: gmState.value.nsfw ? null : false }
	});

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

	let alterableRaw: sourceWithManga[] | undefined = $state(undefined);

	function onQueryChange() {
		if (
			$query === lastQuery &&
			alterableRaw?.length === filteredSources?.length
		)
			return;
		alterableRaw = $state.snapshot(filteredSources);
		lastQuery = $query;
		const Query = $query;
		untrack(() => {
			queue.clear();
			if (Query) {
				filteredSources?.forEach(async (souc) => {
					await queue.add(async () => {
						const timeStart = performance.now();
						if (!alterableRaw) return;
						const id = alterableRaw?.findIndex((ele) => ele.id === souc.id);
						if (id === -1) return;
						alterableRaw[id].Loading = true;
						try {
							let response = await getMangasFromSource(souc.id, Query);
							if (Query === $query) {
								alterableRaw[id].Loading = false;
								alterableRaw[id].mangas =
									response.data?.fetchSourceManga?.mangas;
								alterableRaw[id].time = performance.now() - timeStart;
							}
						} catch (error) {
							console.error(error);
							alterableRaw[id].Loading = false;
							alterableRaw[id].error = error;
							alterableRaw[id].time = performance.now() - timeStart;
						}
					});
				});
			}
		});
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
		time?: number;
	};

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
	let langs = $derived(getLanguages(fetchSources.data));

	let filteredSources = $derived(
		fetchSources.data?.sources?.nodes
			?.filter((source) => {
				if (!$SpecificSourceFilter.has(source.id)) return false;
				return true;
			})
			.toSorted((a, b) => {
				if (a.meta.find((e) => e.key === 'pinned')) return -1;
				if (b.meta.find((e) => e.key === 'pinned')) return 1;
				return 0;
			})
	);
	$effect(() => {
		actionState.AppBarData(title, {
			component: GlobalSearchActions,
			props: {
				rawSources: fetchSources.data?.sources?.nodes.toSorted((a, b) => {
					if (a.meta.find((e) => e.key === 'pinned')) return -1;
					if (b.meta.find((e) => e.key === 'pinned')) return 1;
					return 0;
				}),
				langs
			}
		});
	});

	$effect(() => {
		OTT([filteredSources, $query], onQueryChange);
	});
	let groupSources = $derived(doGroupSources(alterableRaw));
</script>

<MediaQuery2>
	{#snippet children({ gridnumber })}
		{#if $query === null || $query === ''}
			<div class="flex justify-center p-8">
				Try searching for a manga in the top right
			</div>
		{/if}
		{#if fetchSources.fetching}
			{#each new Array(5) as _}
				<div class="placeholder m-4 h-12 max-w-xs animate-pulse"></div>
				{#each new Array(5) as _}
					<div class="placeholder m-4 ml-8 h-10 max-w-sm animate-pulse"></div>
				{/each}
			{/each}
		{:else if fetchSources.error}
			<div class="white-space-pre-wrap">
				{JSON.stringify(fetchSources.error, null, 4)}
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
					<div class="flex items-center justify-between">
						<span class="my-4 ml-8 text-4xl">
							{sorcFrag.displayName}
						</span>
						<span class="text-xs opacity-60">
							{sorcFrag.time ? `${Math.round(sorcFrag.time)}ms` : null}
						</span>
					</div>
					{#if source.Loading}
						<div class="overflow-x-auto">
							<div
								class="flex flex-nowrap"
								style="width:calc({10 / gridnumber} * 100%)"
							>
								<FakeMangaItem active={true} count={10} />
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
	{/snippet}
</MediaQuery2>
