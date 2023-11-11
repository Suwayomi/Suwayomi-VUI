<script lang="ts">
	import { AppBarData } from '$lib/MountTitleAction';
	import { getToastStore } from '$lib/components/Toast/stores';
	import {
		ExtensionsDoc,
		fetchExtensions,
		extensions as getExtensions,
		type Exact,
		type ExtensionsQuery,
		type FetchExtensionsMutation,
		type InputMaybe
	} from '$lib/generated';
	import { Errorhelp, Partition } from '$lib/util';
	import type { ApolloQueryResult, ObservableQuery } from '@apollo/client';
	import type { Readable } from 'svelte/motion';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import Nav from '../Nav.svelte';
	import { ISOLanguages } from '../languages';
	import ExtentionsActions from './ExtensionsActions.svelte';
	import { langfilt, lastFetched } from './ExtensionsStores';
	import ExtensionCard from './ExtensionCard.svelte';
	import { Meta } from '$lib/simpleStores';

	let toastStore = getToastStore();
	const query = queryParam('q', ssp.string(), { pushHistory: false });
	type Textension = ExtensionsQuery['extensions']['nodes'][0];

	let extensions: Readable<
		ApolloQueryResult<ExtensionsQuery> & {
			query: ObservableQuery<
				ExtensionsQuery,
				Exact<{
					isNsfw?: InputMaybe<boolean> | undefined;
				}>
			>;
		}
	>;

	checkIfFetchNewExtentions();
	async function checkIfFetchNewExtentions() {
		if ($lastFetched.valueOf() + 8.64e7 < Date.now().valueOf()) {
			await Errorhelp(
				'failed to fetch new extentions',
				fetchExtensions({
					update: (
						cache,
						{
							data: {
								fetchExtensions: { extensions }
							}
						}
					) => {
						let nodes = extensions as FetchExtensionsMutation['fetchExtensions']['extensions'];
						if (!$Meta.nsfw) nodes = nodes.filter((e) => !e.isNsfw);
						cache.writeQuery({
							query: ExtensionsDoc,
							data: { extensions: { nodes } },
							variables: { isNsfw: $Meta.nsfw ? null : false }
						});
						$lastFetched = new Date();
					}
				}),
				toastStore
			);
		}
		extensions = getExtensions({ variables: { isNsfw: $Meta.nsfw ? null : false } });
	}

	$: langs = getLangs($extensions?.data);
	$: AppBarData('Extentions', { component: ExtentionsActions, props: { langs } });
	function getLangs(srces: ExtensionsQuery) {
		if (srces?.extensions?.nodes) {
			return $extensions.data.extensions.nodes.reduce((a, c) => {
				if (!a.has(c.lang)) {
					return a.add(c.lang);
				}
				return a;
			}, new Set() as Set<string>);
		}
		return new Set() as Set<string>;
	}

	$: filteredExtensions = $extensions?.data?.extensions?.nodes.filter((ele) => {
		if (!$langfilt.has(ele.lang)) return false;
		if ($query !== '' && $query !== null) {
			return ele.name.toLowerCase().includes($query.toLocaleLowerCase());
		}
		return true;
	});

	$: groupExtensions = doGroupSources(filteredExtensions, langs);
	function doGroupSources(filteredSrces: Textension[] | undefined, langs: Set<string>) {
		if (!filteredSrces) return undefined;
		const [hasUpdate, DoesntHaveUpdate] = Partition(filteredSrces, (e) => e.hasUpdate);
		const [isInstalled, isntInstalled] = Partition(DoesntHaveUpdate, (e) => e.isInstalled);
		const always = [
			['Update Pending', hasUpdate],
			['Installed', isInstalled]
		] as [string, Textension[]][];
		if (!(isntInstalled?.length || langs.size)) return always;
		return [
			...always,
			...[...langs].map(
				(lang) =>
					[lang, isntInstalled?.filter((elem) => elem.lang === lang)] as [string, Textension[]]
			)
		];
	}
</script>

<Nav let:scrollingElement>
	{#if $extensions == undefined || $extensions.loading}
		Loading...
	{:else if $extensions.error}
		{JSON.stringify($extensions.error)}
	{:else if groupExtensions}
		<div class="px-4">
			{#each groupExtensions as Langset}
				{#if Langset[1].length}
					<h2 class="h2 p-2">
						{ISOLanguages.find((ele) => ele.code.toLowerCase() === Langset[0].toLowerCase())
							?.nativeName ?? Langset[0]}
					</h2>
					{#each Langset[1] as ext (ext.pkgName)}
						<ExtensionCard {ext} {scrollingElement} />
					{/each}
				{/if}
			{/each}
		</div>
	{/if}
</Nav>
