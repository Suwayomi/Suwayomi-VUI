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
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { Meta } from '$lib/simpleStores';

	export let scrollingElement: HTMLDivElement;
	export let ext: ExtensionsQuery['extensions']['nodes'][0];

	let loadingUpdate = false;
	let loadingInstall = false;
	let loadingUnInstall = false;

	function UpdateExtensionUpdater(
		cache: ApolloCache<unknown>,
		{ data }: Omit<FetchResult<UpdateExtensionMutation>, 'context'>
	): void {
		if (!data) return;

		// update the extentions list
		try {
			const extensionsData = structuredClone(
				cache.readQuery<ExtensionsQuery>({
					query: ExtensionsDoc,
					variables: { isNsfw: $Meta.nsfw ? null : false }
				})
			);
			if (!extensionsData) throw new Error('failed to read extensions');
			const { extensions } = extensionsData;

			if (data.updateExtension.extension)
				extensions.nodes[
					extensions.nodes.findIndex(
						(extension) => extension.pkgName === ext.pkgName && extension.repo === ext.repo
					)
				] = data.updateExtension.extension;

			cache.writeQuery({
				query: ExtensionsDoc,
				data: { extensions },
				variables: { isNsfw: $Meta.nsfw ? null : false }
			});
		} catch {}

		// update the sources list
		try {
			const sourcesData = structuredClone(
				cache.readQuery<SourcesQuery>({
					query: SourcesDoc,
					variables: { isNsfw: $Meta.nsfw ? null : false }
				})
			);
			if (!sourcesData) throw new Error('failed to read sources');
			const { sources } = sourcesData;

			if (data.updateExtension.extension?.isInstalled) {
				data.updateExtension.extension.source.nodes.forEach((source) => {
					if (!sources.nodes.find((existingSource) => existingSource.id === source.id)) {
						sources.nodes.push(source);
					}
				});
			} else {
				sources.nodes = sources.nodes.filter(
					(existingSource) =>
						existingSource.extension.repo !== ext.repo ||
						existingSource.extension.pkgName !== ext.pkgName
				);
			}

			cache.writeQuery({
				query: SourcesDoc,
				variables: { isNsfw: $Meta.nsfw ? null : false },
				data: { sources }
			});
		} catch {}
	}

	async function unInstall() {
		loadingUnInstall = true;
		try {
			await ErrorHelp(
				'failed to Uninstall extension',
				updateExtension({
					variables: { pkgName: ext.pkgName, uninstall: true },
					update: UpdateExtensionUpdater
				})
			);
		} finally {
			loadingUnInstall = false;
		}
	}

	async function Install() {
		loadingInstall = true;
		try {
			await ErrorHelp(
				'Failed to Install extension',
				updateExtension({
					variables: { pkgName: ext.pkgName, install: true },
					update: UpdateExtensionUpdater
				})
			);
		} finally {
			loadingInstall = false;
		}
	}

	async function Update() {
		loadingUpdate = true;
		try {
			await ErrorHelp(
				'Failed to Update extension',
				updateExtension({
					variables: { pkgName: ext.pkgName, update: true },
					update: UpdateExtensionUpdater
				})
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
				<div class="opacity-70 text-sm line-clamp-1 break-all">
					{ext.repo}
				</div>
			</div>
			<div class="flex flex-wrap flex-1 justify-end">
				{#if ext.isObsolete}
					<button on:click={() => unInstall()} class="btn variant-ghost-error m-1">
						{#if loadingUnInstall}
							Uninstalling<ProgressRadial class="ml-1 h-4 aspect-square w-auto" />
						{:else}
							Obsolete
						{/if}
					</button>
				{:else if ext.isInstalled}
					{#if ext.hasUpdate}
						<button on:click={() => Update()} class="btn variant-ghost-surface m-1">
							{#if loadingUpdate}
								Updating<ProgressRadial class="ml-1 h-4 aspect-square w-auto" />
							{:else}
								Update
							{/if}
						</button>
					{/if}
					<button on:click={() => unInstall()} class="btn variant-ghost-surface m-1">
						{#if loadingUnInstall}
							Uninstalling<ProgressRadial class="ml-1 h-4 aspect-square w-auto" />
						{:else}
							Uninstall
						{/if}
					</button>
				{:else}
					<button on:click={() => Install()} class="btn variant-ghost-surface m-1">
						{#if loadingInstall}
							Installing<ProgressRadial class="ml-1 h-4 aspect-square w-auto" />
						{:else}
							Install
						{/if}
					</button>
				{/if}
			</div>
		</div>
	{/if}
</IntersectionObserver>
