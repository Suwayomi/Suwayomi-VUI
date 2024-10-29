<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import IntersectionObserver from '$lib/components/IntersectionObserver.svelte';
	import MangaCard from '$lib/components/MangaCard.svelte';
	import { longPress } from '$lib/press';
	import { display, gmState, sort } from '$lib/simpleStores.svelte';
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import LibraryActions from './libraryActions.svelte';
	import { selected, selectMode, type MangaType } from './LibraryStores';
	import { onMount, untrack } from 'svelte';
	import { AppBarData } from '$lib/MountTitleAction';
	import {
		errortoast,
		gridValues,
		HelpDoSelect,
		HelpSelectAll,
		queryState
	} from '$lib/util.svelte';
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	import { parseQuery, type ANO, type parsedQueryType } from './queryParse';
	import { getCategories, getCategory } from '$lib/gql/Queries';
	import { getContextClient } from '@urql/svelte';

	const client = getContextClient();

	const categories = queryState({
		client,
		query: getCategories
	});

	AppBarData('Library', {
		component: LibraryActions,
		props: {
			selectAll
		}
	});

	onMount(() => {
		$selectMode = false;
		return () => {
			$selectMode = false;
		};
	});

	let lastSelected: MangaType | undefined = $state();

	const query = queryParam('q', ssp.string(), { pushHistory: false });
	const tab = queryParam('tab', ssp.number(), { pushHistory: false });

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
		$selectMode = true;
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
					return compareToBaseData(manga, e.base, e.value.replaceAll('_', ' '));
				case 'not':
					return !compareToBaseData(
						manga,
						e.base,
						e.value.replaceAll('_', ' ')
					);
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
				return manga.title.toLowerCase().includes(compare.toLowerCase());
			case 'd':
			case 'description':
				return (
					manga.description?.toLowerCase().includes(compare.toLowerCase()) ??
					false
				);
			case 'g':
			case 'genre':
				return manga.genre.some((e) =>
					e.toLowerCase().includes(compare.toLowerCase())
				);
			case 'a':
			case 'artist':
				return (
					manga.artist?.toLowerCase().includes(compare.toLowerCase()) ?? false
				);
			case 'au':
			case 'author':
				return (
					manga.author?.toLowerCase().includes(compare.toLowerCase()) ?? false
				);
			case 's':
			case 'source':
				return (
					manga.source?.displayName
						?.toLowerCase()
						.includes(compare.toLowerCase()) ?? false
				);
			case 'st':
			case 'status':
				return manga.status.toLowerCase().includes(compare.toLowerCase());
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
		HelpSelectAll(selectMode, selected, sortedMangas);
	}
	let [err, parsedQuery] = $derived(parseQuery($query));

	$effect(() => {
		if (err !== null) {
			errortoast('Invalid Query', err);
		}
	});
	$effect(() => {
		validateParsedQuery(parsedQuery);
	});
	let orderedCategories = $derived(
		(categories.value.data?.categories?.nodes ?? [])
			.filter((e) => e.mangas.totalCount)
			.sort((a, b) => {
				return a.order > b.order ? 1 : -1;
			})
	);
	$effect(() => {
		if (
			orderedCategories.length &&
			orderedCategories.find((e) => e.id === $tab) === undefined
		) {
			window.requestAnimationFrame(() => {
				$tab = orderedCategories[0]?.id;
			});
		}
	});

	let mangas = $derived.by(() => {
		const _ = [$tab];
		return untrack(() =>
			queryState({
				client,
				query: getCategory,
				variables: { id: $tab ?? 0 },
				requestPolicy: 'cache-first'
			})
		);
	});
	$effect(() => {
		if ($selectMode === false) {
			$selected = [];
		}
	});
	let filteredMangas = $derived(
		mangas.value.data?.category?.mangas.nodes.filter((ele) => {
			if (!ele.inLibrary) return false;
			if (gmState.value.ignoreFiltersWhenSearching) {
				if (
					parsedQuery !== null &&
					specificSearch(ele, parsedQuery).findIndex((e) => e === false) === -1
				) {
					return true;
				}
			}

			if (gmState.value.Downloaded === 1 && ele.downloadCount === 0)
				return false;
			if (gmState.value.Downloaded === 2 && ele.downloadCount !== 0)
				return false;

			if (gmState.value.Unread === 1 && ele.unreadCount === 0) return false;
			if (gmState.value.Unread === 2 && ele.unreadCount !== 0) return false;

			if (gmState.value.Tracked === 1 && ele.trackRecords.nodes.length === 0)
				return false;
			if (gmState.value.Tracked === 2 && ele.trackRecords.nodes.length !== 0)
				return false;

			if (
				parsedQuery !== null &&
				specificSearch(ele, parsedQuery).findIndex((e) => e === false) !== -1
			)
				return false;

			return true;
		})
	);
	$effect(() => {
		if ($selectMode && Object.keys($selected).length > 0) {
			Object.keys($selected).forEach((ele) => {
				if (filteredMangas !== undefined) {
					const tmp = filteredMangas.findIndex(
						(elem) => elem.id.toString() === ele
					);
					if (tmp === -1) {
						delete $selected[parseInt(ele)];
						$selected = $selected;
					}
				}
			});
		}
	});
	let sortedMangas = $derived(
		filteredMangas
			? gmState.value.Sort === sort.Random
				? shuffle([...filteredMangas])
				: [...filteredMangas].sort((a, b) => {
						let tru = true;
						switch (gmState.value.Sort) {
							case sort.ID:
								tru = a.id > b.id;
								break;
							case sort.Unread:
								tru = a.unreadCount > b.unreadCount;
								break;
							case sort.Alphabetical:
								tru = a.title > b.title;
								break;
							case sort['Latest Read']:
								tru =
									parseInt(a.lastReadChapter?.lastReadAt ?? '0') >
									parseInt(b.lastReadChapter?.lastReadAt ?? '0');
								break;
							case sort['Latest Fetched']:
								tru =
									parseInt(a.latestFetchedChapter?.fetchedAt ?? '0') >
									parseInt(b.latestFetchedChapter?.fetchedAt ?? '0');
								break;
							case sort['Latest Uploaded']:
								tru =
									parseInt(a.latestUploadedChapter?.uploadDate ?? '0') >
									parseInt(b.latestUploadedChapter?.uploadDate ?? '0');
								break;
						}

						if (gmState.value.Asc) tru = !tru;
						return tru ? -1 : 1;
					})
			: undefined
	);
</script>

{#if categories.value.fetching}
	<div class="mb-3 flex h-[47px] items-center space-x-4 pl-4">
		<div class="placeholder w-20 animate-pulse"></div>
		<div class="placeholder w-20 animate-pulse"></div>
		<div class="placeholder w-20 animate-pulse"></div>
	</div>
	<div class="yoy m-2 grid gap-2 {gridValues}">
		{#each new Array(30) as _}
			<div class="aspect-cover w-full">
				<div
					class="placeholder h-full animate-pulse
			{gmState.value.Display === display.Compact && 'rounded-lg'}
			{gmState.value.Display === display.Comfortable && 'rounded-none rounded-t-lg'}"
				></div>
				{#if gmState.value.Display === display.Comfortable}
					<div
						class="placeholder h-12 animate-pulse rounded-none rounded-b-lg px-2 text-center"
					></div>
				{/if}
			</div>
		{/each}
	</div>
{:else if categories.value.error}
	<div class="whitespace-pre-wrap">
		Error loading categories: {JSON.stringify(categories.value.error, null, 4)}
	</div>
{:else}
	<TabGroup>
		{#if orderedCategories}
			{#each orderedCategories as cat}
				<Tab bind:group={$tab} name={cat.name} value={cat.id}>
					{#snippet lead()}
						{cat.name}
						{#if gmState.value.libraryCategoryTotalCounts}
							<span
								class="variant-filled-surface m-0 rounded-full px-1 text-sm"
							>
								{cat.mangas.totalCount}
							</span>
						{/if}
					{/snippet}
				</Tab>
			{/each}
		{/if}
		<svelte:fragment slot="panel">
			{#if mangas.value.fetching}
				<div class="yoy m-2 grid gap-2 {gridValues}">
					{#each new Array(orderedCategories.find((e) => e.id === $tab)?.mangas.totalCount ?? 10) as _}
						<div class="aspect-cover w-full">
							<div
								class="placeholder h-full animate-pulse
									{gmState.value.Display === display.Compact && 'rounded-lg'}
									{gmState.value.Display === display.Comfortable && 'rounded-none rounded-t-lg'}"
							></div>
							{#if gmState.value.Display === display.Comfortable}
								<div
									class="placeholder h-12 animate-pulse rounded-none rounded-b-lg px-2 text-center"
								></div>
							{/if}
						</div>
					{/each}
				</div>
			{:else if mangas.value.error}
				<div class="whitespace-pre-wrap">
					Error loading mangas: {JSON.stringify(mangas.value.error, null, 4)}
				</div>
			{:else if sortedMangas}
				<div class="yoy grid {gridValues} m-2 gap-2">
					{#each sortedMangas as manga (manga.id)}
						<IntersectionObserver
							root={document.querySelector('#page') ?? undefined}
							top={400}
							bottom={400}
						>
							{#snippet children({ intersecting })}
								<div class="aspect-cover">
									{#if intersecting}
										<a
											draggable={false}
											use:longPress
											onlongPress={() => $selectMode || LongHandler()}
											href="/manga/{manga.id}"
											onclick={(e) => {
												if (e.ctrlKey) return;
												if ($selectMode) {
													e.stopPropagation();
													e.preventDefault();
													lastSelected = HelpDoSelect(
														manga,
														e,
														lastSelected,
														sortedMangas,
														selected
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
												class="select-none {$selectMode && 'opacity-80'}"
												rounded="{gmState.value.Display === display.Compact &&
													'rounded-lg'}
												{gmState.value.Display === display.Comfortable && 'rounded-none rounded-t-lg'}"
											>
												<div class="absolute left-2 top-2 flex">
													{#if manga.downloadCount && gmState.value.downloadsBadge}
														<div
															class="{manga.unreadCount &&
															gmState.value.unreadBadge
																? 'rounded-l'
																: 'rounded'}
															variant-filled-primary m-0 px-1 py-0.5"
														>
															{manga.downloadCount}
														</div>
													{/if}
													{#if manga.unreadCount && gmState.value.unreadBadge}
														<div
															class="{manga.downloadCount &&
															gmState.value.downloadsBadge
																? 'rounded-r'
																: 'rounded'}
															variant-filled-secondary m-0 px-1 py-0.5"
														>
															{manga.unreadCount}
														</div>
													{/if}
												</div>
												{#if $selectMode}
													<div
														class="bg-base-100/75 absolute bottom-0 left-0 right-0 top-0 cursor-pointer"
													>
														<IconWrapper
															name={$selected[manga.id] === undefined
																? 'fluent:checkbox-unchecked-24-filled'
																: 'fluent:checkbox-checked-24-filled'}
															class="absolute right-2 top-2 text-4xl"
														/>
													</div>
												{/if}
												{#if gmState.value.Display === display.Compact}
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
											{#if gmState.value.Display === display.Comfortable}
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
								{#if !intersecting && gmState.value.Display === display.Comfortable}
									<div class="h-12"></div>
								{/if}
							{/snippet}
						</IntersectionObserver>
					{/each}
				</div>
			{/if}
		</svelte:fragment>
	</TabGroup>
{/if}
