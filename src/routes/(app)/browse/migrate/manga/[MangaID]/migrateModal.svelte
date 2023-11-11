<script lang="ts">
	import { goto } from '$app/navigation';
	import Slide from '$lib/components/Slide.svelte';
	import {
		AsyncgetManga,
		CategoryDoc,
		GetMangaDoc,
		fetchChaptersMigration,
		updateChapters,
		updateMangaCategories,
		updateMangas,
		type CategoryQuery,
		type GetMangaQuery,
		type UpdateMangaCategoriesMutation
	} from '$lib/generated';
	import type { ApolloCache, FetchResult } from '@apollo/client';
	import { ProgressRadial, getModalStore } from '@skeletonlabs/skeleton';
	import type { SvelteComponent } from 'svelte';

	const modalStore = getModalStore();
	export let parent: SvelteComponent;
	export let id: number;
	export let manga: GetMangaQuery['manga'];

	let doChapters = true;
	let doCategories = true;

	let MigrateLoading = false;
	let CopyLoading = false;

	async function MigrateManga() {
		MigrateLoading = true;
		await migrationBulk();
		await updateMangas({
			variables: { ids: manga.id, inLibrary: false }
		});
		MigrateLoading = false;
		goto(`/manga/${id}`, { replaceState: true });
	}

	async function CopyManga() {
		CopyLoading = true;
		await migrationBulk();
		CopyLoading = false;
		goto(`/manga/${id}`, { replaceState: true });
	}

	async function migrationBulk() {
		await updateMangas({
			variables: { ids: id, inLibrary: true }
		});
		if (doChapters) {
			await CopyMangaChapters();
		}
		if (doCategories) {
			await CopyMangaCategories();
		}
		parent.onClose();
	}

	async function CopyMangaChapters() {
		const newChapters = await fetchChaptersMigration({ variables: { id } });
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

		const areRead = CurrMappedToNew.filter((ele) => (ele ? ele.isRead : false)).map(
			(ele) => ele?.id
		) as number[];
		const areBookmarked = CurrMappedToNew.filter((ele) => (ele ? ele.isBookmarked : false)).map(
			(ele) => ele?.id
		) as number[];

		updateChapters({
			variables: { ids: areRead, isRead: true }
		});
		updateChapters({
			variables: { ids: areBookmarked, isBookmarked: true }
		});
	}

	async function updateMangaCategoriesUpdate(
		cache: ApolloCache<unknown>,
		{ data }: Omit<FetchResult<UpdateMangaCategoriesMutation>, 'context'>,
		dat: GetMangaQuery
	): Promise<void> {
		if (!data?.updateMangaCategories.manga.categories.nodes) return;
		const nodes = data.updateMangaCategories.manga.categories.nodes;

		const errors: Error[] = [];

		//// update this mangas categories
		try {
			const magna = structuredClone(manga);
			magna.categories.nodes = nodes;

			cache.writeQuery({
				query: GetMangaDoc,
				variables: { id: manga.id },
				data: { manga: magna }
			});
		} catch (e) {
			if (e instanceof Error) errors.push(e);
		}

		//// update the categories in library
		try {
			if (!dat.manga) throw '';

			const oldNodes = dat.manga.categories.nodes;
			if (!oldNodes) return;
			try {
				const currentmanga: CategoryQuery['category']['mangas']['nodes'][0] = {
					id: id,
					title: dat.manga.title,
					inLibrary: dat.manga.inLibrary ?? true,
					thumbnailUrl: dat.manga.thumbnailUrl,
					unreadCount: dat.manga.unreadCount ?? 0,
					downloadCount: dat.manga.downloadCount ?? 0,
					lastReadChapter: dat.manga.lastReadChapter ?? undefined,
					chapters: dat.manga.chapters ?? {
						totalCount: 0
					}
				};
				// add to categories that now have it

				nodes.forEach((newnode) => {
					if (oldNodes.find((oldnode) => oldnode.id === newnode.id)) return;
					try {
						const { category } = structuredClone(
							cache.readQuery({
								query: CategoryDoc,
								variables: { id: newnode.id }
							})
						) as CategoryQuery;
						category.mangas.nodes.push(currentmanga);

						cache.writeQuery({
							query: CategoryDoc,
							variables: { id: newnode.id },
							data: { category }
						});
					} catch {}
				});
				// add to 0 if now in default
				if (nodes.length === 0 && oldNodes.length > 0) {
					try {
						const { category } = structuredClone(
							cache.readQuery({
								query: CategoryDoc,
								variables: { id: 0 }
							})
						) as CategoryQuery;

						category.mangas.nodes.push(currentmanga);

						cache.writeQuery({
							query: CategoryDoc,
							variables: { id: 0 },
							data: { category }
						});
					} catch {}
				}
			} catch {}

			//remove from categories that no longer have it
			oldNodes.forEach((oldnode) => {
				if (nodes.find((newnode) => oldnode.id === newnode.id)) return;
				try {
					const { category } = structuredClone(
						cache.readQuery({
							query: CategoryDoc,
							variables: { id: oldnode.id }
						})
					) as CategoryQuery;

					category.mangas.nodes = category.mangas.nodes.filter((e) => e.id !== dat.manga.id);

					cache.writeQuery({
						query: CategoryDoc,
						variables: { id: oldnode.id },
						data: { category }
					});
				} catch {}
			});

			// remove from 0 if no longer in default
			if (oldNodes.length === 0 && nodes.length > 0) {
				//remove from default
				try {
					const { category } = structuredClone(
						cache.readQuery({
							query: CategoryDoc,
							variables: { id: 0 }
						})
					) as CategoryQuery;

					category.mangas.nodes = category.mangas.nodes.filter((e) => e.id !== dat.manga.id);

					cache.writeQuery({
						query: CategoryDoc,
						variables: { id: 0 },
						data: { category }
					});
				} catch {}
			}
		} catch {}

		if (errors.length > 0) {
			console.error(errors);
			throw new Error('check console');
		}
	}

	async function CopyMangaCategories() {
		const categories = manga.categories.nodes.map((ele) => ele.id);
		const { data: dat } = await AsyncgetManga({ variables: { id } });
		await updateMangaCategories({
			variables: {
				id: id,
				addTo: categories,
				clear: true
			},
			update: (a, b) => updateMangaCategoriesUpdate(a, b, dat)
		});
	}
</script>

{#if $modalStore[0]}
	<div class="card p-0 w-modal shadow-xl space-y-4 rounded-lg max-h-screen">
		<h1 class="h3 pt-4 pl-4">Select data to include</h1>
		<div class="pl-4 border-y border-surface-700">
			<div class="max-h-96 overflow-y-auto grid grid-cols-1 gap-1 pr-4">
				<Slide class="outline-0 p-1 pl-2 hover:variant-glass-surface" bind:checked={doChapters}>
					Chapters
				</Slide>
				<Slide class="outline-0 p-1 pl-2 hover:variant-glass-surface" bind:checked={doCategories}>
					Categories
				</Slide>
			</div>
		</div>
		<div class="p-4 flex justify-between">
			<a
				class="btn variant-filled-surface hover:variant-glass-surface"
				target="_blank"
				href="/manga/{id}"
			>
				show entry
			</a>
			<div>
				<button on:click={CopyManga} class="btn variant-filled-surface hover:variant-glass-surface">
					{#if CopyLoading}
						Copying<ProgressRadial class="ml-1 h-4 aspect-square w-auto" />
					{:else}
						Copy
					{/if}
				</button>
				<button
					on:click={MigrateManga}
					class="btn variant-filled-surface hover:variant-glass-surface"
				>
					{#if MigrateLoading}
						MigratIng<ProgressRadial class="ml-1 h-4 aspect-square w-auto" />
					{:else}
						Migrate
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}
