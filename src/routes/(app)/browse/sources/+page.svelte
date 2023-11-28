<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import IntersectionObserver from '$lib/components/IntersectionObserver.svelte';
	import MangaCard from '$lib/components/MangaCard.svelte';
	import { sources as getsources, type SourcesQuery } from '$lib/generated';
	import { AppBarData } from '$lib/MountTitleAction';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import { FindLangName } from '../languages';
	import Nav from '../Nav.svelte';
	import SourcesActions from './SourcesActions.svelte';
	import { Sourcelangfilt } from './SourcesStores';
	import { Meta } from '$lib/simpleStores';
	import { groupBy } from '$lib/util';

	AppBarData('Sources');

	type Tsource = SourcesQuery['sources']['nodes'][0];

	const sources = getsources({ variables: { isNsfw: $Meta.nsfw ? null : false } });
	const query = queryParam('q', ssp.string(), { pushHistory: false });

	$: filteredSources = $sources.data?.sources?.nodes.filter((ele) => {
		if (!$Sourcelangfilt.has(ele.lang)) return false;
		if ($query !== '' && $query !== null) {
			return ele.displayName.toLowerCase().includes($query.toLocaleLowerCase());
		}
		return true;
	}) as Tsource[] | undefined;

	$: langs = getLangs($sources.data);

	function getLangs(srces: SourcesQuery) {
		if (srces?.sources?.nodes !== undefined) {
			return $sources.data.sources.nodes.reduce((a, c) => {
				if (!a.has(c.lang)) {
					return a.add(c.lang);
				}
				return a;
			}, new Set() as Set<string>);
		}
		return new Set() as Set<string>;
	}

	$: langs, AppBarData('Sources', { component: SourcesActions, props: { langs } });

	$: groupSources = doGroupSources(filteredSources);

	function doGroupSources(filteredSrces: Tsource[] | undefined) {
		if (!filteredSrces) return;
		return groupBy(filteredSrces, ({ lang }) => lang);
	}
</script>

<Nav let:scrollingElement>
	{#if $sources.error}
		{JSON.stringify($sources.error)}
	{:else if $sources.loading}
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
							<div class="w-full h-auto aspect-square rounded-lg placeholder animate-pulse" />
						</div>
						<div class="absolute bottom-0 left-0 right-0 variant-glass-surface rounded-b-olg">
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
		{#each groupSources as [lang, sous]}
			<div class="text-5xl py-4 px-8">
				{FindLangName(lang)}
			</div>
			<div
				class="grid xs:grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-2 mx-2"
			>
				{#each sous as source (source.id)}
					<IntersectionObserver
						let:intersecting
						root={scrollingElement}
						top={400}
						bottom={400}
						class="aspect-cover card"
					>
						{#if intersecting}
							<a href="source/{source.id}/popular">
								<MangaCard
									thumbnailUrl={source.iconUrl}
									title={source.displayName}
									fit="object-contain object-top"
								>
									<div class="absolute bottom-0 left-0 right-0 variant-glass rounded-b-olg">
										<div class="line-clamp-2 px-2 h-12 text-center" title={source.displayName}>
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
				If you are not seeing a source you expected to see, try changing the language filter in the
				top right.
			</p>
		</div>
	{/if}
</Nav>
