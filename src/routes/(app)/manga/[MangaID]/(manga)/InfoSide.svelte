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
	import type { getManga } from '$lib/gql/Queries';
	import {
		getContextClient,
		type OperationResultStore,
		type Pausable
	} from '@urql/svelte';
	import { type ResultOf } from 'gql.tada';
	import { updateMangas } from '$lib/gql/Mutations';
	const modalStore = getModalStore();
	const client = getContextClient();

	export let manga: OperationResultStore<ResultOf<typeof getManga>> & Pausable;
	export let MangaID: number;

	async function libtoggle() {
		await client
			.mutation(updateMangas, {
				ids: [MangaID],
				inLibrary: !$manga.data?.manga?.inLibrary
			})
			.toPromise();
	}
	let ImageFailed = false;
</script>

{#if $manga.fetching}
	<div
		class="w-full md:w-1/2 space-y-8 p-4
			md:overflow-y-auto max-h-full md:absolute md:left-0 md:bottom-0 md:top-0"
	>
		<div class="flex flex-col sm:flex-row space-x-4">
			<div class="md:w-[33%] md:flex-0 aspect-cover">
				<div class="placeholder animate-pulse h-full rounded-lg" />
			</div>
			<div class="md:w-[66%] space-y-2 lg:space-y-8 md:mt-8 md:flex-1">
				<h1 class="h1 md:h3 lg:h2 xl:h1 line-clamp-2 xl:leading-[4rem]">
					<span class="placeholder animate-pulse inline-block w-full h-10" />
				</h1>
				<div class="w-3/4 space-y-1 lg:space-y-2">
					<h3 class="h3 flex items-center space-x-2">
						<span
							class="placeholder animate-pulse inline-block max-w-[33%] w-full"
						/>
						<span
							class="placeholder animate-pulse inline-block max-w-[66%] w-full"
						/>
					</h3>
					<h3 class="h3 flex items-center space-x-2">
						<span
							class="placeholder animate-pulse inline-block max-w-[33%] w-full"
						/>
						<span
							class="placeholder animate-pulse inline-block max-w-[66%] w-full"
						/>
					</h3>
					<h3 class="h3 flex items-center space-x-2">
						<span
							class="placeholder animate-pulse inline-block max-w-[33%] w-full"
						/>
						<span
							class="placeholder animate-pulse inline-block max-w-[66%] w-full"
						/>
					</h3>
					<h3 class="h3 flex items-center space-x-2">
						<span
							class="placeholder animate-pulse inline-block max-w-[33%] w-full"
						/>
						<span
							class="placeholder animate-pulse inline-block max-w-[66%] w-full"
						/>
					</h3>
				</div>
			</div>
		</div>
		<div class="flex justify-around">
			<div class="placeholder animate-pulse w-full max-w-[8rem]" />
			<div class="placeholder animate-pulse w-full max-w-[8rem]" />
		</div>
		<section class="w-full">
			<div class="space-y-4">
				{#each new Array(6) as _, i}
					<div
						class="grid
									{i + 1 === 1 && 'grid-cols-1'}
									{i + 1 === 2 && 'grid-cols-2'} gap-4
									{i + 1 === 3 && 'grid-cols-3'} gap-6
									{i + 1 === 4 && 'grid-cols-4'} gap-8
									{i + 1 === 5 && 'grid-cols-5'} gap-6
									{i + 1 === 6 && 'grid-cols-6'} gap-4"
					>
						{#each new Array(i + 1) as _}
							<div class="placeholder animate-pulse" />
						{/each}
					</div>
				{/each}
			</div>
		</section>
		<div class="space-x-2">
			{#each new Array(8) as _}
				<div
					class="placeholder animate-pulse inline-block variant-filled-primary w-16"
				/>
			{/each}
		</div>
	</div>
{:else if $manga.error}
	<div
		class="w-full md:w-1/2 space-y-8 p-4 md:overflow-y-auto max-h-full md:absolute md:left-0 md:bottom-0 md:top-0 whitespace-pre-wrap"
	>
		Errors loading manga Info: {JSON.stringify($manga.error, null, 4)}
	</div>
{:else if $manga.data?.manga}
	{@const mangaFrag = $manga.data.manga}
	<div
		class="w-full md:w-1/2 space-y-8 p-4 md:overflow-y-auto max-h-full md:absolute md:left-0 md:bottom-0 md:top-0"
	>
		<div class="flex flex-col sm:flex-row space-x-4">
			<div class="md:max-w-[33%] md:flex-0">
				<Image
					on:failed={() => (ImageFailed = true)}
					src={mangaFrag.thumbnailUrl ?? ''}
					alt={mangaFrag.title}
					width="w-auto"
					height="h-auto"
					class="rounded-lg {ImageFailed && 'hidden'}"
				/>
			</div>
			<div class="md:min-w-[66%] space-y-2 lg:space-y-8 md:mt-8 md:flex-1">
				<h1 class="h1 md:h3 lg:h2 xl:h1 line-clamp-2 xl:leading-[4rem]">
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
		<MediaQuery query="(min-width: {screens.sm})" let:matches>
			<div class="grid gap-1 grid-cols-2">
				<button
					on:click={libtoggle}
					class="btn variant-soft h-12 flex items-center px-2 sm:px-5"
				>
					<IconWrapper
						name="mdi:heart"
						class="w-auto h-full aspect-square {mangaFrag.inLibrary &&
							'text-red-500'}"
					/>
					{#if matches}
						<span class="uppercase text-sm sm:text-base">
							{mangaFrag.inLibrary ? 'In Library' : 'Add to library'}
						</span>
					{/if}
				</button>
				<a
					href={mangaFrag.realUrl}
					target="_blank"
					class="btn variant-soft h-12 flex items-center px-2 sm:px-5"
				>
					<IconWrapper name="mdi:earth" class="w-auto h-full aspect-square" />
					{#if matches}
						<span class="uppercase text-sm sm:text-base">Open site</span>
					{/if}
				</a>
				{#if mangaFrag.inLibrary}
					<a
						href="/browse/migrate/manga/{mangaFrag.id}"
						class="btn variant-soft h-12 flex items-center px-2 sm:px-5"
					>
						<IconWrapper name="mdi:bird" class="w-auto h-full aspect-square" />
						{#if matches}
							<span class="uppercase text-sm sm:text-base">Migrate</span>
						{/if}
					</a>
					<button
						on:click={() => {
							modalStore.trigger({
								type: 'component',
								component: { ref: TrackingModal, props: { manga } }
							});
						}}
						class="btn variant-soft h-12 flex items-center px-2 sm:px-5"
					>
						<IconWrapper
							name="mdi:target"
							class="w-auto h-full aspect-square {mangaFrag.trackRecords.nodes
								.length > 0 && 'text-red-500'}"
						/>
						{#if matches}
							<span class="uppercase text-sm sm:text-base"> Tracking</span>
						{/if}
					</button>
				{/if}
			</div>
		</MediaQuery>
		<section class="w-full text-xs xs:text-sm md:text-base">
			<p>{mangaFrag.description}</p>
		</section>
		<div class="space-x-2">
			{#each mangaFrag?.genre as genre}
				{#if genre}
					<div class="badge variant-outline-primary">{genre}</div>
				{/if}
			{:else}
				<div />
			{/each}
		</div>
	</div>
{/if}
