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
	import { untrack, type SvelteComponent } from 'svelte';
	import { SourceLangFilter } from './(app)/browse/sources/SourcesStores';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import { page } from '$app/stores';
	import { getContextClient } from '@urql/svelte';
	import {
		ChaptersByName,
		getCategories,
		getCategory,
		getManga,
		getSources,
		MangasByTitle
	} from '$lib/gql/Queries';
	import type { ResultOf, VariablesOf } from '$lib/gql/graphql';
	import { ChapterTypeFragment } from '$lib/gql/Fragments';
	import { queryState, type queryStateReturn } from '$lib/util.svelte';

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
	type mangaItemGlobal = {
		img: string;
		url: string;
		firstLine: string;
	};

	type item =
		| helpItem
		| categoryItem
		| mangaItem
		| chapterItem
		| sourceItem
		| mangaItemGlobal;

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
			str: ':M',
			firstLine: "Search for manga 'M' in Library"
		},
		{
			str: ';C',
			firstLine: "search for chapter 'C' in Library"
		},
		{
			str: 'X',
			firstLine: 'will search, depends on context of the page'
		}
	];

	const client = getContextClient();

	let sources: queryStateReturn<
		ResultOf<typeof getSources>,
		VariablesOf<typeof getSources>
	>;

	let categories = queryState({
		client,
		query: getCategories
	});

	let catId: undefined | number = $state(undefined);
	let mangaId: undefined | number = $state(undefined);

	let category:
		| queryStateReturn<
				ResultOf<typeof getCategory>,
				VariablesOf<typeof getCategory>
		  >
		| undefined = $state();

	let manga:
		| queryStateReturn<ResultOf<typeof getManga>, VariablesOf<typeof getManga>>
		| undefined = $state();

	async function doCategory() {
		if (value.startsWith('#')) {
			const parsed = value.slice(1).split(/[/:]/);
			const categorySearch: string | undefined = parsed[0];
			const mangaSearch: string | undefined = parsed[1];
			const chapterNameSearch: string | undefined = parsed[2];
			const includeCategory = categories.value.data?.categories.nodes?.filter(
				(e) => e.name.toLowerCase().includes(categorySearch.toLowerCase())
			);
			let includeMangas:
				| ResultOf<typeof getCategory>['category']['mangas']['nodes']
				| undefined = undefined;
			let includeChapters: ResultOf<typeof ChapterTypeFragment>[] | undefined =
				undefined;
			if (mangaSearch !== undefined && includeCategory?.[0]) {
				catId = includeCategory[0].id;
				let unSub = () => {};
				includeMangas = await new Promise((resolve) => {
					window.requestAnimationFrame(() => {
						unSub = $effect.root(() => {
							$effect(() => {
								if (category?.value?.data?.category?.mangas?.nodes) {
									resolve(
										category?.value.data.category.mangas.nodes.filter((e) =>
											e.title.toLowerCase().includes(mangaSearch.toLowerCase())
										)
									);
								}
							});
						});
					});
				});
				unSub();

				if (chapterNameSearch !== undefined && includeMangas?.[0]) {
					mangaId = includeMangas[0].id;
					let unSub = () => {};
					includeChapters = await new Promise((resolve) => {
						window.requestAnimationFrame(() => {
							unSub = $effect.root(() => {
								$effect(() => {
									if (manga?.value?.data?.manga.chapters.nodes) {
										resolve(
											manga?.value.data.manga.chapters.nodes.filter((e) =>
												e.name
													.toLowerCase()
													.includes(chapterNameSearch.toLowerCase())
											)
										);
									}
								});
							});
						});
					});
					unSub();
				}
			}

			if (includeChapters && includeMangas) {
				const Manga = includeMangas[0];
				items = includeChapters.map((e) => {
					return {
						img: Manga.thumbnailUrl ?? '',
						url: `/manga/${Manga.id}#${e.id}`,
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
			if (!sources) sources = queryState({ client, query: getSources });
			const parsed = value.slice(1).split('/');
			const sourceSearch: string | undefined = parsed[0];
			const mangaSearch: string | undefined = parsed[1];
			const includeSource = sources.value.data?.sources?.nodes
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

	async function doManga() {
		if (value.startsWith(':')) {
			const mangaTitleSearchString = value.slice(1);
			if (!mangaTitleSearchString) return;
			const result = await client
				.query(MangasByTitle, {
					title: mangaTitleSearchString
				})
				.toPromise();
			items =
				result.data?.mangas.nodes
					.filter((_, i) => i <= 20)
					.map((e) => ({
						img: e.thumbnailUrl ?? '',
						url: `/manga/${e.id}`,
						firstLine: e.title
					})) ?? help;
		}
	}

	async function doChapter() {
		if (value.startsWith(';')) {
			const ChapterTitleSearchString = value.slice(1);
			if (!ChapterTitleSearchString) return;
			const result = await client
				.query(ChaptersByName, {
					name: ChapterTitleSearchString
				})
				.toPromise();
			items =
				result.data?.chapters.nodes.map((e) => ({
					img: e.manga.thumbnailUrl ?? '',
					url: `/manga/${e.manga.id}#${e.id}`,
					firstLine: e.manga.title,
					secondLineBoldText: e.name
				})) ?? help;
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

	$effect(() => {
		if (value === '') {
			items = help;
		}
	});
	$effect(() => {
		const _ = [category?.value, categories.value, value];
		untrack(doCategory);
	});
	$effect(() => {
		const _ = [sources?.value, value];
		untrack(doSource);
	});
	let debounceTimer: NodeJS.Timeout | undefined;
	$effect(() => {
		const _ = [value];
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			untrack(doManga);
			untrack(doChapter);
		}, 300);
	});
	$effect(() => {
		if (catId === undefined) return;
		untrack(() => {
			if (catId === undefined) return;
			category = queryState({
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
			manga = queryState({
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
