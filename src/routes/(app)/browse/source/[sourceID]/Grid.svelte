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
	let all: NonNullable<ResultOf<typeof fetchSourceManga>['fetchSourceManga']> =
		{
			hasNextPage: true,
			mangas: []
		};
	let mainerror: string = '';

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

	$: $source, parseall();

	async function parseall() {
		if ($source.fetching) return;
		isLoading = true;
		try {
			if ($source.error)
				throw new Error(JSON.stringify($source.error, null, 4));
			if (!$source.data?.fetchSourceManga) throw 'no fetchSourceManga data';
			all.hasNextPage = $source.data.fetchSourceManga.hasNextPage;
			all.mangas.push(...$source.data.fetchSourceManga.mangas);
			all = all;
		} catch (error) {
			if (error instanceof Error) {
				all.hasNextPage = false;
				if (error.message.includes('Already on the Last Page!')) {
					isLoading = false;
					return;
				}
				console.error(error);
				mainerror = error.message;
				errortoast('failed to load page', JSON.stringify(error.message));
			}
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
				backdropClasses: '!p-0',
				component: { ref: PreferencesModal, props: { data, clearAll } }
			});
		}}
		class="variant-filled-primary btn fixed right-4 top-20 z-40 h-12 hover:bg-primary-500/70"
	>
		<IconWrapper name="mdi:filter-outline" class="h-full w-auto" />
		SourceSettings
	</button>
{/if}

{#if all.mangas}
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
		{#if all.hasNextPage && !isLoading && !$source.fetching}
			<IntersectionObserver
				root={document.querySelector('#page') ?? undefined}
				top={400}
				bottom={400}
				on:intersect={(e) => {
					if (e.detail && all.hasNextPage) page++;
				}}
			/>
		{/if}
		{#if all.hasNextPage}
			{#each new Array(Math.floor((all.mangas.length > 0 ? all.mangas.length : 5) / (page > 0 ? page : 1))) as _}
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
		{/if}
	</div>
{/if}
{#if mainerror}
	<div class="flex w-full flex-col items-center align-middle">
		ignore error
		<button
			class="variant-filled-primary btn"
			on:click={() => {
				mainerror = '';
				all.hasNextPage = true;
			}}
		>
			continue
		</button>
	</div>
	<div class="whitespace-pre-wrap">
		{mainerror}
	</div>
{/if}
