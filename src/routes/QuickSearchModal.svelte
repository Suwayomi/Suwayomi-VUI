<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import Image from '../lib/components/Image.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import IconWrapper from '../lib/components/IconWrapper.svelte';
	import { FindLangName } from './(app)/browse/languages';
	import { goto } from '$app/navigation';
	import type { SvelteComponent } from 'svelte';
	import { SourceLangFilter } from './(app)/browse/sources/SourcesStores';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import { page } from '$app/stores';
	import { getContextClient, queryStore } from '@urql/svelte';
	import {
		getCategories,
		getCategory,
		getManga,
		getSources
	} from '$lib/gql/Queries';
	import type { OperationResultStore, Pausable } from '@urql/svelte';
	import type { ResultOf } from '$lib/gql/graphql';
	import { ChapterTypeFragment } from '$lib/gql/Fragments';

	export let parent: SvelteComponent;

	const modalStore = getModalStore();
	const query = queryParam('q', ssp.string(), { pushHistory: false });

	let value = '';
	let items: {
		img?: string;
		icon?: string;
		str?: string;
		firstLine?: string;
		firstLineBoldText?: string;
		secondLine?: string;
		secondLineBoldText?: string;
		url?: string;
	}[] = [];
	let inputElement: boolean;

	const help: typeof items = [
		{
			str: '@S',
			firstLine: "Go to Source 'S'"
		},
		{
			str: '@S/M',
			firstLine: "Search for Manga 'M' in Source 'S'"
		},
		{
			str: '#C',
			firstLine: "Go to Category 'C'"
		},
		{
			str: '#C/M',
			firstLine: "Go to Manga 'M' in Category 'C'"
		},
		{
			str: '#C/M:CN',
			firstLine: "Go to Chapter 'CN' from Manga 'M' in Category 'C'"
		},
		{
			str: 'X',
			firstLine: 'will search, depends on context of the page'
		}
	];

	$: if (value === '') {
		items = help;
	}
	const client = getContextClient();

	let sources: OperationResultStore<ResultOf<typeof getSources>> & Pausable;

	let categories = queryStore({
		client,
		query: getCategories
	});

	let catId: undefined | number = undefined;
	let mangaId: undefined | number = undefined;

	let category: OperationResultStore<ResultOf<typeof getCategory>> & Pausable;

	let manga: OperationResultStore<ResultOf<typeof getManga>> & Pausable;

	$: $category, $categories, value, doCategory();
	$: $sources, value, doSource();

	function doCategory() {
		if (value.startsWith('#')) {
			const parsed = value.slice(1).split(/[/:]/);
			const categorySearch: string | undefined = parsed[0];
			const mangaSearch: string | undefined = parsed[1];
			const chapterNameSearch: string | undefined = parsed[2];
			const includeCategory = $categories.data?.categories.nodes?.filter((e) =>
				e.name.toLowerCase().includes(categorySearch.toLowerCase())
			);
			let includeMangas:
				| ResultOf<typeof getCategory>['category']['mangas']['nodes']
				| undefined = undefined;
			let includeChapters: ResultOf<typeof ChapterTypeFragment>[] | undefined =
				undefined;
			if (mangaSearch && includeCategory?.[0]) {
				catId = includeCategory[0].id;
				includeMangas = $category?.data?.category?.mangas.nodes.filter((e) =>
					e.title.toLowerCase().includes(mangaSearch.toLowerCase())
				);
				if (chapterNameSearch && includeMangas?.[0]) {
					mangaId = includeMangas[0].id;
					includeChapters = $manga?.data?.manga?.chapters.nodes?.filter((e) =>
						e.name.toLowerCase().includes(chapterNameSearch.toLowerCase())
					);
				}
			}

			if (includeChapters && includeMangas) {
				const Manga = includeMangas[0];
				items = includeChapters.map((e) => {
					return {
						img: Manga.thumbnailUrl ?? '',
						url: `/manga/${Manga.id}/chapter/${e.id}`,
						firstLine: Manga.title + '/',
						secondLineBoldText: e.name
					};
				});
				return;
			}
			if (includeMangas && includeCategory) {
				const cat = includeCategory[0];
				items = includeMangas.map((Manga) => {
					return {
						img: Manga.thumbnailUrl ?? '',
						url: `/manga/${Manga.id}`,
						firstLine: cat.name + '/',
						secondLineBoldText: Manga.title + '/'
					};
				});
				return;
			}
			if (includeCategory) {
				items = includeCategory.map((cat) => {
					return {
						icon: 'mdi:theme',
						url: `/?tab=${cat.id}`,
						firstLineBoldText: cat.name
					};
				});
				return;
			}
		}
	}

	function doSource() {
		if (value.startsWith('@')) {
			if (!sources) sources = queryStore({ client, query: getSources });
			const parsed = value.slice(1).split('/');
			const sourceSearch: string | undefined = parsed[0];
			const mangaSearch: string | undefined = parsed[1];
			const includeSource = $sources.data?.sources?.nodes
				?.filter((e) =>
					e.displayName.toLowerCase().includes(sourceSearch.toLowerCase())
				)
				.filter((e) => $SourceLangFilter.has(e.lang));
			if (includeSource) {
				items = includeSource.map((e) => {
					return {
						img: e.iconUrl,
						url: mangaSearch
							? `/browse/source/${e.id}/filter?q=${mangaSearch}`
							: `/browse/source/${e.id}/popular`,
						firstLineBoldText: mangaSearch ? mangaSearch : e.displayName,
						firstLine: mangaSearch ? e.displayName + ' /' : undefined,
						secondLine: FindLangName(e.lang)
					};
				});
			}
		}
	}

	function handelKey(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			if (items[0].url) {
				goto(items[0].url);
			} else if (!['#', '@'].includes(value[0])) {
				if (
					/(\/browse\/source\/\d*\/)popular|latest/.test($page.url.pathname)
				) {
					goto(
						$page.url.pathname.replace(
							/(\/browse\/source\/\d*\/)popular|latest/,
							`$1filter?q=${value}`
						)
					);
				} else query.set(value);
			}
			parent.onClose();
		}
	}

	function handelArrows(event: KeyboardEvent) {
		if (event.key === 'ArrowDown') {
			const tabElements = [...document.querySelectorAll('.tabindex')] as (
				| HTMLInputElement
				| HTMLAnchorElement
			)[];
			const index = tabElements.findIndex((e) => e === document.activeElement);
			let nextIndex: number;
			if (index === tabElements.length - 1) nextIndex = 0;
			else nextIndex = index + 1;
			const next = tabElements[nextIndex];
			next.focus();
			return;
		}
		if (event.key === 'ArrowUp') {
			const tabElements = [...document.querySelectorAll('.tabindex')] as (
				| HTMLInputElement
				| HTMLAnchorElement
			)[];
			const index = tabElements.findIndex((e) => e === document.activeElement);
			let previousIndex: number;
			if (index === 0) previousIndex = tabElements.length - 1;
			else previousIndex = index - 1;
			const previous = tabElements[previousIndex];
			previous.focus();
			return;
		}
	}

	$: if (catId !== undefined)
		category = queryStore({
			client,
			query: getCategory,
			variables: { id: catId }
		});
	$: if (mangaId)
		manga = queryStore({ client, query: getManga, variables: { id: mangaId } });

	$: if ($modalStore[0]) {
		window.addEventListener('keydown', handelArrows);
	} else {
		window.removeEventListener('keydown', handelArrows);
	}
</script>

{#if $modalStore[0]}
	<div class="w-modal">
		<input
			on:focus={() => (inputElement = true)}
			on:blur={() => (inputElement = false)}
			bind:value
			on:keydown={handelKey}
			class="tabindex input rounded-2xl"
			type="text"
		/>
		<div tabindex="-1" class="card mt-1 max-h-96 overflow-y-auto rounded-2xl">
			{#each items as item, index}
				<a
					tabindex={index !== 0 ? 0 : -1}
					on:click={() => {
						if (item.url) parent.onClose();
					}}
					href={item.url}
					class="{index !== 0 &&
						'tabindex'} flex flex-nowrap p-2 outline-0 hover:variant-glass
					focus:variant-glass-primary first:rounded-t-2xl
					last:rounded-b-2xl {inputElement && 'first:variant-glass-primary'}"
				>
					<div class="pr-4">
						{#if item.img}
							<Image
								class="aspect-square max-h-12"
								height="h-full"
								width="w-auto"
								src={item.img}
								alt="img"
							/>
						{:else if item.icon}
							<IconWrapper class="aspect-square h-full" name={item.icon} />
						{:else if item.str}
							<div class="flex h-full items-center">
								{item.str}
							</div>
						{/if}
					</div>
					<div class="flex flex-col justify-center">
						{#if item.firstLine || item.firstLineBoldText}
							<div class="line-clamp-1">
								<span class="text-sm">{item.firstLine ?? ''}</span>
								<span class="font-bold">{item.firstLineBoldText ?? ''}</span>
							</div>
						{/if}
						{#if item.secondLine || item.secondLineBoldText}
							<div class="line-clamp-1">
								<span class="text-md opacity-70">{item.secondLine ?? ''}</span>
								<span class="font-bold">{item.secondLineBoldText ?? ''}</span>
							</div>
						{/if}
					</div>
				</a>
			{/each}
		</div>
	</div>
{/if}
