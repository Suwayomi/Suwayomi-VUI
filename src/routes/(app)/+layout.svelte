<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->
<script lang="ts">
	import { actionState } from '$lib/MountTitleAction.svelte';
	import AppShell from '$lib/components/AppShell.svelte';
	import MainAppRail from '$lib/components/MainAppRail.svelte';
	import MediaQuery from '$lib/components/MediaQuery.svelte';
	import MobileAppNavigation from '$lib/components/MobileAppNavigation.svelte';
	import { screens } from '$lib/screens';
	import { AppBar } from '@skeletonlabs/skeleton';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<AppShell slotHeader="">
	{#snippet header()}
		<AppBar padding="" slotTrail="h-10 xs:h-14" gap="" slotLead="h-10 xs:h-14">
			{#snippet lead()}
				<span
					class="line-clamp-1 px-2 py-2 text-xl/[5rem] sm:px-4 sm:text-4xl/[5rem]"
				>
					{actionState.title}
				</span>
			{/snippet}
			{#snippet trail()}
				{#if actionState.action?.props}
					{@const SvelteComponent = actionState.action.component}
					<SvelteComponent {...actionState.action.props} />
				{:else if actionState.action?.component}
					{@const SvelteComponent_1 = actionState.action.component}
					<SvelteComponent_1 />
				{/if}
			{/snippet}
		</AppBar>
	{/snippet}
	{#snippet sidebarLeft()}
		<MediaQuery query="(max-width: {screens.md})">
			{#snippet children({ matches })}
				{#if !matches}
					<MainAppRail />
				{/if}
			{/snippet}
		</MediaQuery>
	{/snippet}
	{@render children?.()}
	{#snippet footer()}
		<MediaQuery query="(max-width: {screens.md})">
			{#snippet children({ matches })}
				{#if matches}
					<MobileAppNavigation />
				{/if}
			{/snippet}
		</MediaQuery>
	{/snippet}
</AppShell>
