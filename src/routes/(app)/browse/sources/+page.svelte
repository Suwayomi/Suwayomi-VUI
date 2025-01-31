<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import ImageCard from '$lib/components/ImageCard.svelte';
	import { actionState } from '$lib/MountTitleAction.svelte';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import { FindLangName } from '../languages';
	import Nav from '../Nav.svelte';
	import SourcesActions from './SourcesActions.svelte';
	import { SourceLangFilter } from './SourcesStores';

	import { groupBy, queryState } from '$lib/util.svelte';
	import { longPress } from '$lib/press';
	import { getSources } from '$lib/gql/Queries';
	import { type ResultOf } from '$lib/gql/graphql';
	import { getContextClient } from '@urql/svelte';
	import { SourceTypeFragment } from '$lib/gql/Fragments';
	import { deleteSourceMeta, setSourceMeta } from '$lib/gql/Mutations';
	import { gmState } from '$lib/simpleStores.svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import {
		IntersectionObserverAction,
		MakeSimpleCallback
	} from '$lib/actions/IntersectionObserver.svelte';

	actionState.AppBarData('Sources');

	type Tsource = ResultOf<typeof getSources>['sources']['nodes'][number];
	const client = getContextClient();
	const sources = queryState({
		client,
		query: getSources,
		variables: { isNsfw: gmState.value.nsfw ? null : false }
	});
	const query = queryParam('q', ssp.string(), { pushHistory: false });

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

	function doGroupSources(filteredExts: Tsource[] | undefined) {
		if (!filteredExts) return;
		return groupBy(filteredExts, (source) =>
			source.meta.find((e) => e.key === 'pinned') ? 'Pinned' : source.lang
		);
	}

	let stopClick: string = $state('');

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
	let filteredSources = $derived(
		sources.data?.sources?.nodes.filter((ele) => {
			if (ele.meta.find((e) => e.key === 'pinned')) return true;
			if (!$SourceLangFilter.has(ele.lang)) return false;
			if ($query !== '' && $query !== null) {
				return ele.displayName
					.toLowerCase()
					.includes($query.toLocaleLowerCase());
			}
			return true;
		}) as Tsource[] | undefined
	);
	let langs = $derived(getLanguages(sources.data));
	$effect(() => {
		actionState.AppBarData('Sources', {
			component: SourcesActions,
			props: { langs }
		});
	});
	let groupSources = $derived(doGroupSources(filteredSources));
	let intersecting: SvelteSet<string> = $state(new SvelteSet());
</script>

<Nav>
	{#snippet children()}
		{#if sources.error}
			<div class="white-space-pre-wrap">
				{JSON.stringify(sources.error, null, 4)}
			</div>
		{:else if sources.fetching}
			{#each new Array(5) as _}
				<div class="px-8 py-4">
					<div class="placeholder h-12 animate-pulse"></div>
				</div>
				<div
					class="mx-2 grid gap-2 xs:grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12"
				>
					{#each new Array(5) as _}
						<div class="card relative aspect-cover">
							<div class="h-full w-full p-4">
								<div
									class="placeholder aspect-square h-auto w-full animate-pulse rounded-lg"
								></div>
							</div>
							<div
								class="variant-glass-surface absolute bottom-0 left-0 right-0 rounded-b-olg"
							>
								<div class="h-12 px-2 text-center">
									<div class="placeholder my-1 animate-pulse"></div>
									<div class="placeholder animate-pulse"></div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/each}
		{:else if groupSources}
			{#each groupSources.sort( (a, b) => (a[0] === 'Pinned' ? -1 : b[0] === 'Pinned' ? 1 : 0) ) as [lang, sous]}
				{@const sou = sous}
				<div class="px-8 py-4 text-5xl">
					{FindLangName(lang)}
				</div>
				<div
					class="mx-2 grid gap-2 xs:grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12"
				>
					{#each sou as source (source.id)}
						<div
							use:IntersectionObserverAction={{
								rootMargin: '400px 0px 400px 0px',
								callback: MakeSimpleCallback(intersecting, source.id)
							}}
							class="card aspect-cover"
						>
							{#if intersecting.has(source.id)}
								<a
									use:longPress
									onlongPress={(e) => {
										e.stopPropagation();
										e.preventDefault();
										LongHandler(source);
									}}
									href="/browse/source/{source.id}/popular"
									onclick={(e) => {
										if (e.ctrlKey) return;
										if (stopClick === source.id) {
											e.preventDefault();
										}
									}}
								>
									<ImageCard
										thumbnailUrl={source.iconUrl}
										title={source.displayName}
										fit="object-contain object-top"
									>
										<div
											class="variant-soft absolute bottom-0 left-0 right-0 rounded-b"
										>
											<div
												class="line-clamp-2 h-12 px-2 text-center"
												title={source.displayName}
											>
												{source.displayName}
											</div>
										</div>
									</ImageCard>
								</a>
							{/if}
						</div>
					{/each}
				</div>
			{/each}
			<div class="flex w-full flex-col items-center justify-center p-1">
				<p>You have reached the end of the list.</p>
				<p>
					If you are not seeing a source you expected to see, try changing the
					language filter in the top right.
				</p>
			</div>
		{/if}
	{/snippet}
</Nav>
