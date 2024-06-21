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
	import { AppBar, AppShell } from '@skeletonlabs/skeleton';
</script>

<AppShell slotHeader="">
	<svelte:fragment slot="header">
		<AppBar padding="" slotTrail="h-10 xs:h-14" gap="" slotLead="h-10 xs:h-14">
			<svelte:fragment slot="lead">
				<span
					class="line-clamp-1 px-2 py-2 text-xl/[5rem] sm:px-4 sm:text-4xl/[5rem]"
				>
					{$title}
				</span>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if $action?.props}
					<svelte:component this={$action.component} {...$action.props} />
				{:else if $action?.component}
					<svelte:component this={$action.component} />
				{/if}
			</svelte:fragment>
			<!-- <svelte:fragment slot="headline">(headline)</svelte:fragment> -->
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<MediaQuery query="(max-width: {screens.md})" let:matches>
			{#if !matches}
				<MainAppRail />
			{/if}
		</MediaQuery>
	</svelte:fragment>
	<slot />
	<svelte:fragment slot="footer">
		<MediaQuery query="(max-width: {screens.md})" let:matches>
			{#if matches}
				<MobileAppNavigation />
			{/if}
		</MediaQuery>
	</svelte:fragment>
</AppShell>
