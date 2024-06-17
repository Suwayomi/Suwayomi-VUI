<!--
 Copyright (c) 2024 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->
<script lang="ts">
	import { setSettings } from '$lib/util';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import ModalTemplate from '$lib/components/ModalTemplate.svelte';

	export let repos: string[];

	const modalStore = getModalStore();
	let newrepo = '';
</script>

{#if $modalStore[0]}
	<ModalTemplate title="Extension Repos">
		<svelte:fragment>
			<div class="space-y-2 py-4">
				<div class="flex flex-nowrap items-center justify-between space-x-1">
					<input
						type="text"
						placeholder="https://github.com/user/repo"
						class="input w-full"
						bind:value={newrepo}
					/>
					<button
						on:click={() => {
							repos = [...repos, newrepo];
							newrepo = '';
							setSettings({ extensionRepos: repos });
						}}
						class="variant-filled-primary btn h-full">add</button
					>
				</div>
				<div class="w-full space-y-1">
					{#each repos as value}
						<div
							class="flex flex-nowrap items-center justify-between space-x-1"
						>
							<div>
								{value}
							</div>
							<button
								on:click={() => {
									repos = repos.filter((x) => x !== value);
									setSettings({ extensionRepos: repos });
								}}
								class="variant-filled-error btn">remove</button
							>
						</div>
					{/each}
				</div>
			</div>
		</svelte:fragment>
	</ModalTemplate>
{/if}
