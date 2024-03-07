<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->
<script lang="ts">
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	import { clearCachedImages } from '$lib/gql/Mutations';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { getContextClient } from '@urql/svelte';
	const modalStore = getModalStore();

	const client = getContextClient();
	async function clearCache() {
		navigator.serviceWorker.ready.then((registration) => {
			if (!registration.active) {
				return;
			}
			registration.active.postMessage({
				type: 'clearCache'
			});
		});
	}

	async function clearCachedImgs() {
		navigator.serviceWorker.ready.then((registration) => {
			if (!registration.active) {
				return;
			}
			registration.active.postMessage({
				type: 'clearCachedImages'
			});
		});
	}
</script>

{#if $modalStore[0]}
	<div class="card w-modal max-h-screen space-y-4 rounded-lg p-0 shadow-xl">
		<h1 class="h3 pl-4 pt-4">Backups</h1>
		<div class="border-y border-surface-700">
			<div class="grid max-h-96 grid-cols-1 gap-1 overflow-y-auto">
				<div class="mt-1 w-full">
					<button
						class="flex h-[76px] w-full py-2 text-left hover:variant-glass-surface"
						on:click={clearCache}
					>
						<IconWrapper class="h-full w-auto p-2" name="mdi:delete" />
						<div>
							<div class="text-xl">Clear Local Cache</div>
							<div class="opacity-80">
								<span class="flex-none">
									Clears the local on device cache (all data including images)
								</span>
							</div>
						</div>
					</button>
					<button
						class="flex h-[76px] w-full py-2 text-left hover:variant-glass-surface"
						on:click={clearCachedImgs}
					>
						<IconWrapper
							class="h-full w-auto p-2"
							name="mdi:file-image-remove-outline"
						/>
						<div>
							<div class="text-xl">Clear Local Image Cache</div>
							<div class="opacity-80">
								<span class="flex-none">
									Clears the local on device image cache (just images not any
									other data)
								</span>
							</div>
						</div>
					</button>
					<button
						class="flex h-[76px] w-full py-2 text-left hover:variant-glass-surface"
						on:click={() => client.mutation(clearCachedImages, {}).toPromise()}
					>
						<IconWrapper
							class="h-full w-auto p-2"
							name="mdi:file-document-remove"
						/>

						<div>
							<div class="text-xl">Clear Server Cache</div>
							<div class="opacity-80">
								<span class="flex-none">Clears the Server image cache</span>
							</div>
						</div>
					</button>
				</div>
			</div>
		</div>
		<div class="p-4" />
	</div>
{/if}
