<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script>
	import { page } from '$app/state';
	import { AppRail, AppRailAnchor } from '@skeletonlabs/skeleton';
	import IconWrapper from './IconWrapper.svelte';
	import Tooltip from './Tooltip.svelte';
	import { AppNavData } from '../AppNavData';
</script>

<AppRail width="w-14">
	{#each AppNavData as Loc}
		<AppRailAnchor href={Loc.href} selected={Loc.match(page.url.pathname)}>
			<Tooltip
				tip={Loc.title}
				placement="right"
				tipclass="z-20"
				class="flex w-full items-center justify-center"
			>
				<IconWrapper name={Loc.icon} class="aspect-square h-full w-4/6" />
			</Tooltip>
		</AppRailAnchor>
	{/each}
</AppRail>
