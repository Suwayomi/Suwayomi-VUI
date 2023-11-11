<script lang="ts">
	import Image from '$lib/components/Image.svelte';
	import IntersectionObserver from '$lib/components/IntersectionObserver.svelte';
	import { sourcesMigration, type SourcesMigrationQuery } from '$lib/generated';
	import { AppBarData } from '$lib/MountTitleAction';
	import Nav from '../Nav.svelte';

	AppBarData('Migrate');
	const Migration = sourcesMigration({});

	$: sources = FigureOutSources($Migration.data);

	type Source = SourcesMigrationQuery['sources']['nodes'][0];

	interface sourceWithMangaCount extends Source {
		mangas?: {
			TotalCount: number;
		};
		broken?: boolean;
	}

	function FigureOutSources(data: SourcesMigrationQuery) {
		if (!data.sources || !data.mangas) return undefined;
		const tmpsources: sourceWithMangaCount[] = structuredClone(data.sources.nodes);
		data.mangas.nodes.forEach((manga) => {
			const tmp = tmpsources.find((source) => source.id === manga.sourceId);
			if (!tmp) {
				tmpsources.push({
					id: manga.sourceId,
					displayName: manga.sourceId,
					iconUrl: '',
					lang: '',
					broken: true,
					mangas: {
						TotalCount: 1
					}
				});
				return;
			}
			if (tmp.mangas) tmp.mangas.TotalCount += 1;
			else tmp.mangas = { TotalCount: 1 };
		});
		return tmpsources.filter((e) => e.mangas?.TotalCount);
	}
</script>

<Nav let:scrollingElement>
	{#if $Migration.loading}
		Loading...
	{:else if $Migration.error}
		{JSON.stringify($Migration.error)}
	{:else if $Migration.errors}
		{JSON.stringify($Migration.errors)}
	{:else if sources}
		<div>
			{#each sources as source (source.id)}
				<IntersectionObserver
					top={400}
					bottom={400}
					root={scrollingElement}
					let:intersecting
					class="h-24"
				>
					{#if intersecting}
						<a href="migrate/source/{source.id}">
							<div class="flex h-full items-center hover:variant-glass">
								<div class="p-1 h-full">
									<Image src={source.iconUrl} aspect="aspect-square" width="h-auto" />
								</div>
								<div class="w-full">
									{source.displayName}
								</div>
								<div class="m-2">
									<span class="badge variant-filled-primary">{source.mangas?.TotalCount}</span>
								</div>
							</div>
						</a>
					{/if}
				</IntersectionObserver>
			{/each}
		</div>
	{/if}
</Nav>
