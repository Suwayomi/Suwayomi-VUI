<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import type { LayoutData } from './$types';
	import { errortoast, OTT, queryState } from '$lib/util.svelte';
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	import PreferencesModal from './PreferencesModal.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';

	import type { ResultOf, VariablesOf } from '$lib/gql/graphql';
	import { fetchSourceManga } from '$lib/gql/Mutations';
	import { getContextClient, mutationStore } from '@urql/svelte';
	import { getSource } from '$lib/gql/Queries';
	import { SvelteSet } from 'svelte/reactivity';
	import {
		IntersectionObserverAction,
		MakeSimpleCallback
	} from '$lib/actions/IntersectionObserver.svelte';
	import NonLibraryMangaDisplay from '$lib/components/NonLibraryMangaDisplay.svelte';
	import FakeMangaItem from '$lib/components/FakeMangaItem.svelte';
	import { untrack } from 'svelte';
	import { rotate } from '$lib/simpleStores.svelte';

	interface Props {
		data: LayoutData;
		type: VariablesOf<typeof fetchSourceManga>['type'];
		query?: string | undefined;
		filters?: VariablesOf<typeof fetchSourceManga>['filters'] | undefined;
	}

	let { data, type, query = undefined, filters = undefined }: Props = $props();
	const client = getContextClient();

	let sause = $derived.by(() => {
		return OTT([data.sourceID], () => {
			return queryState({
				client: getContextClient(),
				query: getSource,
				variables: {
					id: data.sourceID
				}
			});
		});
	});

	const modalStore = getModalStore();

	let page = $state(1);
	let isLoading = $state(true);
	let all: NonNullable<ResultOf<typeof fetchSourceManga>['fetchSourceManga']> =
		$state({
			hasNextPage: true,
			mangas: []
		});
	let mainerror: string = $state('');

	function clearAll() {
		all = {
			hasNextPage: true,
			mangas: []
		};
		page = 1;
	}

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
	$effect(() => {
		OTT([query, filters], clearAll);
	});
	let source = $derived(
		mutationStore({
			client,
			query: fetchSourceManga,
			variables: {
				page: page,
				source: data.sourceID,
				type,
				query,
				filters
			}
		})
	);
	$effect(() => {
		OTT([$source], parseall);
	});

	let intersecting: SvelteSet<number> = $state(new SvelteSet());
	let newPageIntersecting = $state(false);
	$effect(() => {
		if (
			all.hasNextPage &&
			!isLoading &&
			!$source.fetching &&
			newPageIntersecting
		) {
			untrack(() => {
				page++;
			});
		}
	});
</script>

{#if sause?.data?.source?.isConfigurable}
	<button
		onclick={() => {
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
	<div class="m-2 grid gap-2 {rotate.gridValues}">
		{#each all.mangas.filter((e, i, s) => i === s.findIndex((ee) => e.id === ee.id)) as manga (manga.id)}
			<div
				class="aspect-cover"
				use:IntersectionObserverAction={{
					root: document.querySelector('#page') ?? undefined,
					rootMargin: `400px 0px 400px 0px`,
					callback: MakeSimpleCallback(intersecting, manga.id)
				}}
			>
				<NonLibraryMangaDisplay {manga} {intersecting} />
			</div>
		{/each}
		<div
			use:IntersectionObserverAction={{
				root: document.querySelector('#page') ?? undefined,
				rootMargin: `400px 0px 400px 0px`,
				callback: (e) => {
					newPageIntersecting = e.isIntersecting;
				}
			}}
		>
			<FakeMangaItem active={true} count={1} />
		</div>
		{#if all.hasNextPage}
			<FakeMangaItem
				active={true}
				count={Math.floor(
					(all.mangas.length > 0 ? all.mangas.length : 5) /
						(page > 0 ? page : 1)
				)}
			/>
		{/if}
	</div>
{/if}
{#if mainerror}
	<div class="flex w-full flex-col items-center align-middle">
		ignore error
		<button
			class="variant-filled-primary btn"
			onclick={() => {
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
