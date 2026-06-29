<!--
 Copyright (c) 2024 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->
<script lang="ts">
	import { queryState } from '$lib/util.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import ModalTemplate from '$lib/components/ModalTemplate.svelte';
	import { extensionStores } from '$lib/gql/Queries';
	import { getContextClient } from '@urql/svelte';
	import { addExtensionStore, removeExtensionStore } from '$lib/gql/Mutations';
	const client = getContextClient();
	let Stores = queryState({
		client,
		query: extensionStores
	});

	const modalStore = getModalStore();
	let newrepo = $state('');
</script>

{#if $modalStore[0]}
	<ModalTemplate titleText="Extension Repos">
		{#snippet children()}
			<div class="space-y-2 py-4">
				<div class="flex flex-nowrap items-center justify-between space-x-1">
					<input
						type="text"
						placeholder="https://github.com/user/repo"
						class="input w-full"
						bind:value={newrepo}
					/>
					<button
						onclick={async () => {
							await client
								.mutation(addExtensionStore, { indexUrl: newrepo })
								.toPromise();

							newrepo = '';
						}}
						class="variant-filled-primary btn h-full">add</button
					>
				</div>
				<div class="w-full space-y-1">
					{#each Stores.data?.extensionStores as value}
						<div
							class="flex flex-nowrap items-center justify-between space-x-1"
						>
							<div>
								{value.name}
							</div>
							<button
								onclick={async () => {
									await client
										.mutation(removeExtensionStore, {
											indexUrl: value.indexUrl
										})
										.toPromise();
								}}
								class="variant-filled-error btn">remove</button
							>
						</div>
					{/each}
				</div>
			</div>
		{/snippet}
	</ModalTemplate>
{/if}
