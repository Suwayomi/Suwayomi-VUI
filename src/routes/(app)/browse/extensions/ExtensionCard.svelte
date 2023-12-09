<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

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
	import { ErrorHelp } from '$lib/util';
	import { getToastStore } from '$lib/components/Toast/stores';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { Meta } from '$lib/simpleStores';

	export let scrollingElement: HTMLDivElement;
	export let ext: ExtensionsQuery['extensions']['nodes'][0];

	let toastStore = getToastStore();
	let loadingUpdate = false;
	let loadingInstall = false;
	let loadingUnInstall = false;

	function UpdateExtensionUpdater(
		cache: ApolloCache<unknown>,
		{ data }: Omit<FetchResult<UpdateExtensionMutation>, 'context'>,
		pkgName: string
	): void {
		if (!data) return;
		try {
			const extensionsData = cache.readQuery<ExtensionsQuery>({
				query: ExtensionsDoc,
				variables: { isNsfw: $Meta.nsfw ? null : false }
			});
			if (!extensionsData) throw new Error('failed to read extensions');
			const { extensions } = extensionsData;

			extensions.nodes[extensions.nodes.findIndex((extension) => extension.pkgName === pkgName)] =
				data.updateExtension.extension;

			cache.writeQuery({
				query: ExtensionsDoc,
				data: { extensions },
				variables: { isNsfw: $Meta.nsfw ? null : false }
			});
		} catch {}
		const sourcesData = cache.readQuery<SourcesQuery>({
			query: SourcesDoc,
			variables: { isNsfw: $Meta.nsfw ? null : false }
		});
		if (!sourcesData) return;
		const { sources } = sourcesData;

		if (data.updateExtension.extension.isInstalled) {
			const sourcesToPush: SourcesQuery['sources']['nodes'] = [];
			data.updateExtension.extension.source.nodes.forEach((source) => {
				if (!sources.nodes.find((existingSource) => existingSource.id === source.id)) {
					sourcesToPush.push(source);
				}
			});
			sources.nodes.push(...sourcesToPush);
		} else {
			sources.nodes = sources.nodes.filter(
				(existingSource) => existingSource.extension.pkgName !== pkgName
			);
		}

		cache.writeQuery({
			query: SourcesDoc,
			variables: { isNsfw: $Meta.nsfw ? null : false },
			data: { sources }
		});
	}

	async function unInstall(pkgName: string) {
		loadingUnInstall = true;
		try {
			await ErrorHelp(
				'failed to Uninstall extension',
				updateExtension({
					variables: { pkgName, uninstall: true },
					update: (cache, data) => {
						UpdateExtensionUpdater(cache, data, pkgName);
					}
				}),
				toastStore
			);
		} finally {
			loadingUnInstall = false;
		}
	}

	async function Install(pkgName: string) {
		loadingInstall = true;
		try {
			await ErrorHelp(
				'Failed to Install extension',
				updateExtension({
					variables: { pkgName, install: true },
					update: (cache, data) => {
						UpdateExtensionUpdater(cache, data, pkgName);
					}
				}),
				toastStore
			);
		} finally {
			loadingInstall = false;
		}
	}

	async function Update(pkgName: string) {
		loadingUpdate = true;
		try {
			await ErrorHelp(
				'Failed to Update extension',
				updateExtension({
					variables: { pkgName, update: true },
					update: (cache, data) => {
						UpdateExtensionUpdater(cache, data, pkgName);
					}
				}),
				toastStore
			);
		} finally {
			loadingUpdate = false;
		}
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
						{#if loadingUnInstall}
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
							{#if loadingUnInstall}
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
