<script lang="ts">
	import IntersectionObserver from '$lib/components/IntersectionObserver.svelte';
	import MangaCard from '$lib/components/MangaCard.svelte';
	import { sources as getsources, type SourcesQuery } from '$lib/generated';
	import { AppBarData } from '$lib/MountTitleAction';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import { ISOLanguages } from '../languages';
	import Nav from '../Nav.svelte';
	import SourcesActions from './SourcesActions.svelte';
	import { Sourcelangfilt } from './SourcesStores';
	import { Meta } from '$lib/simpleStores';

	AppBarData('Sources');

	type Tsource = SourcesQuery['sources']['nodes'][0];

	const sources = getsources({ variables: { isNsfw: $Meta.nsfw ? null : false } });
	const query = queryParam('q', ssp.string(), { pushHistory: false });

	$: filteredSources = $sources.data?.sources?.nodes.filter((ele) => {
		if (!$Sourcelangfilt.has(ele.lang)) return false;
		if ($query !== '' && $query !== null) {
			return ele.displayName.toLowerCase().includes($query.toLocaleLowerCase());
		}
		return true;
	});

	$: langs = getLangs($sources.data);
	function getLangs(srces: SourcesQuery) {
		if (srces?.sources?.nodes !== undefined) {
			return $sources.data.sources.nodes.reduce((a, c) => {
				if (!a.has(c.lang)) {
					return a.add(c.lang);
				}
				return a;
			}, new Set() as Set<string>);
		}
		return new Set() as Set<string>;
	}

	$: langs, AppBarData('Sources', { component: SourcesActions, props: { langs } });

	$: groupSources = doGroupSources(filteredSources, langs);
	function doGroupSources(filteredSrces: Tsource[], langs: Set<string>) {
		if (!(filteredSrces?.length || langs.size)) return [];
		return [...langs].map((lang) => {
			return [lang, filteredSrces?.filter((elem) => elem.lang === lang)] as [string, Tsource[]];
		});
	}
</script>

{#if $sources.error}
	{JSON.stringify($sources.error)}
{:else if $sources.loading}
	Loading...
{:else if groupSources}
	<Nav let:scrollingElement>
		{#each groupSources.filter((ele) => ele[1].length) as [Lang, sous]}
			<div class="text-5xl py-4 px-8">
				{ISOLanguages.find((ele) => ele.code.toLowerCase() === Lang.toLowerCase())?.nativeName ??
					Lang}
			</div>
			<div
				class="grid xs:grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-2 mx-2"
			>
				{#each sous as source (source.id)}
					<IntersectionObserver
						let:intersecting
						root={scrollingElement}
						top={400}
						bottom={400}
						class="aspect-cover card"
					>
						{#if intersecting}
							<a href="source/{source.id}/popular">
								<MangaCard
									thumbnailUrl={source.iconUrl}
									title={source.displayName}
									fit="object-contain object-top"
								>
									<div class="absolute bottom-0 left-0 right-0 variant-glass rounded-b-olg">
										<div class="line-clamp-2 px-2 h-12 text-center" title={source.displayName}>
											{source.displayName}
										</div>
									</div>
								</MangaCard>
							</a>
						{/if}
					</IntersectionObserver>
				{/each}
			</div>
		{/each}
		<div class="w-full flex flex-col justify-center items-center p-1">
			<p>You have reached the end of the list.</p>
			<p>
				If you are not seeing a source you expected to see, try changing the language filter in the
				top right.
			</p>
		</div>
	</Nav>
{/if}
