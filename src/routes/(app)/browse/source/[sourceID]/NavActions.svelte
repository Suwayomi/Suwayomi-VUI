<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { page } from '$app/stores';

	export let supportsLatest: boolean = false;
</script>

<div class="flex space-x-1 h-full">
	<a
		href="./popular"
		class="btn rounded-none
  {$page.url.pathname.includes('/popular')
			? 'variant-filled-secondary'
			: 'variant-ghost-secondary'}"
	>
		Popular
	</a>
	{#if supportsLatest}
		<a
			href="./latest"
			class="btn rounded-none
  {$page.url.pathname.includes('/latest') ? 'variant-filled-secondary' : 'variant-ghost-secondary'}"
		>
			Latest
		</a>
	{/if}
	<a
		href="./filter"
		class="btn rounded-none
  {$page.url.pathname.includes('/filter') ? 'variant-filled-secondary' : 'variant-ghost-secondary'}"
	>
		Filter
	</a>
</div>
