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
		deleteDownloadedChapters,
		enqueueChapterDownloads,
		fetchChaptersMigration,
		unbindTrack,
		updateChapters,
		updateMangas,
		updateMangasCategories
	} from '$lib/gql/Mutations';
	import { getManga } from '$lib/gql/Queries';
	import { ProgressRadial, getModalStore } from '@skeletonlabs/skeleton';
	import { getContextClient, type OperationResult } from '@urql/svelte';
	import { type ResultOf } from '$lib/gql/graphql';
	import type { SvelteComponent } from 'svelte';
	import { ErrorHelp } from '$lib/util.svelte';
	import ModalTemplate from '$lib/components/ModalTemplate.svelte';

	const modalStore = getModalStore();
	interface Props {
		parent: SvelteComponent;
		id: number;
		manga: ResultOf<typeof getManga>['manga'];
	}

	let { parent, id, manga }: Props = $props();

	const client = getContextClient();
	let doChapters = $state(true);
	let doCategories = $state(true);
	let doTracking = $state(true);
	let deleteDownloaded = $state(manga.downloadCount > 0 ? true : false);
	let DownloadNew = $state(true);

	let MigrateLoading = $state(false);
	let CopyLoading = $state(false);

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

		if (doCategories) ToDo.push(CopyMangaCategories());
		if (doTracking) ToDo.push(CopyMangaTracking());
		if (deleteDownloaded) ToDo.push(deleteDownloadedMangas());

		if (!doChapters && !DownloadNew) {
			await Promise.all(ToDo);
			return;
		}

		const newChapters = await client
			.mutation(fetchChaptersMigration, { id })
			.toPromise();

		if (doChapters) ToDo.push(CopyMangaChapters(newChapters));
		if (DownloadNew) ToDo.push(DownloadNewChapters(newChapters));
		await Promise.all(ToDo);
	}

	async function DownloadNewChapters(
		newChapters: OperationResult<ResultOf<typeof fetchChaptersMigration>>
	) {
		await ErrorHelp(
			'failed to download new chapters',
			client
				.mutation(enqueueChapterDownloads, {
					ids: newChapters.data?.fetchChapters?.chapters.map((e) => e.id) ?? []
				})
				.toPromise()
		);
	}

	async function deleteDownloadedMangas() {
		await ErrorHelp(
			'failed to delete Downloaded chapters',
			client
				.mutation(deleteDownloadedChapters, {
					ids: manga.chapters.nodes.map((e) => e.id)
				})
				.toPromise()
		);
	}

	async function CopyMangaChapters(
		newChapters: OperationResult<ResultOf<typeof fetchChaptersMigration>>
	) {
		const CurrMappedToNew = manga.chapters.nodes.map((current) => {
			if (!newChapters.data?.fetchChapters) return undefined;
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
		await client.mutation(updateMangasCategories, {
			id: [id],
			addTo: categories,
			clear: true
		});
	}

	async function CopyMangaTracking(): Promise<void> {
		const trackers = manga.trackRecords.nodes;
		await Promise.all(
			trackers.map(async (tracker) => {
				try {
					await client.mutation(unbindTrack, {
						recordId: tracker.id
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
	<ModalTemplate titleText="Select data to include">
		{#snippet children()}
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
			{#if manga.downloadCount > 0}
				<Slide
					class="p-1 pl-2 outline-0 hover:variant-glass-surface"
					bind:checked={deleteDownloaded}
				>
					Delete old Downloaded chapters
				</Slide>
			{/if}
			<Slide
				class="p-1 pl-2 outline-0 hover:variant-glass-surface"
				bind:checked={DownloadNew}
			>
				Downloaded all new chapters
			</Slide>
		{/snippet}
		{#snippet footer()}
			<div class="flex justify-between px-4 pb-4">
				<a
					class="variant-filled-surface btn hover:variant-glass-surface"
					target="_blank"
					href="/manga/{id}"
				>
					show entry
				</a>
				<div>
					<button
						onclick={CopyManga}
						class="variant-filled-surface btn hover:variant-glass-surface"
					>
						{#if CopyLoading}
							Copying<ProgressRadial class="ml-1 aspect-square h-4 w-auto" />
						{:else}
							Copy
						{/if}
					</button>
					<button
						onclick={MigrateManga}
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
		{/snippet}
	</ModalTemplate>
{/if}
