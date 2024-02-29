<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import Image from '$lib/components/Image.svelte';
	import IntersectionObserver from '$lib/components/IntersectionObserver.svelte';
	import { AppBarData } from '$lib/MountTitleAction';
	import { type ResultOf } from 'gql.tada';
	import Nav from '../Nav.svelte';
	import { getContextClient, queryStore } from '@urql/svelte';
	import { sourcesMigration } from '$lib/gql/Queries';
	import { SourceTypeFragment } from '$lib/gql/Fragments';

	AppBarData('Migrate');
	const client = getContextClient();
	const Migration = queryStore({
		client,
		query: sourcesMigration
	});

	$: sources = FigureOutSources($Migration.data);

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
		return tmpSources.filter((e) => e.mangas?.TotalCount);
	}
</script>

<Nav let:scrollingElement>
	{#if $Migration.fetching}
		{#each new Array(8) as _}
			<div class="h-24 m-1">
				<div class="card variant-ghost flex w-full h-full items-center">
					<div class="p-1 h-full w-auto">
						<div
							class="placeholder animate-pulse h-full w-auto rounded-lg aspect-square"
						/>
					</div>
					<div class="w-full h-full flex flex-col justify-center">
						<div class="placeholder animate-pulse my-2 max-w-[10rem]" />
					</div>
					<div class="p-1 flex h-full items-center">
						<div class="badge variant-filled-primary h-6 w-6" />
					</div>
				</div>
			</div>
		{/each}
	{:else if $Migration.error}
		<div class="white-space-pre-wrap">
			{JSON.stringify($Migration.error, null, 4)}
		</div>
	{:else if sources}
		<div>
			{#each sources as source (source.id)}
				<IntersectionObserver
					top={400}
					bottom={400}
					root={scrollingElement}
					let:intersecting
					class="h-24"
				>
					{#if intersecting}
						<a href="/browse/migrate/source/{source.id}">
							<div
								class="card m-1 flex h-full items-center variant-glass hover:variant-glass-primary"
							>
								<div class="p-1 h-full">
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
									<span class="badge variant-filled-primary"
										>{source.mangas?.TotalCount}</span
									>
								</div>
							</div>
						</a>
					{/if}
				</IntersectionObserver>
			{/each}
		</div>
	{/if}
</Nav>
