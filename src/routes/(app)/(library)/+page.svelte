<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { category, type CategoryQuery, categories as getCategories } from '$lib/generated';
	import IntersectionObserver from '$lib/components/IntersectionObserver.svelte';
	import MangaCard from '$lib/components/MangaCard.svelte';
	import { longPress } from '$lib/press';
	import { display, Meta, sort } from '$lib/simpleStores';
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import LibraryActions from './libraryActions.svelte';
	import { selected, selectMode } from './LibraryStores';
	import { onMount } from 'svelte';
	import { AppBarData } from '$lib/MountTitleAction';
	import { goto } from '$app/navigation';
	import { gridValues, HelpDoSelect, HelpSelectAll } from '$lib/util';
	import IconWrapper from '$lib/components/IconWrapper.svelte';

	const categories = getCategories({});

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

	type MangaType = NonNullable<CategoryQuery['category']>['mangas']['nodes'][0];

	let lastSelected: MangaType | undefined;

	const query = queryParam('q', ssp.string(), { pushHistory: false });
	const tab = queryParam('tab', ssp.number(), { pushHistory: false });
	$: mangas = category({
		variables: { id: $tab ?? 0 },
		fetchPolicy: 'cache-first',
		nextFetchPolicy: 'cache-only'
	});

	if ($tab === null) {
		categories.subscribe((e) => {
			$tab = e.data?.categories?.nodes.find((ele) => ele.default)?.id ?? 0;
		});
	}

	$: orderedCategories = [...($categories.data?.categories?.nodes ?? [])].toSorted((a, b) => {
		return a.order > b.order ? 1 : -1;
	});

	function LongHandler() {
		$selectMode = true;
	}

	$: if ($selectMode === false) {
		$selected = [];
	}

	$: if ($selectMode && Object.keys($selected).length > 0) {
		Object.keys($selected).forEach((ele) => {
			if (filteredMangas !== undefined) {
				const tmp = filteredMangas.findIndex((elem) => elem.id.toString() === ele);
				if (tmp === -1) {
					delete $selected[parseInt(ele)];
					$selected = $selected;
				}
			}
		});
	}

	$: filteredMangas = $mangas.data.category?.mangas.nodes.filter((ele) => {
		if (!ele.inLibrary) return false;
		if ($Meta.ignoreFiltersWhenSearching) {
			if (
				$query !== '' &&
				$query !== null &&
				ele.title.toLowerCase().includes($query.toLowerCase())
			)
				return true;
		}

		if ($Meta.Downloaded === 1 && ele.downloadCount === 0) return false;
		if ($Meta.Downloaded === 2 && ele.downloadCount !== 0) return false;

		if ($Meta.Unread === 1 && ele.unreadCount === 0) return false;
		if ($Meta.Unread === 2 && ele.unreadCount !== 0) return false;

		if ($query !== '' && $query !== null && !ele.title.toLowerCase().includes($query.toLowerCase()))
			return false;

		return true;
	});

	$: sortedMangas = filteredMangas?.toSorted((a, b) => {
		let tru = true;
		switch ($Meta.Sort) {
			case sort.ID:
				tru = a.id > b.id;
				break;
			case sort.Unread:
				tru = a.unreadCount > b.unreadCount;
				break;
			case sort.Alphabetical:
				tru = a.title > b.title;
				break;
			case sort['Last Read']:
				tru = a.lastReadChapter?.lastReadAt > b.lastReadChapter?.lastReadAt;
				break;
		}

		if ($Meta.Asc) tru = !tru;
		return tru ? -1 : 1;
	});

	function selectAll() {
		HelpSelectAll(selectMode, selected, sortedMangas);
	}
</script>

{#if $categories.loading}
	<div class="flex pl-4 space-x-4 h-[47px] mb-3 items-center">
		<div class="placeholder animate-pulse w-20" />
		<div class="placeholder animate-pulse w-20" />
		<div class="placeholder animate-pulse w-20" />
	</div>
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
{:else if $categories.error}
	Error loading categories: {JSON.stringify($categories.error)}
{:else}
	<TabGroup>
		{#if orderedCategories}
			{#each orderedCategories as cat}
				<Tab bind:group={$tab} name={cat.name} value={cat.id}>
					<svelte:fragment slot="lead">{cat.name}</svelte:fragment>
				</Tab>
			{/each}
		{/if}
		<svelte:fragment slot="panel">
			{#if $mangas.loading}
				<div class="yoy grid m-2 gap-2 {gridValues}">
					{#each new Array(orderedCategories.find((e) => e.id === $tab ?? 0)?.mangas.totalCount ?? 10) as _}
						<div class="aspect-cover w-full">
							<div
								class="placeholder animate-pulse h-full
								{$Meta.Display === display.Compact && 'rounded-lg'}
								{$Meta.Display === display.Comfortable && 'rounded-none rounded-t-lg'}"
							/>
							{#if $Meta.Display === display.Comfortable}
								<div
									class="placeholder animate-pulse px-2 h-12 text-center rounded-none rounded-b-lg"
								/>
							{/if}
						</div>
					{/each}
				</div>
			{:else if $mangas.error}
				Error loading Mangas of category: {JSON.stringify($mangas.error)}
			{:else}
				<div class="yoy grid {gridValues} gap-2 m-2">
					{#each sortedMangas as manga (manga.id)}
						<IntersectionObserver
							let:intersecting
							root={document.querySelector('#page') ?? undefined}
							top={400}
							bottom={400}
						>
							<div class="aspect-cover">
								{#if intersecting}
									<a
										draggable={false}
										use:longPress
										on:longPress={() => $selectMode || LongHandler()}
										href="manga/{manga.id}"
										on:click|stopPropagation={(e) => {
											if (e.ctrlKey) return;
											if ($selectMode) {
												e.preventDefault();
												lastSelected = HelpDoSelect(manga, e, lastSelected, sortedMangas, selected);
											} else {
												e.preventDefault();
												goto(`manga/${manga.id}`);
											}
										}}
										class="hover:opacity-70 cursor-pointer h-full"
										tabindex="-1"
									>
										<MangaCard
											draggable={false}
											thumbnailUrl={manga.thumbnailUrl ?? ''}
											title={manga.title}
											class="select-none {$selectMode && 'opacity-80'}"
											rounded="{$Meta.Display === display.Compact && 'rounded-lg'}
										{$Meta.Display === display.Comfortable && 'rounded-none rounded-t-lg'}"
										>
											<div class="absolute top-2 left-2 flex">
												{#if manga.downloadCount && $Meta.downloadsBadge}
													<div
														class="{manga.unreadCount && $Meta.unreadBadge
															? 'rounded-l'
															: 'rounded'}
													variant-filled-primary m-0 py-0.5 px-1"
													>
														{manga.downloadCount}
													</div>
												{/if}
												{#if manga.unreadCount && $Meta.unreadBadge}
													<div
														class="{manga.downloadCount && $Meta.downloadsBadge
															? 'rounded-r'
															: 'rounded'}
													variant-filled-secondary m-0 py-0.5 px-1"
													>
														{manga.unreadCount}
													</div>
												{/if}
											</div>
											{#if $selectMode}
												<div
													class="cursor-pointer absolute top-0 right-0 left-0 bottom-0 bg-base-100/75"
												>
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
			{/if}
		</svelte:fragment>
	</TabGroup>
{/if}
