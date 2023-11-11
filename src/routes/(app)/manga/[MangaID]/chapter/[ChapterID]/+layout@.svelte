<script lang="ts">
	import IconButton from '$lib/components/IconButton.svelte';
	import { AppShell, getDrawerStore } from '@skeletonlabs/skeleton';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	const drawerStore = getDrawerStore();
	function draw() {
		if ($drawerStore.open) drawerStore.close();
		else {
			drawerStore.open({
				id: 'ChapterMenu',
				width: 'w-[280px] md:w-[480px]',
				meta: {
					id: data.MangaID
				}
			});
		}
	}
</script>

<AppShell>
	<IconButton
		on:click={draw}
		name="mdi:menu"
		class="fixed top-4 left-4 z-50 transition-opacity {!$drawerStore.open && 'opacity-20'}"
		height="h-16"
	/>
	<slot />
</AppShell>
