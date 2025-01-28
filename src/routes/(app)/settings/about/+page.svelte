<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { actionState } from '$lib/MountTitleAction.svelte';
	import { getabout } from '$lib/gql/Queries';
	import { queryState } from '$lib/util.svelte';
	import { getContextClient } from '@urql/svelte';

	let about = queryState({ client: getContextClient(), query: getabout });
	actionState.AppBarData('About');
</script>

{#if about.value.fetching}
	{#if typeof window !== 'undefined' && window.version}
		<div class="py-2 pl-4">
			<div class="text-xl">client version</div>
			<div class="opacity-80">
				VUI-{window.version}
			</div>
		</div>
	{/if}
	{#each new Array(5) as _}
		<div class="py-2 pl-4">
			<div class="placeholder mb-1 h-7 w-full max-w-xs animate-pulse"></div>
			<div class="placeholder h-6 w-full max-w-sm animate-pulse"></div>
		</div>
	{/each}
{:else if about.value.error}
	<div class="white-space-pre-wrap">
		{JSON.stringify(about.value.error, null, 4)}
	</div>
{:else if about.value.data}
	<div class="pt-2">
		<div class="py-2 pl-4">
			<div class="text-xl">Server</div>
			<div class="opacity-80">
				{about.value.data.aboutServer.name}
				{about.value.data.aboutServer.buildType}
			</div>
		</div>
		{#if typeof window !== 'undefined' && window.version}
			<div class="py-2 pl-4">
				<div class="text-xl">client version</div>
				<div class="opacity-80">
					VUI-{window.version}
				</div>
			</div>
		{/if}
		<div class="py-2 pl-4">
			<div class="text-xl">Server version</div>
			<div class="opacity-80">
				{about.value.data.aboutServer.version}-{about.value.data.aboutServer
					.revision}
			</div>
		</div>
		<div class="py-2 pl-4">
			<div class="text-xl">Build time</div>
			<div class="opacity-80">
				{new Date(
					parseInt(about.value.data.aboutServer.buildTime) * 1000
				).toUTCString()}
			</div>
		</div>
		<a
			class="block py-2 pl-4 hover:variant-glass-surface"
			href={about.value.data.aboutServer.github}
		>
			<div class="text-xl">Github</div>
			<div class="opacity-80">
				{about.value.data.aboutServer.github}
			</div>
		</a>
		<a
			class="block py-2 pl-4 hover:variant-glass-surface"
			href={about.value.data.aboutServer.discord}
		>
			<div class="text-xl">Discord</div>
			<div class="opacity-80">
				{about.value.data.aboutServer.discord}
			</div>
		</a>
	</div>
{/if}
