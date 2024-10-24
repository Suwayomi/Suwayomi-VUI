<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script>
	import { page } from '$app/stores';
	import { TabGroup, TabAnchor } from '@skeletonlabs/skeleton';
	import IconWrapper from './IconWrapper.svelte';
	import { AppNavData, SmallAppNavData } from '../AppNavData';
	import { screens } from '$lib/screens';
	import MediaQuery from './MediaQuery.svelte';
</script>

<TabGroup
	justify="justify-center"
	active="variant-filled-primary"
	hover="hover:variant-soft-primary"
	flex="flex-1 lg:flex-none"
	rounded=""
	border=""
	class="bg-surface-100-800-token w-full"
	regionList=" h-16"
>
	<MediaQuery query="(max-width: {screens.sm})">
		{#snippet children({ matches })}
			{@const Nav = matches ? SmallAppNavData : AppNavData}
			{#each Nav as Loc}
				<TabAnchor
					href={Loc.href}
					selected={Loc.match($page.url.pathname)}
					class="h-full [&>.tab-interface]:h-full [&>div>.tab-label]:h-full"
				>
					<div class="flex h-full w-full flex-col items-center">
						<IconWrapper
							name={Loc.icon}
							class="aspect-square max-h-full w-full grow"
						/>
						<span class="text-sm">{Loc.title}</span>
					</div>
				</TabAnchor>
			{/each}
		{/snippet}
	</MediaQuery>
</TabGroup>
