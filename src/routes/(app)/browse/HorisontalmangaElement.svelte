<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import MangaCard from '$lib/components/MangaCard.svelte';
	import IntersectionObserver from '$lib/components/IntersectionObserver.svelte';
	import { display, gmState } from '$lib/simpleStores.svelte';

	import type { fetchSourceManga } from '$lib/gql/Mutations';
	import type { ResultOf } from '$lib/gql/graphql';

	interface Props {
		mangas: NonNullable<
			ResultOf<typeof fetchSourceManga>['fetchSourceManga']
		>['mangas'];
		gridnumber: number;
		OpenModal?: ((id: number) => void) | undefined;
	}

	let { mangas, gridnumber, OpenModal = undefined }: Props = $props();

	let scrollingElement: HTMLDivElement | undefined = $state();
</script>

<div class="overflow-x-auto" bind:this={scrollingElement}>
	<div
		class="flex flex-nowrap"
		style="width:calc({mangas.length / gridnumber} * 100%)"
	>
		{#each mangas as manga}
			<IntersectionObserver
				root={scrollingElement}
				left={400}
				right={400}
				class="m-1 flex h-full w-full flex-col flex-nowrap"
			>
				{#snippet children({ intersecting })}
					{#if intersecting}
						<a
							href="{OpenModal === undefined ? '..' : ''}/manga/{manga.id}"
							onclick={(e) => {
								if (OpenModal !== undefined && !e.ctrlKey) {
									e.preventDefault();
									e.stopPropagation();
									OpenModal(manga.id);
								}
							}}
							class="{manga.inLibrary &&
								'opacity-70'} h-full cursor-pointer hover:opacity-70"
							tabindex="-1"
						>
							<div class="aspect-cover h-full w-auto">
								<MangaCard
									thumbnailUrl={manga.thumbnailUrl ?? ''}
									title={manga.title}
									rounded="{gmState.value.Display === display.Compact &&
										'rounded-lg'}
	                  {gmState.value.Display === display.Comfortable &&
										'rounded-none rounded-t-lg'}"
									aspect="aspect-cover"
								>
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
									{#if manga.inLibrary}
										<div
											class="variant-filled-primary badge absolute right-1 top-1"
										>
											In Library
										</div>
									{/if}
								</MangaCard>
							</div>
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
					{:else}
						<div class="aspect-cover w-full"></div>
						{#if gmState.value.Display === display.Comfortable}
							<div class="h-12"></div>
						{/if}
					{/if}
				{/snippet}
			</IntersectionObserver>
		{/each}
	</div>
</div>
