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
	import ModalTemplate from '$lib/components/ModalTemplate.svelte';

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
	<ModalTemplate titleText="Cache Settings">
		<div class="mt-1 w-full">
			<button
				class="flex h-[76px] w-full py-2 text-left hover:variant-glass-surface"
				onclick={clearCache}
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
				onclick={clearCachedImgs}
			>
				<IconWrapper
					class="h-full w-auto p-2"
					name="mdi:file-image-remove-outline"
				/>
				<div>
					<div class="text-xl">Clear Local Image Cache</div>
					<div class="opacity-80">
						<span class="flex-none">
							Clears the local on device image cache (just images not any other
							data)
						</span>
					</div>
				</div>
			</button>
			<button
				class="flex h-[76px] w-full py-2 text-left hover:variant-glass-surface"
				onclick={() => client.mutation(clearCachedImages, {}).toPromise()}
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
	</ModalTemplate>
{/if}
