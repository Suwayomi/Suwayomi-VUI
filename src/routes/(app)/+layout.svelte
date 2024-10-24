<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->
<script lang="ts">
	import { action, title } from '$lib/MountTitleAction';
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

<div class="grid w-full grid-cols-[auto_1fr]">
	<header class="sticky top-0 z-50 col-span-full">
		<AppBar padding="" slotTrail="h-10 xs:h-14" gap="" slotLead="h-10 xs:h-14">
			{#snippet lead()}
				<span
					class="line-clamp-1 px-2 py-2 text-xl/[5rem] sm:px-4 sm:text-4xl/[5rem]"
				>
					{$title}
				</span>
			{/snippet}
			{#snippet trail()}
				{#if $action?.props}
					{@const SvelteComponent = $action.component}
					<SvelteComponent {...$action.props} />
				{:else if $action?.component}
					{@const SvelteComponent_1 = $action.component}
					<SvelteComponent_1 />
				{/if}
			{/snippet}
		</AppBar>
	</header>
	<MediaQuery query="(max-width: {screens.md})">
		{#snippet children({ matches })}
			{#if !matches}
				<aside
					class="sticky top-14 z-50 col-span-1 row-start-2 block h-[calc(100vh-3.5rem)]"
				>
					<MainAppRail />
				</aside>
			{/if}
		{/snippet}
	</MediaQuery>
	<main class="row-start-2 block h-full min-h-[calc(100dvh-3.5rem)]">
		{@render children?.()}
	</main>
	<footer class="sticky bottom-0 z-50 col-span-full row-start-3">
		<MediaQuery query="(max-width: {screens.md})">
			{#snippet children({ matches })}
				{#if matches}
					<MobileAppNavigation />
				{/if}
			{/snippet}
		</MediaQuery>
	</footer>
</div>
