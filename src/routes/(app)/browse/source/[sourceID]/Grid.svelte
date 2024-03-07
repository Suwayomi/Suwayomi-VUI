<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import type { LayoutData } from './$types';
	import { errortoast, gridValues } from '$lib/util';
	import IntersectionObserver from '$lib/components/IntersectionObserver.svelte';
	import MangaCard from '$lib/components/MangaCard.svelte';
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	import PreferencesModal from './PreferencesModal.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { Meta, display } from '$lib/simpleStores';
	import type { ResultOf, VariablesOf } from '$lib/gql/graphql';
	import { fetchSourceManga } from '$lib/gql/Mutations';
	import { getContextClient, mutationStore, queryStore } from '@urql/svelte';
	import { getSource } from '$lib/gql/Queries';

	export let data: LayoutData;
	export let type: VariablesOf<typeof fetchSourceManga>['type'];
	export let query: string | undefined = undefined;
	export let filters:
		| VariablesOf<typeof fetchSourceManga>['filters']
		| undefined = undefined;
	const client = getContextClient();

	let sause = queryStore({
		client,
		query: getSource,
		variables: { id: data.sourceID }
	});
	const modalStore = getModalStore();

	let page = 1;
	let isLoading = true;
	let all: ResultOf<typeof fetchSourceManga>['fetchSourceManga'] = {
		hasNextPage: true,
		mangas: []
	};
	let mainerror: Error | undefined;

	$: query, filters, clearAll();

	function clearAll() {
		all = {
			hasNextPage: true,
			mangas: []
		};
		page = 1;
	}

	$: source = mutationStore({
		client,
		query: fetchSourceManga,
		variables: {
			page: page,
			source: data.sourceID,
			type,
			query,
			filters
		}
	});

	$: parseall($source.data);

	async function parseall(
		sourcee: ResultOf<typeof fetchSourceManga> | undefined
	) {
		if (!sourcee) return;
		isLoading = true;
		try {
			if (!sourcee) throw new Error('Missing data');
			all.hasNextPage = sourcee.fetchSourceManga.hasNextPage;
			all.mangas.push(...sourcee.fetchSourceManga.mangas);
			all = all;
		} catch (error) {
			if (error instanceof Error) {
				console.error(error);
				if (error.message.includes('Already on the Last Page!')) {
					all.hasNextPage = false;
				}
				mainerror = error;
				errortoast('failed to load page', error.message);
				return;
			}
			errortoast('failed to load page', JSON.stringify(error));
		} finally {
			isLoading = false;
		}
	}
</script>

{#if $sause.data?.source?.isConfigurable}
	<button
		on:click={() => {
			modalStore.trigger({
				type: 'component',
				component: { ref: PreferencesModal, props: { data, clearAll } }
			});
		}}
		class="variant-filled-primary btn fixed right-4 top-20 z-40 h-12 hover:bg-primary-500/70"
	>
		<IconWrapper name="mdi:filter-outline" class="h-full w-auto" />
		SourceSettings
	</button>
{/if}

{#if !all}
	<div class="yoy m-2 grid gap-2 {gridValues}">
		{#each new Array(30) as _}
			<div class="aspect-cover w-full">
				<div
					class="placeholder h-full animate-pulse
						{$Meta.Display === display.Compact && 'rounded-lg'}
						{$Meta.Display === display.Comfortable && 'rounded-none rounded-t-lg'}"
				/>
				{#if $Meta.Display === display.Comfortable}
					<div
						class="placeholder h-12 animate-pulse rounded-none rounded-b-lg px-2 text-center"
					/>
				{/if}
			</div>
		{/each}
	</div>
{:else if all.mangas}
	<div class="m-2 grid gap-2 {gridValues}">
		{#each all.mangas.filter((e, i, s) => i === s.findIndex((ee) => e.id === ee.id)) as manga (manga.id)}
			<IntersectionObserver
				let:intersecting
				root={document.querySelector('#page') ?? undefined}
				top={400}
				bottom={400}
			>
				<div class="aspect-cover">
					{#if intersecting}
						<a
							href="/manga/{manga.id}"
							class="h-full cursor-pointer hover:opacity-70"
							tabindex="-1"
						>
							<MangaCard
								thumbnailUrl={manga.thumbnailUrl ?? ''}
								title={manga.title}
								rounded="{$Meta.Display === display.Compact && 'rounded-lg'}
										{$Meta.Display === display.Comfortable && 'rounded-none rounded-t-lg'}"
							>
								{#if $Meta.Display === display.Compact}
									<div
										class="variant-glass absolute bottom-0 left-0 right-0 rounded-b-olg"
									>
										<div
											class="line-clamp-2 h-12 px-2 text-center"
											title={manga.title}
										>
											{manga.title}
										</div>
									</div>
								{/if}
								{#if manga.inLibrary}
									<div
										class="variant-filled-primary badge absolute right-1 top-1"
									>
										In Library
									</div>
								{/if}
							</MangaCard>
							{#if $Meta.Display === display.Comfortable}
								<div class="variant-glass-surface rounded-b-lg">
									<div
										class="line-clamp-2 h-12 px-2 text-center"
										title={manga.title}
									>
										{manga.title}
									</div>
								</div>
							{/if}
						</a>
					{/if}
				</div>
				{#if !intersecting && $Meta.Display === display.Comfortable}
					<div class="h-12" />
				{/if}
			</IntersectionObserver>
		{/each}
	</div>
	{#if all.hasNextPage && !isLoading}
		<IntersectionObserver
			root={document.querySelector('#page') ?? undefined}
			top={400}
			bottom={400}
			on:intersect={(e) => {
				if (e.detail) page++;
			}}
		/>
	{/if}
{/if}
{#if mainerror}
	{JSON.stringify(mainerror)}
{/if}
