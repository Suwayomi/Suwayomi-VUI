<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { AppBarData } from '$lib/MountTitleAction';
	import { getabout } from '$lib/gql/Queries';
	import { getContextClient, queryStore } from '@urql/svelte';

	let about = queryStore({ client: getContextClient(), query: getabout });
	AppBarData('About');
</script>

{#if $about.fetching}
	{#if window.version}
		<div class="pl-4 py-2">
			<div class="text-xl">client version</div>
			<div class="opacity-80">
				VUI-{window.version}
			</div>
		</div>
	{/if}
	{#each new Array(5) as _}
		<div class="pl-4 py-2">
			<div class="placeholder animate-pulse w-full max-w-xs mb-1 h-7" />
			<div class="placeholder animate-pulse w-full max-w-sm h-6" />
		</div>
	{/each}
{:else if $about.error}
	<div class="white-space-pre-wrap">
		{JSON.stringify($about.error, null, 4)}
	</div>
{:else if $about.data}
	<div class="pt-2">
		<div class="pl-4 py-2">
			<div class="text-xl">Server</div>
			<div class="opacity-80">
				{$about.data.aboutServer.name}
				{$about.data.aboutServer.buildType}
			</div>
		</div>
		{#if window.version}
			<div class="pl-4 py-2">
				<div class="text-xl">client version</div>
				<div class="opacity-80">
					VUI-{window.version}
				</div>
			</div>
		{/if}
		<div class="pl-4 py-2">
			<div class="text-xl">Server version</div>
			<div class="opacity-80">
				{$about.data.aboutServer.version}-{$about.data.aboutServer.revision}
			</div>
		</div>
		<div class="pl-4 py-2">
			<div class="text-xl">Build time</div>
			<div class="opacity-80">
				{new Date(
					parseInt($about.data.aboutServer.buildTime) * 1000
				).toUTCString()}
			</div>
		</div>
		<a
			class="block hover:variant-glass-surface pl-4 py-2"
			href={$about.data.aboutServer.github}
		>
			<div class="text-xl">Github</div>
			<div class="opacity-80">
				{$about.data.aboutServer.github}
			</div>
		</a>
		<a
			class="block hover:variant-glass-surface pl-4 py-2"
			href={$about.data.aboutServer.discord}
		>
			<div class="text-xl">Discord</div>
			<div class="opacity-80">
				{$about.data.aboutServer.discord}
			</div>
		</a>
	</div>
{/if}
