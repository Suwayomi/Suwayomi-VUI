<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { fetchExtensionsUpdater, langFilter, lastFetched } from './ExtensionsStores';
	import Search from '$lib/components/Search.svelte';
	import LangFilterButton from '$lib/components/LangFilterButton.svelte';
	import { fetchExtensions } from '$lib/generated';
	import { ErrorHelp } from '$lib/util';
	import TooltipIconButton from '$lib/components/TooltipIconButton.svelte';
	export let langs: Set<string>;
	let loading = false;
	async function handelRefresh() {
		loading = true;
		await ErrorHelp(
			'failed to fetch new extensions',
			fetchExtensions({
				update: fetchExtensionsUpdater
			})
		);
		$lastFetched = new Date();
		loading = false;
	}
</script>

<div class="h-full flex">
	<Search />
	<TooltipIconButton
		on:click={handelRefresh}
		tipclass="z-20"
		tip="refresh extensions list"
		name="mdi:refresh"
		hover={loading ? '' : 'hover:variant-glass-surface'}
		class={loading && 'animate-spin'}
	/>
	<LangFilterButton {langFilter} {langs} />
</div>
