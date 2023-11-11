<script lang="ts">
	import { AppBarData } from '$lib/MountTitleAction';
	import IntersectionObserver from '$lib/components/IntersectionObserver.svelte';
	import MangaCard from '$lib/components/MangaCard.svelte';
	import { sourceMigrationManga, sourceMigrationsource } from '$lib/generated';
	import { Meta, display } from '$lib/simpleStores';
	import { gridValues } from '$lib/util';
	import type { PageData } from './$types';

	export let data: PageData;

	AppBarData(data.SourceID);

	const Manga = sourceMigrationManga({ variables: { sourceId: data.SourceID } });
	const source = sourceMigrationsource({ variables: { sourceId: data.SourceID } });

	$: if ($source.data.source?.displayName) AppBarData($source.data.source.displayName);
</script>

{#if $Manga.loading}
	Loading...
{:else if $Manga.error}
	{JSON.stringify($Manga.error)}
{:else if $Manga.errors}
	{JSON.stringify($Manga.errors)}
{:else if $Manga.data}
	<div class="yoy grid {gridValues} gap-2 m-2">
		{#each $Manga.data.mangas.nodes as manga}
			<IntersectionObserver
				let:intersecting
				root={document.querySelector('#page') ?? undefined}
				top={400}
				bottom={400}
			>
				<div class="aspect-cover">
					{#if intersecting}
						<a
							href="../manga/{manga.id}"
							class="hover:opacity-70 cursor-pointer h-full"
							tabindex="-1"
						>
							<MangaCard
								thumbnailUrl={manga.thumbnailUrl ?? ''}
								title={manga.title}
								rounded="{$Meta.Display === display.Compact && 'rounded-lg'}
									{$Meta.Display === display.Comfortable && 'rounded-none rounded-t-lg'}"
							>
								{#if $Meta.Display === display.Compact}
									<div class="absolute bottom-0 left-0 right-0 variant-glass rounded-b-olg">
										<div class="line-clamp-2 px-2 h-12 text-center" title={manga.title}>
											{manga.title}
										</div>
									</div>
								{/if}
							</MangaCard>
							{#if $Meta.Display === display.Comfortable}
								<div class="variant-glass-surface rounded-b-lg">
									<div class="line-clamp-2 px-2 h-12 text-center" title={manga.title}>
										{manga.title}
									</div>
								</div>
							{/if}
						</a>
					{/if}
				</div>
				{#if !intersecting && $Meta.Display === display.Comfortable}
					<div class="h-12" />
				{/if}
			</IntersectionObserver>
		{/each}
	</div>
{/if}
