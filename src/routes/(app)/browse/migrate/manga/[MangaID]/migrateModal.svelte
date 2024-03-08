<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { goto } from '$app/navigation';
	import Slide from '$lib/components/Slide.svelte';
	import {
		bindTrack,
		fetchChaptersMigration,
		updateChapters,
		updateMangaCategories,
		updateMangas,
		updateTrack
	} from '$lib/gql/Mutations';
	import { getManga } from '$lib/gql/Queries';
	import { ProgressRadial, getModalStore } from '@skeletonlabs/skeleton';
	import { getContextClient } from '@urql/svelte';
	import { type ResultOf } from '$lib/gql/graphql';
	import type { SvelteComponent } from 'svelte';

	const modalStore = getModalStore();
	export let parent: SvelteComponent;
	export let id: number;
	export let manga: ResultOf<typeof getManga>['manga'];

	const client = getContextClient();
	let doChapters = true;
	let doCategories = true;
	let doTracking = true;

	let MigrateLoading = false;
	let CopyLoading = false;

	async function MigrateManga() {
		MigrateLoading = true;
		await migrationBulk();
		await client
			.mutation(updateMangas, {
				ids: [manga.id],
				inLibrary: false
			})
			.toPromise();
		MigrateLoading = false;
		setTimeout(() => {
			goto(`/manga/${id}`, { replaceState: true });
		}, 1);
		parent.onClose();
	}

	async function CopyManga() {
		CopyLoading = true;
		await migrationBulk();
		CopyLoading = false;
		setTimeout(() => {
			goto(`/manga/${id}`, { replaceState: true });
		}, 1);
		parent.onClose();
	}

	async function migrationBulk() {
		await client
			.mutation(updateMangas, { ids: [id], inLibrary: true })
			.toPromise();
		const ToDo: Promise<void>[] = [];
		if (doChapters) {
			ToDo.push(CopyMangaChapters());
		}
		if (doCategories) {
			ToDo.push(CopyMangaCategories());
		}
		if (doTracking) {
			ToDo.push(CopyMangaTracking());
		}
		await Promise.all(ToDo);
	}

	async function CopyMangaChapters() {
		const newChapters = await client
			.mutation(fetchChaptersMigration, { id })
			.toPromise();
		// const newChapters = await fetchChaptersMigration({ variables: { id } });
		const CurrMappedToNew = manga.chapters.nodes.map((current) => {
			if (!newChapters.data) return undefined;
			const tmp = newChapters.data.fetchChapters.chapters.findIndex(
				(e) => e.chapterNumber === current.chapterNumber
			);
			if (tmp === -1) return undefined;
			return {
				...current,
				id: newChapters.data.fetchChapters.chapters[tmp].id
			};
		});

		const areRead = CurrMappedToNew.filter((ele) =>
			ele ? ele.isRead : false
		).map((ele) => ele?.id) as number[];
		const areBookmarked = CurrMappedToNew.filter((ele) =>
			ele ? ele.isBookmarked : false
		).map((ele) => ele?.id) as number[];

		await client.mutation(updateChapters, {
			ids: areRead,
			isRead: true
		});
		await client.mutation(updateChapters, {
			ids: areBookmarked,
			isBookmarked: true
		});
	}

	async function CopyMangaCategories() {
		const categories = manga.categories.nodes.map((ele) => ele.id);
		await client.mutation(updateMangaCategories, {
			id: id,
			addTo: categories,
			clear: true
		});
	}

	async function CopyMangaTracking(): Promise<void> {
		const trackers = manga.trackRecords.nodes;
		await Promise.all(
			trackers.map(async (tracker) => {
				try {
					await client.mutation(updateTrack, {
						input: {
							unbind: true,
							recordId: tracker.id
						}
					});
					await client.mutation(bindTrack, {
						mangaId: id,
						trackerId: tracker.trackerId,
						remoteId: tracker.remoteId
					});
				} catch {}
			})
		);
	}
</script>

{#if $modalStore[0]}
	<div class="card w-modal max-h-screen space-y-4 rounded-lg p-0 shadow-xl">
		<h1 class="h3 pl-4 pt-4">Select data to include</h1>
		<div class="border-y border-surface-700 pl-4">
			<div class="grid max-h-96 grid-cols-1 gap-1 overflow-y-auto pr-4">
				<Slide
					class="p-1 pl-2 outline-0 hover:variant-glass-surface"
					bind:checked={doChapters}
				>
					Chapters
				</Slide>
				<Slide
					class="p-1 pl-2 outline-0 hover:variant-glass-surface"
					bind:checked={doCategories}
				>
					Categories
				</Slide>
				<Slide
					class="p-1 pl-2 outline-0 hover:variant-glass-surface"
					bind:checked={doTracking}
				>
					Tracking
				</Slide>
			</div>
		</div>
		<div class="flex justify-between p-4">
			<a
				class="variant-filled-surface btn hover:variant-glass-surface"
				target="_blank"
				href="/manga/{id}"
			>
				show entry
			</a>
			<div>
				<button
					on:click={CopyManga}
					class="variant-filled-surface btn hover:variant-glass-surface"
				>
					{#if CopyLoading}
						Copying<ProgressRadial class="ml-1 aspect-square h-4 w-auto" />
					{:else}
						Copy
					{/if}
				</button>
				<button
					on:click={MigrateManga}
					class="variant-filled-surface btn hover:variant-glass-surface"
				>
					{#if MigrateLoading}
						Migrating<ProgressRadial class="ml-1 aspect-square h-4 w-auto" />
					{:else}
						Migrate
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}
