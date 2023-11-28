<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import UpdatesActions from './UpdatesActions.svelte';
	import { AppBarData } from '$lib/MountTitleAction';
	import { updates, type UpdatesQuery } from '$lib/generated';
	import { writable, type Writable } from 'svelte/store';
	import MangaCard from '$lib/components/MangaCard.svelte';
	import { longpress } from '$lib/press';
	import { selectmode, selected } from './UpdatesStores';
	import IntersectionObserver from '$lib/components/IntersectionObserver.svelte';
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	import { goto } from '$app/navigation';
	import type { UpdateNode } from './UpdatesStores';
	import { dlreabook, gridValues, HelpDoSelect, HelpSelectall } from '$lib/util';
	import { display, Meta } from '$lib/simpleStores';

	AppBarData('Updates', {
		component: UpdatesActions,
		props: {
			selectall,
			updateSelectedValues
		}
	});

	let page = writable(0);
	let all: Writable<UpdatesQuery['chapters'] | null> = writable(null);
	$: update = updates({ variables: { offset: $page } });
	$: $update, updateall();
	function updateall() {
		if (!$update.data.chapters) return;
		if (!$all) {
			$all = $update.data.chapters;
			return;
		}
		$all.nodes.push(...$update.data.chapters.nodes);
		$all.pageInfo = $update.data.chapters.pageInfo;
	}

	function LongHandler(): void {
		$selectmode = true;
	}
	let lastselected: UpdateNode | undefined;

	function selectall() {
		HelpSelectall(selectmode, selected, $all?.nodes);
	}

	function updateSelectedValues(prop: dlreabook, is: boolean | undefined) {
		if (!$selected || is === undefined) return;
		switch (prop) {
			case dlreabook.bookmark:
				$selected.forEach((element) => {
					const fin = $all?.nodes.findIndex((ele) => ele.id === element.id);
					if (fin && $all?.nodes[fin]) $all.nodes[fin].isBookmarked = is;
				});
				break;
			case dlreabook.download:
				$selected.forEach((element) => {
					const fin = $all?.nodes.findIndex((ele) => ele.id === element.id);
					if (fin && $all?.nodes[fin]) $all.nodes[fin].isDownloaded = is;
				});
				break;
			default:
				$selected.forEach((element) => {
					const fin = $all?.nodes.findIndex((ele) => ele.id === element.id);
					if (fin && $all?.nodes[fin]) $all.nodes[fin].isRead = is;
				});
				break;
		}
	}
</script>

{#if !$all && $update.loading}
	<div class="grid {gridValues} gap-2 m-2">
		{#each new Array(110) as _}
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
{:else if !$all && $update.error}
	{JSON.stringify($update.error)}
{:else if $all?.nodes}
	<div class="grid {gridValues} gap-2 m-2">
		{#each $all.nodes as updat}
			<IntersectionObserver
				let:intersecting
				root={document.querySelector('#page') ?? undefined}
				top={400}
				bottom={400}
				class="aspect-cover w-full"
			>
				{#if intersecting}
					<a
						use:longpress
						on:longpress={() => $selectmode || LongHandler()}
						href="manga/{updat.manga.id}"
						on:click|stopPropagation={(e) => {
							if (e.ctrlKey) return;
							if ($selectmode) {
								e.preventDefault();
								lastselected = HelpDoSelect(updat, e, lastselected, $all?.nodes, selected);
							} else {
								e.preventDefault();
								goto(`/manga/${updat.manga.id}`);
							}
						}}
						class="hover:opacity-70 cursor-pointer h-full"
						tabindex="-1"
					>
						<MangaCard
							thumbnailUrl={updat.manga.thumbnailUrl ?? ''}
							title={updat.manga.title}
							class={$selectmode && 'opacity-80'}
							titla="{updat.isDownloaded ? 'Downloaded' : ''}
{updat.isRead ? 'Read' : ''}
{updat.isBookmarked ? 'Bookmarked' : ''}"
							rounded="{$Meta.Display === display.Compact && 'rounded-lg'}
							{$Meta.Display === display.Comfortable && 'rounded-none rounded-t-lg'}"
						>
							{#if $selectmode}
								<div class="cursor-pointer absolute top-0 right-0 left-0 bottom-0 bg-base-100/75">
									<IconWrapper
										name={$selected[updat.id] === undefined
											? 'fluent:checkbox-unchecked-24-filled'
											: 'fluent:checkbox-checked-24-filled'}
										class="text-4xl absolute top-2 right-2"
									/>
								</div>
							{/if}
							{#if $Meta.Display === display.Compact}
								<div class="absolute bottom-0 left-0 right-0 variant-glass rounded-b-olg">
									<div class="line-clamp-1 px-2 h-6 text-center" title={updat.manga.title}>
										{updat.manga.title}
									</div>
									<div class="line-clamp-1 px-2 h-6 text-center" title={updat.name}>
										{updat.name}
									</div>
									<div
										class="line-clamp-1 px-2 h-6 text-center"
										title={new Date(updat.fetchedAt * 1000).toLocaleString()}
									>
										{new Date(updat.fetchedAt * 1000).toLocaleString()}
									</div>
								</div>
							{/if}
							<div class="absolute top-2 left-2 flex h-8">
								{#if updat.isDownloaded}
									<IconWrapper class="w-full h-full" name="mdi:download" />
								{/if}
								{#if updat.isRead}
									<IconWrapper class="w-full h-full" name="mdi:book-open-page-variant-outline" />
								{/if}
								{#if updat.isBookmarked}
									<IconWrapper class="w-full h-full" name="mdi:bookmark" />
								{/if}
							</div>
						</MangaCard>
						{#if $Meta.Display === display.Comfortable}
							<div class="variant-glass-surface rounded-b-lg">
								<div class="line-clamp-1 px-2 h-6 text-center" title={updat.manga.title}>
									{updat.manga.title}
								</div>
								<div class="line-clamp-1 px-2 h-6 text-center" title={updat.name}>
									{updat.name}
								</div>
								<div
									class="line-clamp-1 px-2 h-6 text-center"
									title={new Date(updat.fetchedAt * 1000).toLocaleString()}
								>
									{new Date(updat.fetchedAt * 1000).toLocaleString()}
								</div>
							</div>
						{/if}
					</a>
				{/if}
			</IntersectionObserver>
		{/each}
		{#if !$update.loading && $all.pageInfo.hasNextPage}
			<IntersectionObserver
				root={document.querySelector('#page') ?? undefined}
				top={400}
				bottom={400}
				on:intersect={(e) => {
					if (e.detail) $page = $all?.nodes.length ?? 0;
				}}
			/>
		{/if}
		{#if $update.loading && $all.pageInfo.hasNextPage}
			{#each new Array(10) as _}
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
		{/if}
	</div>
{/if}
