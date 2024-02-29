<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { langFilter, lastFetched } from './ExtensionsStores';
	import Search from '$lib/components/Search.svelte';
	import LangFilterButton from '$lib/components/LangFilterButton.svelte';
	import { ErrorHelp } from '$lib/util';
	import TooltipIconButton from '$lib/components/TooltipIconButton.svelte';
	import { FileButton } from '@skeletonlabs/skeleton';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	import { getContextClient } from '@urql/svelte';
	import {
		fetchExtensions,
		installExternalExtension
	} from '$lib/gql/Mutations';
	export let langs: Set<string>;
	let loading = false;

	const client = getContextClient();
	async function handelRefresh() {
		loading = true;
		await ErrorHelp(
			'failed to fetch new extensions',
			client.mutation(fetchExtensions, {}).toPromise()
		);
		$lastFetched = new Date();
		loading = false;
	}

	let files: FileList | undefined;
	function onChangeHandler(): void {
		ErrorHelp(
			'failed to install external extension',
			client
				.mutation(installExternalExtension, { extensionFile: files?.[0] })
				.toPromise()
		);
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
	<Tooltip
		tipclass="z-20"
		placement="top"
		tip="install external extension"
		class=" cursor-pointer h-full"
	>
		<FileButton
			class="h-full aspect-square hover:variant-glass-surface"
			button=""
			name="files2"
			accept=".apk"
			on:change={onChangeHandler}
			bind:files
		>
			<IconWrapper
				name="mdi:plus"
				width="100%"
				height="100%"
				class="text-5xl  m-0 p-2"
			/>
		</FileButton>
	</Tooltip>
	<LangFilterButton {langFilter} {langs} />
</div>
