<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import Image from '$lib/components/Image.svelte';
	import { actionState } from '$lib/MountTitleAction.svelte';
	import { type ResultOf } from '$lib/gql/graphql';
	import Nav from '../Nav.svelte';
	import { getContextClient } from '@urql/svelte';
	import { sourcesMigration } from '$lib/gql/Queries';
	import { SourceTypeFragment } from '$lib/gql/Fragments';
	import { queryState } from '$lib/util.svelte';
	import { untrack } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import {
		IntersectionObserverAction,
		MakeSimpleCallback
	} from '$lib/actions/IntersectionObserver.svelte';

	actionState.AppBarData('Migrate');
	const client = getContextClient();
	const Migration = queryState({
		client,
		query: sourcesMigration
	});

	type Source = ResultOf<typeof SourceTypeFragment>; //SourcesMigrationQuery['sources']['nodes'][0];

	type sourceWithMangaCount = Source & {
		mangas?: {
			TotalCount: number;
		};
		broken?: boolean;
	};

	function FigureOutSources(
		data: ResultOf<typeof sourcesMigration> | undefined
	) {
		if (!data?.sources || !data.mangas) return undefined;
		const tmpSources = untrack(() => {
			const tmpSources: sourceWithMangaCount[] = data.sources.nodes;
			data.mangas.nodes.forEach((manga) => {
				const tmp = tmpSources.find((source) => source.id === manga.sourceId);
				if (!tmp) {
					tmpSources.push({
						id: manga.sourceId,
						displayName: manga.sourceId,
						iconUrl: '',
						lang: '',
						broken: true,
						mangas: {
							TotalCount: 1
						},
						meta: []
					});
					return;
				}
				if (tmp.mangas) tmp.mangas.TotalCount += 1;
				else tmp.mangas = { TotalCount: 1 };
			});
			return tmpSources;
		});
		return tmpSources.filter((e) => e.mangas?.TotalCount);
	}
	let sources = $derived(FigureOutSources(Migration.value.data));
	let intersecting: SvelteSet<string> = $state(new SvelteSet());
</script>

<Nav>
	{#snippet children()}
		{#if Migration.value.fetching}
			{#each new Array(8) as _}
				<div class="m-1 h-24">
					<div class="card variant-ghost flex h-full w-full items-center">
						<div class="h-full w-auto p-1">
							<div
								class="placeholder aspect-square h-full w-auto animate-pulse rounded-lg"
							></div>
						</div>
						<div class="flex h-full w-full flex-col justify-center">
							<div class="placeholder my-2 max-w-[10rem] animate-pulse"></div>
						</div>
						<div class="flex h-full items-center p-1">
							<div class="variant-filled-primary badge h-6 w-6"></div>
						</div>
					</div>
				</div>
			{/each}
		{:else if Migration.value.error}
			<div class="white-space-pre-wrap">
				{JSON.stringify(Migration.value.error, null, 4)}
			</div>
		{:else if sources}
			<div>
				{#each sources as source (source.id)}
					<div
						class="h-24"
						use:IntersectionObserverAction={{
							rootMargin: `400px 0px 400px 0px`,
							callback: MakeSimpleCallback(intersecting, source.id)
						}}
					>
						{#if intersecting.has(source.id)}
							<a href="/browse/migrate/source/{source.id}">
								<div
									class="card variant-glass m-1 flex h-full items-center hover:variant-glass-primary"
								>
									<div class="h-full p-1">
										<Image
											src={source.iconUrl}
											aspect="aspect-square"
											width="h-auto"
										/>
									</div>
									<div class="w-full">
										{source.displayName}
									</div>
									<div class="m-2">
										<span class="variant-filled-primary badge"
											>{source.mangas?.TotalCount}</span
										>
									</div>
								</div>
							</a>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	{/snippet}
</Nav>
