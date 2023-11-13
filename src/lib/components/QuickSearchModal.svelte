<script lang="ts">
	import Image from './Image.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import IconWrapper from './IconWrapper.svelte';
	import {
		sources as getSources,
		type Exact,
		type InputMaybe,
		type SourcesQuery,
		categories as getCategories,
		category as getCategory,
		type CategoryQuery,
		getManga,
		type GetMangaQuery,
		type GetMangaQueryVariables
	} from '$lib/generated';
	import type { Readable } from 'svelte/motion';
	import type { ApolloQueryResult, ObservableQuery } from '@apollo/client';
	import { ISOLanguages } from '../../routes/(app)/browse/languages';
	import { goto } from '$app/navigation';
	import type { SvelteComponent } from 'svelte';
	export let parent: SvelteComponent;

	const modalStore = getModalStore();
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
		}
	];

	$: if (value === '') {
		items = help;
	}

	let sources: Readable<
		ApolloQueryResult<SourcesQuery> & {
			query: ObservableQuery<
				SourcesQuery,
				Exact<{
					isNsfw?: InputMaybe<boolean> | undefined;
				}>
			>;
		}
	>;

	let categories = getCategories({});

	let catId: undefined | number = undefined;
	let mangaId: undefined | number = undefined;

	let category: Readable<
		ApolloQueryResult<CategoryQuery> & {
			query: ObservableQuery<
				CategoryQuery,
				Exact<{
					id: number;
				}>
			>;
		}
	>;

	let manga: Readable<
		ApolloQueryResult<GetMangaQuery> & {
			query: ObservableQuery<GetMangaQuery, GetMangaQueryVariables>;
		}
	>;

	$: $category, $categories, value, doCategory();
	$: $sources, value, doSource();

	function doCategory() {
		if (value.startsWith('#')) {
			const parsed = value.slice(1).split(/[/:]/);
			const categorySearch: string | undefined = parsed[0];
			const mangaSearch: string | undefined = parsed[1];
			const chapterNameSearch: string | undefined = parsed[2];
			const includeCategory = $categories.data?.categories.nodes.filter((e) =>
				e.name.toLowerCase().includes(categorySearch.toLowerCase())
			);
			let includeMangas: CategoryQuery['category']['mangas']['nodes'] | undefined = undefined;
			let includeChapters: GetMangaQuery['manga']['chapters']['nodes'] | undefined = undefined;
			if (mangaSearch && includeCategory[0]) {
				catId = includeCategory[0].id;
				includeMangas = $category?.data?.category?.mangas.nodes.filter((e) =>
					e.title.toLowerCase().includes(mangaSearch.toLowerCase())
				);
				if (chapterNameSearch && includeMangas[0]) {
					mangaId = includeMangas[0].id;
					includeChapters = $manga?.data?.manga?.chapters.nodes.filter((e) =>
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
			console.log(includeMangas, includeCategory);
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
			if (!sources) sources = getSources({});
			const parsed = value.slice(1).split('/');
			const sourceSearch: string | undefined = parsed[0];
			const mangaSearch: string | undefined = parsed[1];
			const includeSource = $sources.data?.sources?.nodes.filter((e) =>
				e.displayName.toLowerCase().includes(sourceSearch.toLowerCase())
			);
			if (includeSource) {
				items = includeSource.map((e) => {
					return {
						img: e.iconUrl,
						url: mangaSearch
							? `/browse/source/${e.id}/filter?q=${mangaSearch}`
							: `/browse/source/${e.id}/popular`,
						firstLineBoldText: mangaSearch ? mangaSearch : e.displayName,
						firstLine: mangaSearch ? e.displayName + ' /' : undefined,
						secondLine:
							ISOLanguages.find((ele) => ele.code.toLowerCase() === e.lang.toLowerCase())
								?.nativeName ?? e.lang
					};
				});
			}
		}
	}

	function handelKey(event: KeyboardEvent) {
		if (event.key === 'Enter' && items[0].url) {
			goto(items[0].url);
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

	$: if (catId !== undefined) category = getCategory({ variables: { id: catId } });
	$: if (mangaId) manga = getManga({ variables: { id: mangaId } });

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
		<div class="card mt-1 rounded-2xl max-h-96 overflow-y-auto">
			{#each items as item, index}
				<a
					tabindex={index !== 0 ? 0 : -1}
					on:click={() => {
						if (item.url) parent.onClose();
					}}
					href={item.url}
					class="{index !== 0 && 'tabindex'} flex flex-nowrap hover:variant-glass p-2 outline-0
					first:rounded-t-2xl last:rounded-b-2xl
					focus:variant-glass-primary {inputElement && 'first:variant-glass-primary'}"
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
							<div class="h-full flex items-center">
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
