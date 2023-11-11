<script lang="ts">
	import GlobalSearchActions from './globalsearch/GlobalSearchActions.svelte';
	import {
		FetchSourceMangaType,
		fetchSourceManga,
		sources,
		type FetchSourceMangaMutation,
		type SourcesQuery
	} from '$lib/generated';
	import PQueue from 'p-queue';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import { onDestroy } from 'svelte';
	import MediaQuery2 from '$lib/components/MediaQuery2.svelte';
	import { SpecificSourceFilter } from './BrowseStores';
	import HorisontalmangaElement from './HorisontalmangaElement.svelte';
	import { AppBarData } from '$lib/MountTitleAction';
	import { Meta, display } from '$lib/simpleStores';

	export let title: string = 'Loading...';
	export let OpenModal: ((id: number) => void) | undefined = undefined;

	const queue = new PQueue({ concurrency: 4 });
	const query = queryParam('q', ssp.string(), { pushHistory: false });

	let rawSources = sources({ variables: { isNsfw: $Meta.nsfw ? null : false } });

	$: AppBarData(title, {
		component: GlobalSearchActions,
		props: {
			rawSources: $rawSources.data.sources,
			langs
		}
	});

	$: langs = getLangs($rawSources.data);
	function getLangs(srces: SourcesQuery) {
		if (srces?.sources?.nodes !== undefined) {
			return $rawSources.data.sources.nodes.reduce((a, c) => {
				if (!a.has(c.lang)) {
					return a.add(c.lang);
				}
				return a;
			}, new Set() as Set<string>);
		}
		return new Set() as Set<string>;
	}

	let alterableRaw: sourceWithManga[] | undefined = undefined;

	$: filteredSources = $rawSources.data.sources?.nodes?.filter((source) => {
		if (!$SpecificSourceFilter.has(source.id)) return false;
		return true;
	}) as SourcesQuery['sources']['nodes'] | undefined;

	$: filteredSources, $query, onQueryChange();
	function onQueryChange() {
		const Query = $query;
		alterableRaw = structuredClone(filteredSources);
		queue.clear();
		if (Query) {
			filteredSources?.forEach(async (souc) => {
				await queue.add(async () => {
					if (!alterableRaw) return;
					const id = alterableRaw?.findIndex((ele) => ele.id === souc.id);
					if (id === -1) return;
					alterableRaw[id].Loading = true;
					try {
						let tmp = await getMangasFromSource(souc.id, Query);
						if (Query === $query) {
							alterableRaw[id].Loading = false;
							alterableRaw[id].mangas = tmp.data?.fetchSourceManga.mangas;
						}
					} catch (error) {
						console.error(error);
						alterableRaw[id].Loading = false;
						alterableRaw[id].error = error;
					}
				});
			});
		}
	}

	function getMangasFromSource(source: string, query: string) {
		return fetchSourceManga({
			variables: { source, query, type: FetchSourceMangaType.Search, page: 1 }
		});
	}

	type sourceNode = SourcesQuery['sources']['nodes'][0];
	interface sourceWithManga extends sourceNode {
		mangas?: FetchSourceMangaMutation['fetchSourceManga']['mangas'];
		Loading?: boolean;
		error?: unknown;
	}

	$: groupSources = doGroupSources(langs, alterableRaw);

	function doGroupSources(
		langs: Set<string>,
		filteredSources: SourcesQuery['sources']['nodes'] | undefined
	) {
		if (!(!filteredSources || filteredSources.length || langs.size)) return [];
		if (!langs) return [];
		return Array.from(langs).map((lang) => {
			return [lang, filteredSources?.filter((elem) => elem.lang === lang)] as [
				string,
				sourceWithManga[]
			];
		});
	}

	onDestroy(() => {
		queue.clear();
	});
</script>

<MediaQuery2 let:gridnumber>
	{#if $rawSources.loading}
		Loading...
	{:else if $rawSources.error}
		{JSON.stringify($rawSources.error)}
	{:else if $rawSources.errors}
		<div class="flex justify-center p-8">
			{JSON.stringify($rawSources.errors)}
		</div>
	{:else if !filteredSources?.length}
		<div class="flex justify-center p-8">
			Sources filtered to nothing, try changing filters in the top right
		</div>
	{:else}
		{#if $query === null || $query === ''}
			<div class="flex justify-center p-8">Try searching for a manga in the top right</div>
		{/if}
		{#if groupSources}
			{#each groupSources.filter((e) => e[1]?.length) as group}
				<div class="text-5xl m-4">
					{group[0]}
				</div>
				{#each group[1] as source}
					<div class="text-4xl ml-8 my-4">{source.displayName}</div>
					{#if source.Loading}
						<div class="overflow-x-auto">
							<div class="flex flex-nowrap" style="width:calc({10 / gridnumber} * 100%)">
								{#each new Array(10) as _}
									<div class="w-full h-full flex flex-col flex-nowrap m-1">
										<div class="aspect-cover w-auto h-full">
											<div
												class="placeholder animate-pulse w-full h-full
                        {$Meta.Display === display.Compact && 'rounded-lg'}
                        {$Meta.Display === display.Comfortable && 'rounded-none rounded-t-lg'}"
											/>
										</div>
										{#if $Meta.Display === display.Comfortable}
											<div
												class="placeholder animate-pulse px-2 h-12 text-center rounded-none rounded-b-lg"
											/>
										{/if}
									</div>
								{/each}
							</div>
						</div>
					{:else if source.error}
						<div>{JSON.stringify(source.error)}</div>
					{:else if source.mangas}
						<HorisontalmangaElement mangas={source.mangas} {gridnumber} {OpenModal} />
					{/if}
				{/each}
			{/each}
		{/if}
	{/if}
</MediaQuery2>
