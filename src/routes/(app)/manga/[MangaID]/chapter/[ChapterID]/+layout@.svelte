<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import IconButton from '$lib/components/IconButton.svelte';
	import { getDrawerStore, AppShell } from '@skeletonlabs/skeleton';
	import type { LayoutData } from './$types';
	import { makeToggleDrawer, readerState } from './chapterStores.svelte';

	interface Props {
		data: LayoutData;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();

	const drawerStore = getDrawerStore();
	$effect(() => {
		readerState.MangaID = data.MangaID;
		readerState.ChapterID = data.ChapterID;
	});
	const draw = makeToggleDrawer(drawerStore);
</script>

<AppShell>
	<IconButton
		tabindex={-1}
		onclick={draw}
		name="mdi:menu"
		class="fixed left-4 top-4 z-50 transition-opacity {!$drawerStore.open &&
			'opacity-20'}"
		height="h-16"
	/>
	{@render children?.()}
</AppShell>
