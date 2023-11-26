<script lang="ts">
	import Image from '$lib/components/Image.svelte';
	import { getToastStore } from '$lib/components/Toast/stores';
	import type { GetMangaQuery } from '$lib/generated';
	import { MangaMeta, Meta } from '$lib/simpleStores';
	import {
		MangaUpdates,
		type GetMangaResponse,
		type SearchResult
	} from '$lib/tracking/mangaUpdates';
	import type { ApolloQueryResult } from '@apollo/client';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import sanitizeHtml from 'sanitize-html';
	import type { SvelteComponent } from 'svelte';
	import { writable, type Readable } from 'svelte/store';
	import TrackingModal from './../../../settings/TrackingModal.svelte';

	export let parent: SvelteComponent;
	export let manga: Readable<ApolloQueryResult<GetMangaQuery>>;
	export let mangaMeta: ReturnType<typeof MangaMeta>;

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	let searchItems = writable<{
		data?: SearchResult;
		loading: boolean;
		error?: unknown;
	}>({
		loading: true
	});

	let value = $manga.data?.manga.title ?? '';
	doSearch();

	async function doSearch() {
		$searchItems = { loading: true };
		try {
			const mangaUpdates = await MangaUpdates;
			const result = await mangaUpdates.search(value);
			if ('page' in result) {
				$searchItems.data = result;
			}
		} catch (error) {
			$searchItems.error = error;
		}
		$searchItems.loading = false;
	}

	function HighestChapterNumber() {
		return Math.floor(
			$manga.data.manga.chapters.nodes.reduce((a, c) => {
				return c.isRead && c.chapterNumber > a ? c.chapterNumber : a;
			}, 0)
		);
	}

	async function trackAs(id: number) {
		try {
			const mangaUpdates = await MangaUpdates;
			if ($mangaMeta.mangaUpdatesSeriesID === id) {
				await mangaUpdates.removeMangaFromList($mangaMeta.mangaUpdatesSeriesID);
				$mangaMeta.mangaUpdatesSeriesID = null;
				return;
			}
			if ($mangaMeta.mangaUpdatesSeriesID)
				await mangaUpdates.removeMangaFromList($mangaMeta.mangaUpdatesSeriesID);
			await mangaUpdates.addMangaToList(id, HighestChapterNumber());
			$mangaMeta.mangaUpdatesSeriesID = id;
		} catch (error) {
			if (error instanceof Error) {
				toastStore.trigger({
					message: error.message,
					background: 'bg-error-500'
				});
			}
		}
	}

	let currentTracking: undefined | GetMangaResponse = undefined;
	$: $mangaMeta.mangaUpdatesSeriesID, getCurrentManga();

	async function getCurrentManga() {
		if ($mangaMeta.mangaUpdatesSeriesID) {
			currentTracking = await (await MangaUpdates).getManga($mangaMeta.mangaUpdatesSeriesID);
		} else {
			currentTracking = undefined;
		}
	}
</script>

{#if $modalStore[0]}
	<div class="card p-0 w-modal shadow-xl rounded-lg max-h-screen">
		<h1 class="h3 py-4 pl-4">Tracking settings</h1>
		<div class="pl-4 border-y border-surface-700">
			<div class="max-h-96 overflow-y-auto grid grid-cols-1 gap-1 pr-4">
				{#if $Meta.mangaUpdatesTracking?.enabled}
					<div class="pl-4">
						<label class="pl-3 mb-2">
							<span>Search</span>
							<input type="text" on:change={doSearch} bind:value class="input" />
						</label>
						<div class="px-4 pb-4">
							{#if $searchItems.loading}
								Loading...
							{:else if $searchItems.error}
								{JSON.stringify($searchItems.error)}
							{:else if $searchItems.data}
								{#each $searchItems.data.results as value}
									<a
										href={value.record.url}
										class="flex p-1 w-full hover:variant-ghost text-left"
										on:click={(e) => {
											if (e.ctrlKey) return;
											e.preventDefault();
											trackAs(value.record.series_id);
										}}
									>
										<div class="max-w-1/3 pr-1 flex-shrink-0">
											<Image
												src={value.record.image.url.thumb}
												alt={sanitizeHtml(value.record.title)}
												width="w-auto"
												height="h-auto"
												class="rounded-lg"
											/>
										</div>
										<div class="w-auto space-y-2">
											<h2 class="h5 md:h4 lg:h3 xl:h2 line-clamp-1">
												<!-- eslint-disable-next-line svelte/no-at-html-tags -->
												<span>{@html sanitizeHtml(value.record.title)}</span>
											</h2>
											<h3 class="text-sm xl:text-base flex items-center space-x-2">
												<span class=" line-clamp-3">
													<!-- eslint-disable-next-line svelte/no-at-html-tags -->
													{@html sanitizeHtml(value.record.description)}
												</span>
											</h3>
										</div>
									</a>
								{/each}
							{/if}
						</div>
					</div>
				{:else}
					<div>
						you need to setup tracking credentials in <a
							class="anchor"
							on:click={() => {
								modalStore.trigger({
									type: 'component',
									component: { ref: TrackingModal }
								});
								parent.onClose();
							}}
							href="/settings"
						>
							settings
						</a>
					</div>
				{/if}
			</div>
		</div>
		{#if currentTracking}
			<a href={currentTracking.url} target="_blank" class="block hover:variant-ghost-surface">
				<h2 class="pl-4 pt-4">Currently tracking:</h2>
				<div class="flex pl-4 pb-1 w-full text-left">
					<div class="max-w-1/3 pr-1 flex-shrink-0">
						<Image
							src={currentTracking.image.url.thumb}
							alt={sanitizeHtml(currentTracking.title)}
							width="w-auto"
							height="h-auto"
							class="rounded-lg"
						/>
					</div>
					<div class="w-auto space-y-2">
						<h2 class="h5 md:h4 lg:h3 xl:h2 line-clamp-1">
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							<span>{@html sanitizeHtml(currentTracking.title)}</span>
						</h2>
						<h3 class="text-sm xl:text-base flex items-center space-x-2">
							<span class=" line-clamp-3">
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								{@html sanitizeHtml(currentTracking.description)}
							</span>
						</h3>
					</div>
				</div>
			</a>
		{:else}
			<h2 class="p-4">Currently not tracking</h2>
		{/if}
	</div>
{/if}
