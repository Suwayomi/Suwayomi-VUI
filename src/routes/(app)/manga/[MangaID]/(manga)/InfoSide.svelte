<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	import Image from '$lib/components/Image.svelte';
	import MediaQuery from '$lib/components/MediaQuery.svelte';
	import { screens } from '$lib/screens';
	import InfoSubTitles from './InfoSubTitles.svelte';
	import TrackingModal from './TrackingModal.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { getContextClient } from '@urql/svelte';
	import {
		deleteDownloadedChapters,
		dequeueChapterDownloads,
		enqueueChapterDownloads,
		updateMangas
	} from '$lib/gql/Mutations';
	import { gmState, mmState } from '$lib/simpleStores.svelte';

	import NotesModal from './NotesModal.svelte';
	import { getToastStore } from '$lib/components/Toast/stores';
	import { longPress } from '$lib/press';
	import { manga } from './mangaStores.svelte';

	const toastStore = getToastStore();
	const modalStore = getModalStore();
	const client = getContextClient();

	interface Props {
		MangaID: number;
	}

	let { MangaID }: Props = $props();

	function libToggle() {
		if (
			gmState.value.DownloadAllChaptersOnAddToLibrary &&
			!manga.value?.data?.manga?.inLibrary
		) {
			client
				.mutation(enqueueChapterDownloads, {
					ids: manga.value?.data?.manga?.chapters.nodes?.map((e) => e.id) ?? []
				})
				.toPromise();
		}
		if (
			manga.value?.data?.manga?.inLibrary &&
			gmState.value.DeleteAllChaptersOnRemoveFromLibrary
		) {
			client
				.mutation(deleteDownloadedChapters, {
					ids: manga.value?.data?.manga?.chapters.nodes?.map((e) => e.id) ?? []
				})
				.toPromise();
		}

		if (
			manga.value?.data?.manga?.inLibrary &&
			gmState.value.RemoveChaptersFromDownloadQueueOnRemoveFromLibrary
		) {
			client
				.mutation(dequeueChapterDownloads, {
					ids: manga.value?.data?.manga?.chapters.nodes?.map((e) => e.id) ?? []
				})
				.toPromise();
		}

		client
			.mutation(updateMangas, {
				ids: [MangaID],
				inLibrary: !manga.value?.data?.manga?.inLibrary
			})
			.toPromise();
	}
	let ImageFailed = $state(false);

	function LongHandler() {
		if (manga.value?.data?.manga?.title) {
			navigator.clipboard.writeText(manga.value?.data?.manga?.title);
			toastStore.trigger({
				message: 'Title copied to clipboard',
				background: 'bg-primary-600'
			});
		} else {
			toastStore.trigger({
				message: 'Failed to copy title to clipboard',
				background: 'bg-error-600'
			});
		}
	}
	$effect(() => {
		if (manga.value?.data?.manga.id) ImageFailed = false;
	});
</script>

{#if manga.value?.fetching}
	<div
		class="max-h-full w-full space-y-8 p-4
			md:absolute md:bottom-0 md:left-0 md:top-0 md:w-1/2 md:overflow-y-auto"
	>
		<div class="flex flex-col space-x-4 sm:flex-row">
			<div class="md:flex-0 aspect-cover md:w-[33%]">
				<div class="placeholder h-full animate-pulse rounded-lg"></div>
			</div>
			<div class="space-y-2 md:mt-8 md:w-[66%] md:flex-1 lg:space-y-8">
				<!-- svelte-ignore a11y_missing_content -->
				<h1 class="h1 line-clamp-2 md:h3 lg:h2 xl:h1 xl:leading-[4rem]">
					<span class="placeholder inline-block h-10 w-full animate-pulse">
					</span>
				</h1>
				<div class="w-3/4 space-y-1 lg:space-y-2">
					<!-- svelte-ignore a11y_missing_content -->
					<h3 class="h3 flex items-center space-x-2">
						<span
							class="placeholder inline-block w-full max-w-[33%] animate-pulse"
						></span>
						<span
							class="placeholder inline-block w-full max-w-[66%] animate-pulse"
						></span>
					</h3>
					<!-- svelte-ignore a11y_missing_content -->
					<h3 class="h3 flex items-center space-x-2">
						<span
							class="placeholder inline-block w-full max-w-[33%] animate-pulse"
						></span>
						<span
							class="placeholder inline-block w-full max-w-[66%] animate-pulse"
						></span>
					</h3>
					<!-- svelte-ignore a11y_missing_content -->
					<h3 class="h3 flex items-center space-x-2">
						<span
							class="placeholder inline-block w-full max-w-[33%] animate-pulse"
						></span>
						<span
							class="placeholder inline-block w-full max-w-[66%] animate-pulse"
						></span>
					</h3>
					<!-- svelte-ignore a11y_missing_content -->
					<h3 class="h3 flex items-center space-x-2">
						<span
							class="placeholder inline-block w-full max-w-[33%] animate-pulse"
						></span>
						<span
							class="placeholder inline-block w-full max-w-[66%] animate-pulse"
						></span>
					</h3>
				</div>
			</div>
		</div>
		<div class="flex justify-around">
			<div class="placeholder w-full max-w-[8rem] animate-pulse"></div>
			<div class="placeholder w-full max-w-[8rem] animate-pulse"></div>
		</div>
		<section class="w-full">
			<div class="space-y-4">
				{#each new Array(6) as _, i (i)}
					<div
						class="grid
									{i + 1 === 1 && 'grid-cols-1'}
									{i + 1 === 2 && 'grid-cols-2'} gap-4
									{i + 1 === 3 && 'grid-cols-3'} gap-6
									{i + 1 === 4 && 'grid-cols-4'} gap-8
									{i + 1 === 5 && 'grid-cols-5'} gap-6
									{i + 1 === 6 && 'grid-cols-6'} gap-4"
					>
						{#each new Array(i + 1) as _, j (j)}
							<div class="placeholder animate-pulse"></div>
						{/each}
					</div>
				{/each}
			</div>
		</section>
		<div class="space-x-2">
			{#each new Array(8) as _, i (i)}
				<div
					class="placeholder variant-filled-primary inline-block w-16 animate-pulse"
				></div>
			{/each}
		</div>
	</div>
{:else if manga.value?.error}
	<div
		class="max-h-full w-full space-y-8 whitespace-pre-wrap p-4 md:absolute md:bottom-0 md:left-0 md:top-0 md:w-1/2 md:overflow-y-auto"
	>
		Errors loading manga Info: {JSON.stringify(manga.value?.error, null, 4)}
	</div>
{:else if manga.value?.data?.manga}
	{@const mangaFrag = manga.value?.data.manga}
	<div
		class="max-h-full w-full space-y-8 p-4 md:absolute md:bottom-0 md:left-0 md:top-0 md:w-1/2 md:overflow-y-auto"
	>
		<div class="flex flex-col space-x-4 sm:flex-row">
			<div class="md:flex-0 md:max-w-[33%]">
				<Image
					onfailed={() => (ImageFailed = true)}
					src={mangaFrag.thumbnailUrl ?? ''}
					alt={mangaFrag.title}
					width="w-auto"
					height="h-auto"
					class="rounded-lg {ImageFailed && 'hidden'}"
				/>
			</div>
			<div class="space-y-2 md:mt-8 md:min-w-[66%] md:flex-1 lg:space-y-8">
				<h1
					class="h1 line-clamp-2 select-none md:h3 lg:h2 xl:h1 hover:cursor-pointer xl:leading-[4rem]"
					use:longPress
					onlongPress={LongHandler}
					title="long press to copy title"
				>
					{mangaFrag.title}
				</h1>
				<div class="space-y-1 lg:space-y-2">
					<InfoSubTitles text={mangaFrag.author} name="Author" />
					<InfoSubTitles text={mangaFrag.artist} name="Artist" />
					<InfoSubTitles text={mangaFrag.status} name="Status" />
					<InfoSubTitles text={mangaFrag.source?.displayName} name="Source" />
				</div>
			</div>
		</div>
		<MediaQuery query="(min-width: {screens.sm})">
			{#snippet children({ matches })}
				<div class="grid grid-cols-2 gap-1">
					<button
						onclick={libToggle}
						class="variant-soft btn flex h-12 items-center px-2 sm:px-5"
					>
						<IconWrapper
							name="mdi:heart"
							class="aspect-square h-full w-auto {mangaFrag.inLibrary &&
								'text-red-500'}"
						/>
						{#if matches}
							<span class="text-sm uppercase sm:text-base">
								{mangaFrag.inLibrary ? 'In Library' : 'Add to library'}
							</span>
						{/if}
					</button>
					<a
						href={mangaFrag.realUrl}
						target="_blank"
						class="variant-soft btn flex h-12 items-center px-2 sm:px-5"
					>
						<IconWrapper name="mdi:earth" class="aspect-square h-full w-auto" />
						{#if matches}
							<span class="text-sm uppercase sm:text-base">Open site</span>
						{/if}
					</a>
					{#if mangaFrag.inLibrary}
						<a
							href="/browse/migrate/manga/{mangaFrag.id}?q={encodeURIComponent(
								mangaFrag.title
							)}"
							class="variant-soft btn flex h-12 items-center px-2 sm:px-5"
						>
							<IconWrapper
								name="mdi:bird"
								class="aspect-square h-full w-auto"
							/>
							{#if matches}
								<span class="text-sm uppercase sm:text-base">Migrate</span>
							{/if}
						</a>
						<button
							onclick={() => {
								modalStore.trigger({
									type: 'component',
									backdropClasses: '!p-0',
									component: {
										ref: TrackingModal
									}
								});
							}}
							class="variant-soft btn flex h-12 items-center px-2 sm:px-5"
						>
							<IconWrapper
								name="mdi:target"
								class="aspect-square h-full w-auto {mangaFrag.trackRecords.nodes
									.length > 0 && 'text-red-500'}"
							/>
							{#if matches}
								<span class="text-sm uppercase sm:text-base"> Tracking</span>
							{/if}
						</button>
					{/if}
				</div>
			{/snippet}
		</MediaQuery>
		<section class="w-full text-xs xs:text-sm md:text-base">
			<p class="whitespace-pre-line">{mangaFrag.description}</p>
		</section>
		<div class="flex w-full flex-wrap gap-2">
			{#each mangaFrag?.genre as genre (genre)}
				{#if genre}
					<div class="variant-outline-primary badge">{genre}</div>
				{/if}
			{:else}
				<div></div>
			{/each}
		</div>
		<div>
			<button
				class="w-full cursor-pointer p-2 text-left hover:variant-glass-surface"
				onclick={() => {
					modalStore.trigger({
						type: 'component',
						backdropClasses: '!p-0',
						component: { ref: NotesModal }
					});
				}}
			>
				Notes:
			</button>
			<div class="whitespace-pre-line pl-4 text-left">
				{#if mmState.value.notes}
					{mmState.value.notes}
				{/if}
			</div>
		</div>
	</div>
{/if}
