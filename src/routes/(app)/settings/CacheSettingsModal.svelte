<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->
<script lang="ts">
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	import { clearCachedImages } from '$lib/generated';
	import { getModalStore } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

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
</script>

{#if $modalStore[0]}
	<div class="card p-0 w-modal shadow-xl space-y-4 rounded-lg max-h-screen">
		<h1 class="h3 pt-4 pl-4">Backups</h1>
		<div class="border-y border-surface-700">
			<div class="max-h-96 overflow-y-auto grid grid-cols-1 gap-1">
				<div class="w-full mt-1">
					<button
						class="flex h-[76px] text-left w-full hover:variant-glass-surface py-2"
						on:click={clearCache}
					>
						<IconWrapper class="h-full w-auto p-2" name="mdi:delete" />
						<div>
							<div class="text-xl">Clear Local Cache</div>
							<div class="opacity-80">
								<span class="flex-none">Clears the local on device cache</span>
							</div>
						</div>
					</button>
					<button
						class="flex h-[76px] text-left w-full hover:variant-glass-surface py-2"
						on:click={() => clearCachedImages({})}
					>
						<IconWrapper class="h-full w-auto p-2" name="mdi:file-document-remove" />

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
