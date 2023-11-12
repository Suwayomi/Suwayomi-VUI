<script lang="ts">
	import IntersectionObserver from '$lib/components/IntersectionObserver.svelte';
	import Image from '$lib/components/Image.svelte';
	import {
		ExtensionsDoc,
		SourcesDoc,
		updateExtension,
		type ExtensionsQuery,
		type SourcesQuery,
		type UpdateExtensionMutation
	} from '$lib/generated';
	import type { ApolloCache, FetchResult } from '@apollo/client';
	import { Errorhelp } from '$lib/util';
	import { getToastStore } from '$lib/components/Toast/stores';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { Meta } from '$lib/simpleStores';

	export let scrollingElement: HTMLDivElement;
	export let ext: ExtensionsQuery['extensions']['nodes'][0];

	let toastStore = getToastStore();
	let loadingUpdate = false;
	let loadingInstall = false;
	let loadingunInstall = false;

	function UpdaterForUpdateExtension(
		cache: ApolloCache<unknown>,
		{ data }: Omit<FetchResult<UpdateExtensionMutation>, 'context'>,
		pkgName: string
	): void {
		if (!data) return;
		try {
			const { extensions } = structuredClone(
				structuredClone(
					cache.readQuery({
						query: ExtensionsDoc,
						variables: { isNsfw: $Meta.nsfw ? null : false }
					})
				)
			) as ExtensionsQuery;

			extensions.nodes[extensions.nodes.findIndex((e) => e.pkgName === pkgName)] =
				data.updateExtension.extension;
			cache.writeQuery({
				query: ExtensionsDoc,
				data: { extensions },
				variables: { isNsfw: $Meta.nsfw ? null : false }
			});
		} catch {}
		try {
			const { sources } = structuredClone(
				cache.readQuery({
					query: SourcesDoc,
					variables: { isNsfw: $Meta.nsfw ? null : false }
				})
			) as SourcesQuery;
			if (data.updateExtension.extension.isInstalled) {
				const souceToPush: SourcesQuery['sources']['nodes'] = [];
				data.updateExtension.extension.source.nodes.forEach((source) => {
					if (!sources.nodes.find((e) => e.id === source.id)) souceToPush.push(source);
				});
				sources.nodes.push(...souceToPush);
				cache.writeQuery({
					query: SourcesDoc,
					variables: { isNsfw: $Meta.nsfw ? null : false },
					data: { sources }
				});
			} else {
				sources.nodes = sources.nodes.filter((e) => e.extension.pkgName !== pkgName);
				cache.writeQuery({
					query: SourcesDoc,
					variables: { isNsfw: $Meta.nsfw ? null : false },
					data: { sources }
				});
			}
		} catch {}
	}

	async function unInstall(pkgName: string) {
		loadingunInstall = true;
		await Errorhelp(
			'failed to Uninstall extention',
			updateExtension({
				variables: { pkgName, uninstall: true },
				update: (cache, data) => {
					UpdaterForUpdateExtension(cache, data, pkgName);
				}
			}),
			toastStore
		);
		loadingunInstall = false;
	}

	async function Install(pkgName: string) {
		loadingInstall = true;
		await Errorhelp(
			'Failed to Install extention',
			updateExtension({
				variables: { pkgName, install: true },
				update: (cache, data) => {
					UpdaterForUpdateExtension(cache, data, pkgName);
				}
			}),
			toastStore
		);
		loadingInstall = false;
	}

	async function Update(pkgName: string) {
		loadingUpdate = true;
		await Errorhelp(
			'Failed to Update extention',
			updateExtension({
				variables: { pkgName, update: true },
				update: (cache, data) => {
					UpdaterForUpdateExtension(cache, data, pkgName);
				}
			}),
			toastStore
		);
		loadingUpdate = false;
	}
</script>

<IntersectionObserver
	let:intersecting
	root={scrollingElement}
	top={400}
	bottom={400}
	class="h-28 m-1"
>
	{#if intersecting}
		<div class="card variant-ghost flex w-full h-full items-center">
			<div class="p-1 h-full flex-shrink-0">
				<Image height="h-full" width="w-auto" aspect="aspect-square" src={ext.iconUrl} />
			</div>
			<div>
				{ext.name}
				<div class="opacity-70 text-sm">
					{ext.versionName}
					{#if ext.isNsfw}
						<span class="text-red-600">18+</span>
					{/if}
				</div>
			</div>
			<div class="flex flex-wrap flex-1 justify-end">
				{#if ext.isObsolete}
					<button on:click={() => unInstall(ext.pkgName)} class="btn variant-ghost-error m-1">
						{#if loadingunInstall}
							Uninstalling<ProgressRadial class="ml-1 h-4 aspect-square w-auto" />
						{:else}
							Obsolete
						{/if}
					</button>
				{:else}
					{#if ext.hasUpdate}
						<button on:click={() => Update(ext.pkgName)} class="btn variant-ghost-surface m-1">
							{#if loadingUpdate}
								Updating<ProgressRadial class="ml-1 h-4 aspect-square w-auto" />
							{:else}
								Update
							{/if}
						</button>
					{/if}
					{#if ext.isInstalled}
						<button on:click={() => unInstall(ext.pkgName)} class="btn variant-ghost-surface m-1">
							{#if loadingunInstall}
								Uninstalling<ProgressRadial class="ml-1 h-4 aspect-square w-auto" />
							{:else}
								Uninstall
							{/if}
						</button>
					{:else}
						<button on:click={() => Install(ext.pkgName)} class="btn variant-ghost-surface m-1">
							{#if loadingInstall}
								Installing<ProgressRadial class="ml-1 h-4 aspect-square w-auto" />
							{:else}
								Install
							{/if}
						</button>
					{/if}
				{/if}
			</div>
		</div>
	{/if}
</IntersectionObserver>
