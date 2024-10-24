<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { run } from 'svelte/legacy';

	import Image from '../lib/components/Image.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import IconWrapper from '../lib/components/IconWrapper.svelte';
	import { FindLangName } from './(app)/browse/languages';
	import { goto } from '$app/navigation';
	import { untrack, type SvelteComponent } from 'svelte';
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

	interface Props {
		parent: SvelteComponent;
	}

	let { parent }: Props = $props();

	const modalStore = getModalStore();
	const query = queryParam('q', ssp.string(), { pushHistory: false });

	let value = $state('');

	type helpItem = {
		str: string;
		firstLine: string;
	};
	type categoryItem = {
		icon: string;
		url: string;
		firstLineBoldText: string;
	};
	type mangaItem = {
		img: string;
		url: string;
		firstLine: string;
		secondLineBoldText: string;
	};
	type chapterItem = {
		img: string;
		url: string;
		firstLine: string;
		secondLineBoldText: string;
	};

	type sourceItem = {
		img: string;
		url: string;
		firstLineBoldText: string;
		firstLine?: string;
		secondLine: string;
	};

	type item = helpItem | categoryItem | mangaItem | chapterItem | sourceItem;

	let items: item[] = $state([]);
	let inputElement: boolean = $state(false);

	const help: item[] = [
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

	const client = getContextClient();

	let sources: OperationResultStore<ResultOf<typeof getSources>> & Pausable;

	let categories = queryStore({
		client,
		query: getCategories
	});

	let catId: undefined | number = $state(undefined);
	let mangaId: undefined | number = $state(undefined);

	let category:
		| (OperationResultStore<ResultOf<typeof getCategory>> & Pausable)
		| undefined = $state();

	let manga:
		| (OperationResultStore<ResultOf<typeof getManga>> & Pausable)
		| undefined = $state();

	async function doCategory() {
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
			if (mangaSearch !== undefined && includeCategory?.[0]) {
				catId = includeCategory[0].id;
				includeMangas = await new Promise((resolve) => {
					window.requestAnimationFrame(() => {
						let unSub = () => {};
						unSub =
							category?.subscribe((ee) => {
								if (ee?.data?.category?.mangas?.nodes) {
									unSub();
									resolve(
										ee.data.category.mangas.nodes.filter((e) =>
											e.title.toLowerCase().includes(mangaSearch.toLowerCase())
										)
									);
								}
							}) ?? (() => {});
					});
				});

				if (chapterNameSearch !== undefined && includeMangas?.[0]) {
					mangaId = includeMangas[0].id;
					includeChapters = await new Promise((resolve) => {
						let unSub = () => {};
						unSub =
							manga?.subscribe((ee) => {
								if (ee?.data?.manga?.chapters?.nodes) {
									unSub();
									resolve(
										ee.data.manga.chapters.nodes.filter((e) =>
											e.name
												.toLowerCase()
												.includes(chapterNameSearch.toLowerCase())
										)
									);
								}
							}) ?? (() => {});
					});
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
			if ('url' in items[0]) {
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

	let inputEl: HTMLInputElement | undefined = $state(undefined);
	$effect(() => {
		if (value === '') {
			items = help;
		}
	});
	$effect(() => {
		const _ = [$category, $categories, value];
		untrack(doCategory);
	});
	$effect(() => {
		const _ = [$sources, value];
		untrack(doSource);
	});
	$effect(() => {
		if (catId === undefined) return;
		untrack(() => {
			if (catId === undefined) return;
			category = queryStore({
				client,
				query: getCategory,
				variables: { id: catId }
			});
		});
	});
	$effect(() => {
		if (!mangaId) return;
		untrack(() => {
			if (!mangaId) return;
			manga = queryStore({
				client,
				query: getManga,
				variables: { id: mangaId }
			});
		});
	});
	$effect(() => {
		if ($modalStore[0]) {
			window.addEventListener('keydown', handelArrows);
		} else {
			window.removeEventListener('keydown', handelArrows);
		}
	});
</script>

{#if $modalStore[0]}
	<div class="w-modal flex max-h-dvh flex-col">
		<input
			onfocus={() => (inputElement = true)}
			onblur={() => (inputElement = false)}
			bind:value
			bind:this={inputEl}
			onkeydown={handelKey}
			class="tabindex input rounded-2xl"
			type="text"
		/>
		<div tabindex="-1" class="card mt-1 max-h-full overflow-y-auto rounded-2xl">
			{#each items as item, index}
				<a
					tabindex={index !== 0 ? 0 : -1}
					onclick={() => {
						if ('url' in item) parent.onClose();
					}}
					href={'url' in item ? item.url : undefined}
					class="
					{index !== 0 && 'tabindex '}
					flex flex-nowrap justify-start p-2 outline-0 hover:variant-glass
					focus:variant-glass-primary first:rounded-t-2xl last:rounded-b-2xl
					{inputElement && index === 0 && 'variant-glass-primary'}"
				>
					<div class="mr-4">
						{#if 'img' in item}
							<Image
								class="aspect-square "
								height="h-12"
								width="w-auto"
								src={item.img}
								alt="img"
							/>
						{:else if 'icon' in item}
							<IconWrapper class="aspect-square h-full" name={item.icon} />
						{:else}
							<div class="flex h-full items-center">
								{item.str}
							</div>
						{/if}
					</div>
					<div class="flex flex-col justify-center">
						{#if 'firstLine' in item || 'firstLineBoldText' in item}
							<div class="line-clamp-1">
								<span class="text-sm">
									{'firstLine' in item ? item.firstLine : ''}
								</span>
								<span class="font-bold">
									{'firstLineBoldText' in item ? item.firstLineBoldText : ''}
								</span>
							</div>
						{/if}
						{#if 'secondLine' in item || 'secondLineBoldText' in item}
							<div class="line-clamp-1">
								<span class="text-md opacity-70">
									{'secondLine' in item ? item.secondLine : ''}
								</span>
								<span class="font-bold">
									{'secondLineBoldText' in item ? item.secondLineBoldText : ''}
								</span>
							</div>
						{/if}
					</div>
				</a>
			{/each}
		</div>
	</div>
{/if}
