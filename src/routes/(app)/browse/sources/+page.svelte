<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import IntersectionObserver from '$lib/components/IntersectionObserver.svelte';
	import MangaCard from '$lib/components/MangaCard.svelte';
	import { AppBarData } from '$lib/MountTitleAction';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import { FindLangName } from '../languages';
	import Nav from '../Nav.svelte';
	import SourcesActions from './SourcesActions.svelte';
	import { SourceLangFilter } from './SourcesStores';
	import { Meta } from '$lib/simpleStores';
	import { groupBy } from '$lib/util';
	import { longPress } from '$lib/press';
	import { getSources } from '$lib/gql/Queries';
	import { type ResultOf } from 'gql.tada';
	import { getContextClient, queryStore } from '@urql/svelte';
	import { SourceTypeFragment } from '$lib/gql/Fragments';
	import { deleteSourceMeta, setSourceMeta } from '$lib/gql/Mutations';

	AppBarData('Sources');

	type Tsource = ResultOf<typeof getSources>['sources']['nodes'][number];
	const client = getContextClient();
	const sources = queryStore({
		client,
		query: getSources,
		variables: { isNsfw: $Meta.nsfw ? null : false }
	});
	const query = queryParam('q', ssp.string(), { pushHistory: false });

	$: filteredSources = $sources.data?.sources?.nodes.filter((ele) => {
		if (ele.meta.find((e) => e.key === 'pinned')) return true;
		if (!$SourceLangFilter.has(ele.lang)) return false;
		if ($query !== '' && $query !== null) {
			return ele.displayName.toLowerCase().includes($query.toLocaleLowerCase());
		}
		return true;
	}) as Tsource[] | undefined;

	$: langs = getLanguages($sources.data);

	function getLanguages(
		extensions: ResultOf<typeof getSources> | undefined
	): Set<string> {
		if (extensions?.sources?.nodes !== undefined) {
			return extensions.sources.nodes.reduce((accumulator, current) => {
				if (!accumulator.has(current.lang)) {
					return accumulator.add(current.lang);
				}
				return accumulator;
			}, new Set<string>());
		}
		return new Set<string>();
	}

	$: langs,
		AppBarData('Sources', { component: SourcesActions, props: { langs } });

	$: groupSources = doGroupSources(filteredSources);

	function doGroupSources(filteredExts: Tsource[] | undefined) {
		if (!filteredExts) return;
		return groupBy(filteredExts, (source) =>
			source.meta.find((e) => e.key === 'pinned') ? 'Pinned' : source.lang
		);
	}

	let stopClick: string = '';

	async function LongHandler(source: ResultOf<typeof SourceTypeFragment>) {
		stopClick = source.id;
		document.addEventListener('click', () => (stopClick = ''), { once: true });
		document.addEventListener('pointercancel', () => (stopClick = ''), {
			once: true
		});
		if (source.meta.find((e) => e.key === 'pinned')) {
			await client.mutation(deleteSourceMeta, {
				sourceId: source.id,
				key: 'pinned'
			});
		} else {
			await client.mutation(setSourceMeta, {
				sourceId: source.id,
				key: 'pinned',
				value: 'pinned'
			});
		}
	}
</script>

<Nav let:scrollingElement>
	{#if $sources.error}
		{JSON.stringify($sources.error)}
	{:else if $sources.fetching}
		{#each new Array(5) as _}
			<div class=" py-4 px-8">
				<div class="h-12 placeholder animate-pulse" />
			</div>
			<div
				class="grid xs:grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-2 mx-2"
			>
				{#each new Array(5) as _}
					<div class="aspect-cover card relative">
						<div class=" w-full h-full p-4">
							<div
								class="w-full h-auto aspect-square rounded-lg placeholder animate-pulse"
							/>
						</div>
						<div
							class="absolute bottom-0 left-0 right-0 variant-glass-surface rounded-b-olg"
						>
							<div class="px-2 h-12 text-center">
								<div class="placeholder animate-pulse my-1" />
								<div class="placeholder animate-pulse" />
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/each}
	{:else if groupSources}
		{#each groupSources.sort( (a, b) => (a[0] === 'Pinned' ? -1 : b[0] === 'Pinned' ? 1 : 0) ) as [lang, sous]}
			{@const sou = sous}
			<div class="text-5xl py-4 px-8">
				{FindLangName(lang)}
			</div>
			<div
				class="grid xs:grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-2 mx-2"
			>
				{#each sou as source (source.id)}
					<IntersectionObserver
						let:intersecting
						root={scrollingElement}
						top={400}
						bottom={400}
						class="aspect-cover card"
					>
						{#if intersecting}
							<a
								use:longPress
								on:longPress|preventDefault|stopPropagation={() =>
									LongHandler(source)}
								href="/browse/source/{source.id}/popular"
								on:click={(e) => {
									if (e.ctrlKey) return;
									if (stopClick === source.id) {
										e.preventDefault();
									}
								}}
							>
								<MangaCard
									thumbnailUrl={source.iconUrl}
									title={source.displayName}
									fit="object-contain object-top"
								>
									<div
										class="absolute bottom-0 left-0 right-0 variant-glass rounded-b-olg"
									>
										<div
											class="line-clamp-2 px-2 h-12 text-center"
											title={source.displayName}
										>
											{source.displayName}
										</div>
									</div>
								</MangaCard>
							</a>
						{/if}
					</IntersectionObserver>
				{/each}
			</div>
		{/each}
		<div class="w-full flex flex-col justify-center items-center p-1">
			<p>You have reached the end of the list.</p>
			<p>
				If you are not seeing a source you expected to see, try changing the
				language filter in the top right.
			</p>
		</div>
	{/if}
</Nav>
