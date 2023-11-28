<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { getToastStore } from '$lib/components/Toast/stores';
	import {
		FetchSourceMangaType,
		fetchSourceManga,
		type FetchSourceMangaMutation,
		type FilterChangeInput,
		type InputMaybe
	} from '$lib/generated';
	import type { LayoutData } from './$types';
	import type { FetchResult } from '@apollo/client';
	import { errortoast, gridValues } from '$lib/util';
	import IntersectionObserver from '$lib/components/IntersectionObserver.svelte';
	import MangaCard from '$lib/components/MangaCard.svelte';
	import { selectmode, selected } from '../../../(library)/LibraryStores';
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	import PreferencesModal from './PreferencesModal.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { Meta, display } from '$lib/simpleStores';

	export let data: LayoutData;
	export let type: FetchSourceMangaType;
	export let query: InputMaybe<string> | undefined = undefined;
	export let filters: InputMaybe<FilterChangeInput | FilterChangeInput[]> | undefined = undefined;

	let sause = data.sause;
	const toastStore = getToastStore();
	const modalStore = getModalStore();

	let page = 1;
	let isLoading = true;
	let all: FetchSourceMangaMutation['fetchSourceManga'] = {
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

	$: Asysource = fetchSourceManga({
		variables: {
			page: page,
			source: data.sourceID,
			type,
			query,
			filters
		}
	});

	$: parseall(Asysource);

	async function parseall(Asysource: Promise<FetchResult<FetchSourceMangaMutation>>) {
		isLoading = true;
		try {
			const result = await Asysource;
			if (!result.data) throw new Error('Missing data');
			all.hasNextPage = result.data.fetchSourceManga.hasNextPage;
			all.mangas.push(...result.data.fetchSourceManga.mangas);
			all = all;
		} catch (error) {
			if (error instanceof Error) {
				console.error(error);
				if (error.message.includes('Already on the Last Page!')) {
					all.hasNextPage = false;
				}
				mainerror = error;
				errortoast(toastStore, 'failed to load page', error.message);
			}
			errortoast(toastStore, 'failed to load page', JSON.stringify(error));
		}
		isLoading = false;
	}
</script>

{#if $sause.data.source?.isConfigurable}
	<button
		on:click={() => {
			modalStore.trigger({
				type: 'component',
				component: { ref: PreferencesModal, props: { data, clearAll } }
			});
		}}
		class="btn variant-filled-primary hover:bg-primary-500/70 fixed top-20 right-4 h-12 z-40"
	>
		<IconWrapper name="mdi:filter-outline" class="w-auto h-full" />
		SourceSettings
	</button>
{/if}

{#if !all}
	<div class="yoy grid m-2 gap-2 {gridValues}">
		{#each new Array(30) as _}
			<div class="aspect-cover w-full">
				<div
					class="placeholder animate-pulse h-full
						{$Meta.Display === display.Compact && 'rounded-lg'}
						{$Meta.Display === display.Comfortable && 'rounded-none rounded-t-lg'}"
				/>
				{#if $Meta.Display === display.Comfortable}
					<div class="placeholder animate-pulse px-2 h-12 text-center rounded-none rounded-b-lg" />
				{/if}
			</div>
		{/each}
	</div>
{:else if all.mangas}
	<div class="grid m-2 gap-2 {gridValues}">
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
							class="hover:opacity-70 cursor-pointer h-full"
							tabindex="-1"
						>
							<MangaCard
								thumbnailUrl={manga.thumbnailUrl ?? ''}
								title={manga.title}
								rounded="{$Meta.Display === display.Compact && 'rounded-lg'}
										{$Meta.Display === display.Comfortable && 'rounded-none rounded-t-lg'}"
							>
								{#if $selectmode}
									<div class="cursor-pointer absolute top-0 right-0 left-0 bottom-0 bg-base-100/75">
										<IconWrapper
											name={$selected[manga.id] === undefined
												? 'fluent:checkbox-unchecked-24-filled'
												: 'fluent:checkbox-checked-24-filled'}
											class="text-4xl absolute top-2 right-2"
										/>
									</div>
								{/if}
								{#if $Meta.Display === display.Compact}
									<div class="absolute bottom-0 left-0 right-0 variant-glass rounded-b-olg">
										<div class="line-clamp-2 px-2 h-12 text-center" title={manga.title}>
											{manga.title}
										</div>
									</div>
								{/if}
							</MangaCard>
							{#if $Meta.Display === display.Comfortable}
								<div class="variant-glass-surface rounded-b-lg">
									<div class="line-clamp-2 px-2 h-12 text-center" title={manga.title}>
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
