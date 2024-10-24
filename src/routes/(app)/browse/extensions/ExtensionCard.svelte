<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import IntersectionObserver from '$lib/components/IntersectionObserver.svelte';
	import Image from '$lib/components/Image.svelte';
	import { ErrorHelp } from '$lib/util';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { getContextClient } from '@urql/svelte';
	import { updateExtension } from '$lib/gql/Mutations';
	import type { ExtensionTypeFragment } from '$lib/gql/Fragments';
	import type { ResultOf } from '$lib/gql/graphql';

	interface Props {
		ext: ResultOf<typeof ExtensionTypeFragment>;
	}

	let { ext }: Props = $props();

	let loadingUpdate = $state(false);
	let loadingInstall = $state(false);
	let loadingUnInstall = $state(false);
	const client = getContextClient();

	async function unInstall() {
		loadingUnInstall = true;
		try {
			await ErrorHelp(
				'failed to Uninstall extension',
				client
					.mutation(updateExtension, { pkgName: ext.pkgName, uninstall: true })
					.toPromise()
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
				client
					.mutation(updateExtension, { pkgName: ext.pkgName, install: true })
					.toPromise()
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
				client
					.mutation(updateExtension, { pkgName: ext.pkgName, update: true })
					.toPromise()
			);
		} finally {
			loadingUpdate = false;
		}
	}
</script>

<IntersectionObserver top={400} bottom={400} class="m-1 h-28">
	{#snippet children({ intersecting })}
		{#if intersecting}
			<div class="card variant-ghost flex h-full w-full items-center">
				<div class="h-full flex-shrink-0 p-1">
					<Image
						height="h-full"
						width="w-auto"
						aspect="aspect-square"
						src={ext.iconUrl}
					/>
				</div>
				<div>
					{ext.name}
					<div class="text-sm opacity-70">
						{ext.versionName}
						{#if ext.isNsfw}
							<span class="text-red-600">18+</span>
						{/if}
					</div>
					<div class="line-clamp-1 break-all text-sm opacity-70">
						{ext.repo}
					</div>
				</div>
				<div class="flex flex-1 flex-wrap justify-end">
					{#if ext.isObsolete}
						<button
							onclick={() => unInstall()}
							class="variant-ghost-error btn m-1"
						>
							{#if loadingUnInstall}
								Uninstalling<ProgressRadial
									class="ml-1 aspect-square h-4 w-auto"
								/>
							{:else}
								Obsolete
							{/if}
						</button>
					{:else if ext.isInstalled}
						{#if ext.hasUpdate}
							<button
								onclick={() => Update()}
								class="variant-ghost-surface btn m-1"
							>
								{#if loadingUpdate}
									Updating<ProgressRadial
										class="ml-1 aspect-square h-4 w-auto"
									/>
								{:else}
									Update
								{/if}
							</button>
						{/if}
						<button
							onclick={() => unInstall()}
							class="variant-ghost-surface btn m-1"
						>
							{#if loadingUnInstall}
								Uninstalling<ProgressRadial
									class="ml-1 aspect-square h-4 w-auto"
								/>
							{:else}
								Uninstall
							{/if}
						</button>
					{:else}
						<button
							onclick={() => Install()}
							class="variant-ghost-surface btn m-1"
						>
							{#if loadingInstall}
								Installing<ProgressRadial
									class="ml-1 aspect-square h-4 w-auto"
								/>
							{:else}
								Install
							{/if}
						</button>
					{/if}
				</div>
			</div>
		{/if}
	{/snippet}
</IntersectionObserver>
