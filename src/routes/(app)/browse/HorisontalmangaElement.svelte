<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import MangaCard from '$lib/components/MangaCard.svelte';
	import IntersectionObserver from '$lib/components/IntersectionObserver.svelte';
	import { Meta, display } from '$lib/simpleStores';
	import type { fetchSourceManga } from '$lib/gql/Mutations';
	import type { ResultOf } from 'gql.tada';

	export let mangas: ResultOf<
		typeof fetchSourceManga
	>['fetchSourceManga']['mangas'];
	export let gridnumber: number;
	export let OpenModal: ((id: number) => void) | undefined = undefined;

	let scrollingElement: HTMLDivElement;
</script>

<div class="overflow-x-auto" bind:this={scrollingElement}>
	<div
		class="flex flex-nowrap"
		style="width:calc({mangas.length / gridnumber} * 100%)"
	>
		{#each mangas as manga}
			<IntersectionObserver
				let:intersecting
				root={scrollingElement ?? undefined}
				left={400}
				right={400}
				class="w-full h-full flex flex-col flex-nowrap m-1"
			>
				{#if intersecting}
					<a
						href="{OpenModal === undefined ? '..' : ''}/manga/{manga.id}"
						on:click={(e) => {
							if (OpenModal !== undefined && !e.ctrlKey) {
								e.preventDefault();
								e.stopPropagation();
								OpenModal(manga.id);
							}
						}}
						class="{manga.inLibrary &&
							'opacity-70'} hover:opacity-70 cursor-pointer h-full"
						tabindex="-1"
					>
						<div class="aspect-cover w-auto h-full">
							<MangaCard
								thumbnailUrl={manga.thumbnailUrl ?? ''}
								title={manga.title}
								rounded="{$Meta.Display === display.Compact && 'rounded-lg'}
                  {$Meta.Display === display.Comfortable &&
									'rounded-none rounded-t-lg'}"
								aspect="aspect-cover"
							>
								{#if $Meta.Display === display.Compact}
									<div
										class="absolute bottom-0 left-0 right-0 variant-glass rounded-b-olg"
									>
										<div
											class="line-clamp-2 px-2 h-12 text-center"
											title={manga.title}
										>
											{manga.title}
										</div>
									</div>
								{/if}
								{#if manga.inLibrary}
									<div
										class="absolute top-1 right-1 badge variant-filled-primary"
									>
										In Library
									</div>
								{/if}
							</MangaCard>
						</div>
						{#if $Meta.Display === display.Comfortable}
							<div class="variant-glass-surface rounded-b-lg">
								<div
									class="line-clamp-2 px-2 h-12 text-center"
									title={manga.title}
								>
									{manga.title}
								</div>
							</div>
						{/if}
					</a>
				{:else}
					<div class="aspect-cover w-full" />
					{#if $Meta.Display === display.Comfortable}
						<div class="h-12" />
					{/if}
				{/if}
			</IntersectionObserver>
		{/each}
	</div>
</div>
