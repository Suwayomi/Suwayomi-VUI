<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import MangaCard from '$lib/components/ImageCard.svelte';
	import { longPress } from '$lib/press';
	import {
		categoryFilterMetasReadOnly,
		display,
		gmState,
		rotate
	} from '$lib/simpleStores.svelte';
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import { queryParameters, ssp } from 'sveltekit-search-params';
	import LibraryActions from './libraryActions.svelte';
	import { selectState, type MangaType } from './LibraryStores.svelte';
	import { onMount } from 'svelte';
	import { actionState } from '$lib/MountTitleAction.svelte';
	import { errortoast, queryState } from '$lib/util.svelte';
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	import {
		makeSearchPart,
		parseQuery,
		type ANO,
		type parsedQueryType
	} from './queryParse';
	import { getCategories, getCategory, trackers } from '$lib/gql/Queries';
	import { getContextClient } from '@urql/svelte';
	import {
		IntersectionObserverAction,
		MakeSimpleCallback
	} from '$lib/actions/IntersectionObserver.svelte';
	import { SvelteMap, SvelteSet } from 'svelte/reactivity';
	import FakeMangaItem from '$lib/components/FakeMangaItem.svelte';

	const client = getContextClient();

	const categories = queryState({
		client,
		query: getCategories
	});

	const trackers_data = queryState({
		client,
		query: trackers
	});

	actionState.AppBarData('Library', {
		component: LibraryActions,
		props: {
			selectAll
		}
	});

	onMount(() => {
		selectState.selectMode = false;
		return () => {
			selectState.selectMode = false;
		};
	});

	let lastSelected: MangaType | undefined = $state();

	const params = queryParameters({
		tab: ssp.number(0),
		q: ssp.string()
	});

	let FilterMeta = $derived(categoryFilterMetasReadOnly($params.tab));

	function validateParsedQuery(query: parsedQueryType) {
		if (query === null) return;
		if (query.length === 0) return;
		if (query.length < 2) return;

		const anos = query.slice(1) as ANO[];

		validateANOs(anos);
	}

	function validateANOs(anos: ANO[]) {
		anos.forEach((e) => {
			switch (e.type) {
				case 'and':
				case 'not':
					return validateToBaseData(e.base, e.value.replaceAll('_', ' '));
				case 'or':
					return validateANOs(e.value);
			}
		});
	}

	function validateToBaseData(base: string, compare: string) {
		switch (base) {
			case 't':
			case 'title':
			case 'd':
			case 'description':
			case 'g':
			case 'genre':
			case 'a':
			case 'artist':
			case 'au':
			case 'author':
			case 's':
			case 'source':
			case 'st':
			case 'status':
			case '|':
				return;
			default:
				errortoast(
					'Invalid Base',
					`base: ${base} in string ${base}:${compare}`
				);
		}
	}

	function LongHandler() {
		selectState.selectMode = true;
	}

	function OrSearch(manga: MangaType, query: ANO[]): boolean {
		const ind = query.findIndex((e) => e.value === '|');
		if (ind === -1)
			return specificSearch(manga, query).findIndex((e) => e === false) === -1;
		const before = query.slice(0, ind);
		const after = query.slice(ind + 1);
		return (
			specificSearch(manga, before).findIndex((e) => e === false) === -1 ||
			OrSearch(manga, after)
		);
	}

	function specificSearch(manga: MangaType, query: ANO[]): boolean[] {
		const comparason = query.flatMap((e) => {
			switch (e.type) {
				case 'and':
					return compareToBaseData(manga, e.base, e.value);
				case 'not':
					return !compareToBaseData(manga, e.base, e.value);
				case 'or':
					return OrSearch(manga, e.value);
			}
		});
		return comparason; //-1 === comparason.findIndex((e) => e === false);
	}

	function compareToBaseData(
		manga: MangaType,
		base: string,
		compare: string
	): boolean {
		// base strings: title, description, genre, artist, author, source
		switch (base) {
			case 't':
			case 'title':
				return makeSearchPart(manga.title).includes(compare);
			case 'd':
			case 'description':
				return makeSearchPart(manga.description).includes(compare) ?? false;
			case 'g':
			case 'genre':
				return manga.genre.some((e) => makeSearchPart(e).includes(compare));
			case 'a':
			case 'artist':
				return makeSearchPart(manga.artist).includes(compare) ?? false;
			case 'au':
			case 'author':
				return makeSearchPart(manga.author).includes(compare) ?? false;
			case 's':
			case 'source':
				return (
					makeSearchPart(manga.source?.displayName).includes(compare) ?? false
				);
			case 'st':
			case 'status':
				return makeSearchPart(manga.status).includes(compare);
			case 'tr':
			case 'tracked':
				return manga.trackRecords.nodes.some((e) =>
					makeSearchPart(
						trackers_data.data?.trackers.nodes.find((f) => f.id === e.trackerId)
							?.name
					).includes(compare)
				);
			default:
				return true;
		}
	}

	function shuffle<T>(array: T[]) {
		var tmp,
			current,
			top = array.length;

		if (top)
			while (--top) {
				current = Math.floor(Math.random() * (top + 1));
				tmp = array[current];
				array[current] = array[top];
				array[top] = tmp;
			}

		return array;
	}

	function selectAll() {
		selectState.SelectAll(sortedMangas);
	}

	$inspect('query', $params.q);
	let [err, parsedQuery] = $derived(parseQuery($params.q));
	$inspect('parsedQuery', parsedQuery);
	$effect(() => {
		if (err !== null) {
			errortoast('Invalid Query', err);
		}
	});
	$effect(() => {
		validateParsedQuery(parsedQuery);
	});
	let orderedCategories = $derived(
		(categories.data?.categories?.nodes ?? [])
			.filter((e) => e.mangas.totalCount)
			.sort((a, b) => {
				return a.order > b.order ? 1 : -1;
			})
	);
	$effect(() => {
		if (
			orderedCategories.length &&
			orderedCategories.find((e) => e.id === $params.tab) === undefined
		) {
			window.requestAnimationFrame(() => {
				$params.tab = orderedCategories[0]?.id;
			});
		}
	});

	let reloadManga = false;
	let resetTimeout: ReturnType<typeof setTimeout> | undefined;

	function visibilityChange() {
		clearTimeout(resetTimeout);
		resetTimeout = undefined;
		if (document.hidden) {
			resetTimeout = setTimeout(() => {
				reloadManga = true;
			}, 60 * 1000);
			return;
		}
		if (!reloadManga) return;
		reloadManga = false;
		client
			.query(
				getCategory,
				{ id: $params.tab },
				{ requestPolicy: 'network-only' }
			)
			.toPromise();
	}

	onMount(() => {
		document.addEventListener('visibilitychange', visibilityChange);
		return () => {
			document.removeEventListener('visibilitychange', visibilityChange);
		};
	});

	let mangas = $derived(
		queryState({
			client,
			query: getCategory,
			variables: { id: $params.tab },
			requestPolicy: 'cache-first'
		})
	);
	$effect(() => {
		if (selectState.selectMode === false) {
			selectState.selected = new SvelteMap();
		}
	});
	let filteredMangas = $derived(
		mangas.data?.category?.mangas.nodes.filter((manga) => {
			if (!manga.inLibrary) return false;
			if (gmState.value.ignoreFiltersWhenSearching) {
				if (
					parsedQuery !== null &&
					specificSearch(manga, parsedQuery).findIndex((e) => e !== false) !==
						-1
				)
					return true;
			}

			if (FilterMeta.value.Downloaded === 'on' && manga.downloadCount === 0)
				return false;
			if (FilterMeta.value.Downloaded === 'off' && manga.downloadCount !== 0)
				return false;

			if (FilterMeta.value.Unread === 'on' && manga.unreadCount === 0)
				return false;
			if (FilterMeta.value.Unread === 'off' && manga.unreadCount !== 0)
				return false;

			if (
				FilterMeta.value.Tracked === 'on' &&
				manga.trackRecords.nodes.length === 0
			)
				return false;
			if (
				FilterMeta.value.Tracked === 'off' &&
				manga.trackRecords.nodes.length !== 0
			)
				return false;

			if (
				parsedQuery !== null &&
				specificSearch(manga, parsedQuery).findIndex((e) => e === false) !== -1
			)
				return false;

			if (FilterMeta.value.SourceFilter.length > 0) {
				if (
					FilterMeta.value.SourceFilter.find((e) => e === manga.source?.id) ===
					undefined
				)
					return false;
			}

			return true;
		})
	);

	const updatedTotals: SvelteMap<number, number> = $state(new SvelteMap());

	$effect(() => {
		if (!filteredMangas) return;
		updatedTotals.set($params.tab, filteredMangas.length);
	});

	$effect(() => {
		if (selectState.selectMode && selectState.selected.size > 0) {
			selectState.selected.keys().forEach((ele) => {
				if (filteredMangas !== undefined) {
					const tmp = filteredMangas.findIndex((elem) => elem.id === ele);
					if (tmp === -1) selectState.selected.delete(ele);
				}
			});
		}
	});
	let sortedMangas = $derived(
		filteredMangas
			? FilterMeta.value.Sort === 'Random'
				? shuffle([...filteredMangas])
				: [...filteredMangas].sort((a, b) => {
						let tru = true;
						switch (FilterMeta.value.Sort) {
							case 'ID':
								tru = a.id > b.id;
								break;
							case 'Unread':
								tru = a.unreadCount > b.unreadCount;
								break;
							case 'Alphabetical':
								tru = a.title > b.title;
								break;
							case 'Artist':
								tru = (a.artist ?? '') > (b.artist ?? '');
								break;
							case 'Author':
								tru = (a.author ?? '') > (b.author ?? '');
								break;
							case 'Read':
								tru =
									parseInt(a.lastReadChapter?.lastReadAt ?? '0') >
									parseInt(b.lastReadChapter?.lastReadAt ?? '0');
								break;
							case 'Fetched':
								tru =
									parseInt(a.latestFetchedChapter?.fetchedAt ?? '0') >
									parseInt(b.latestFetchedChapter?.fetchedAt ?? '0');
								break;
							case 'Uploaded':
								tru =
									parseInt(a.latestUploadedChapter?.uploadDate ?? '0') >
									parseInt(b.latestUploadedChapter?.uploadDate ?? '0');
								break;
							case 'Added':
								tru =
									parseInt(a.inLibraryAt ?? '0') >
									parseInt(b.inLibraryAt ?? '0');
								break;
						}

						if (FilterMeta.value.Ascending) tru = !tru;
						return tru ? -1 : 1;
					})
			: undefined
	);

	let intersecting: SvelteSet<number> = $state(new SvelteSet());
</script>

{#if categories.fetching}
	<div class="mb-3 flex h-[47px] items-center space-x-4 pl-4">
		<div class="placeholder w-20 animate-pulse"></div>
		<div class="placeholder w-20 animate-pulse"></div>
		<div class="placeholder w-20 animate-pulse"></div>
	</div>
	<div class="yoy m-2 grid gap-2 {rotate.gridValues}">
		<FakeMangaItem active={true} count={30} />
	</div>
{:else if categories.error}
	<div class="whitespace-pre-wrap">
		Error loading categories: {JSON.stringify(categories.error, null, 4)}
	</div>
{:else}
	<TabGroup>
		{#if orderedCategories}
			{#each orderedCategories as cat}
				<Tab bind:group={$params.tab} name={cat.name} value={cat.id}>
					{#snippet lead()}
						{cat.name}
						{#if FilterMeta.value.TotalCounts && cat.mangas.totalCount > 0}
							<span
								class="variant-filled-surface m-0 rounded-full px-1 text-sm"
							>
								{#if updatedTotals.has(cat.id)}
									{updatedTotals.get(cat.id)}
								{:else}
									{cat.mangas.totalCount}
								{/if}
							</span>
						{/if}
					{/snippet}
				</Tab>
			{/each}
		{/if}
		<svelte:fragment slot="panel">
			{#if mangas.fetching}
				<div class="yoy m-2 grid gap-2 {rotate.gridValues}">
					<FakeMangaItem
						active={true}
						count={orderedCategories.find((e) => e.id === $params.tab)?.mangas
							.totalCount ?? 10}
					/>
				</div>
			{:else if mangas.error}
				<div class="whitespace-pre-wrap">
					Error loading mangas: {JSON.stringify(mangas.error, null, 4)}
				</div>
			{:else if sortedMangas}
				<div class="yoy grid {rotate.gridValues} m-2 gap-2">
					{#each sortedMangas as manga (manga.id)}
						<div
							class="aspect-cover"
							use:IntersectionObserverAction={{
								root: document.querySelector('#page') ?? undefined,
								rootMargin: `400px 0px 400px 0px`,
								callback: MakeSimpleCallback(intersecting, manga.id)
							}}
						>
							{#if intersecting.has(manga.id)}
								<a
									draggable={false}
									use:longPress
									onlongPress={() => selectState.selectMode || LongHandler()}
									href="/manga/{manga.id}"
									onclick={(e) => {
										if (e.ctrlKey) return;
										if (selectState.selectMode) {
											e.stopPropagation();
											e.preventDefault();
											lastSelected = selectState.DoSelect(
												manga,
												e,
												lastSelected,
												sortedMangas
											);
										}
									}}
									class="h-full cursor-pointer hover:opacity-70"
									tabindex="-1"
								>
									<MangaCard
										draggable={false}
										thumbnailUrl={manga.thumbnailUrl ?? ''}
										title={manga.title}
										class="select-none {selectState.selectMode && 'opacity-80'}"
										rounded="{FilterMeta.value.Display === display.Compact &&
											'rounded-lg'}
													{FilterMeta.value.Display === display.Comfortable &&
											'rounded-none rounded-t-lg'}"
									>
										<div class="absolute left-2 top-2 flex">
											{#if manga.downloadCount && FilterMeta.value.DownloadsBadge}
												<div
													class="{manga.unreadCount &&
													FilterMeta.value.UnreadBadge
														? 'rounded-l'
														: 'rounded'}
																variant-filled-primary m-0 px-1 py-0.5"
												>
													{manga.downloadCount}
												</div>
											{/if}
											{#if manga.unreadCount && FilterMeta.value.UnreadBadge}
												<div
													class="{manga.downloadCount &&
													FilterMeta.value.DownloadsBadge
														? 'rounded-r'
														: 'rounded'}
																variant-filled-secondary m-0 px-1 py-0.5"
												>
													{manga.unreadCount}
												</div>
											{/if}
										</div>
										{#if selectState.selectMode}
											<div
												class="bg-base-100/75 absolute bottom-0 left-0 right-0 top-0 cursor-pointer"
											>
												<IconWrapper
													name={selectState.selected.get(manga.id) === undefined
														? 'fluent:checkbox-unchecked-24-filled'
														: 'fluent:checkbox-checked-24-filled'}
													class="absolute right-2 top-2 text-4xl"
												/>
											</div>
										{/if}
										{#if FilterMeta.value.Display === display.Compact}
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
									</MangaCard>
									{#if FilterMeta.value.Display === display.Comfortable}
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
							{:else}
								<div class="aspect-cover w-full"></div>
								{#if FilterMeta.value.Display === display.Comfortable}
									<div class="h-12"></div>
								{/if}
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</svelte:fragment>
	</TabGroup>
{/if}
