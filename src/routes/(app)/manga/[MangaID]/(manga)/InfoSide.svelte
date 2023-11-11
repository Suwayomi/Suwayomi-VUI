<script lang="ts">
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	import Image from '$lib/components/Image.svelte';
	import MediaQuery from '$lib/components/MediaQuery.svelte';
	import { updateMangas, type GetMangaQuery } from '$lib/generated';
	import { screens } from '$lib/screens';
	import type { ApolloQueryResult } from '@apollo/client';
	import type { Readable } from 'svelte/store';
	import InfoSubTitles from './InfoSubTitles.svelte';

	export let manga: Readable<ApolloQueryResult<GetMangaQuery>>;
	export let MangaID: number;

	async function libtoggle() {
		await updateMangas({
			variables: {
				ids: [MangaID],
				inLibrary: !$manga.data.manga?.inLibrary ?? false
			}
		});
	}
	let ImageFailed = false;
</script>

{#if $manga.loading}
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
						<span class="placeholder animate-pulse inline-block max-w-[33%] w-full" />
						<span class="placeholder animate-pulse inline-block max-w-[66%] w-full" />
					</h3>
					<h3 class="h3 flex items-center space-x-2">
						<span class="placeholder animate-pulse inline-block max-w-[33%] w-full" />
						<span class="placeholder animate-pulse inline-block max-w-[66%] w-full" />
					</h3>
					<h3 class="h3 flex items-center space-x-2">
						<span class="placeholder animate-pulse inline-block max-w-[33%] w-full" />
						<span class="placeholder animate-pulse inline-block max-w-[66%] w-full" />
					</h3>
					<h3 class="h3 flex items-center space-x-2">
						<span class="placeholder animate-pulse inline-block max-w-[33%] w-full" />
						<span class="placeholder animate-pulse inline-block max-w-[66%] w-full" />
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
				<div class="placeholder animate-pulse inline-block variant-filled-primary w-16" />
			{/each}
		</div>
	</div>
{:else if $manga.error}
	Error loading manga Info: {JSON.stringify($manga.error)}
{:else if $manga.data.manga}
	<div
		class="w-full md:w-1/2 space-y-8 p-4 md:overflow-y-auto max-h-full md:absolute md:left-0 md:bottom-0 md:top-0"
	>
		<div class="flex flex-col sm:flex-row space-x-4">
			<div class="md:max-w-[33%] md:flex-0">
				<Image
					on:failed={() => (ImageFailed = true)}
					src={$manga.data.manga.thumbnailUrl ?? ''}
					alt={$manga.data.manga.title}
					width="w-auto"
					height="h-auto"
					class="rounded-lg {ImageFailed && 'hidden'}"
				/>
			</div>
			<div class="md:min-w-[66%] space-y-2 lg:space-y-8 md:mt-8 md:flex-1">
				<h1 class="h1 md:h3 lg:h2 xl:h1 line-clamp-2 xl:leading-[4rem]">
					{$manga.data.manga.title}
				</h1>
				<div class="w-3/4 space-y-1 lg:space-y-2">
					<InfoSubTitles text={$manga.data.manga.author} name="Author" />
					<InfoSubTitles text={$manga.data.manga.artist} name="Artist" />
					<InfoSubTitles text={$manga.data.manga.status} name="Status" />
					<InfoSubTitles text={$manga.data.manga.source?.displayName} name="Source" />
				</div>
			</div>
		</div>
		<MediaQuery query="(min-width: {screens.sm})" let:matches>
			<div class="flex justify-around select-none">
				<button on:click={libtoggle} class="btn variant-soft h-12 flex items-center px-2 sm:px-5">
					<IconWrapper
						name="mdi:heart"
						class="w-auto h-full aspect-square {$manga.data.manga.inLibrary && 'text-red-500'}"
					/>
					{#if matches}
						<span class="uppercase text-sm sm:text-base">
							{$manga.data.manga.inLibrary ? 'In Library' : 'Add to library'}
						</span>
					{/if}
				</button>
				{#if $manga.data.manga.inLibrary}
					<a
						href="../browse/migrate/manga/{$manga.data.manga.id}"
						class="btn variant-soft h-12 flex items-center px-2 sm:px-5"
					>
						<IconWrapper name="mdi:bird" class="w-auto h-full aspect-square" />
						{#if matches}
							<span class="uppercase text-sm sm:text-base">Migrate</span>
						{/if}
					</a>
				{/if}
				<a
					href={$manga.data.manga.realUrl}
					target="_blank"
					class="btn variant-soft h-12 flex items-center px-2 sm:px-5"
				>
					<IconWrapper name="mdi:earth" class="w-auto h-full aspect-square" />
					{#if matches}
						<span class="uppercase text-sm sm:text-base">Open site</span>
					{/if}
				</a>
			</div>
		</MediaQuery>
		<section class="w-full">
			<p>{$manga.data.manga.description}</p>
		</section>
		<div class="space-x-2">
			{#each $manga.data.manga?.genre as genre}
				{#if genre}
					<div class="badge variant-outline-primary">{genre}</div>
				{/if}
			{:else}
				<div />
			{/each}
		</div>
	</div>
{/if}
