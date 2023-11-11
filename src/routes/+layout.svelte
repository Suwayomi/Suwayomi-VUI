<script lang="ts">
	import MainAppRail from '$lib/components/MainAppRail.svelte';
	import Toast from '$lib/components/Toast/Toast.svelte';
	import { Meta, title as titleStore } from '$lib/simpleStores';
	import '../app.postcss';
	// Floating UI for Popups
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import {
		Drawer,
		Modal,
		getDrawerStore,
		initializeStores,
		storePopup
	} from '@skeletonlabs/skeleton';
	import ChapterDrawer from './(app)/manga/[MangaID]/chapter/[ChapterID]/chapterDrawer.svelte';

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	initializeStores();

	$: $Meta, themeFunc();
	function themeFunc() {
		document.body.dataset.theme = $Meta.theme;
		if ($Meta.dark && !document.documentElement.classList.contains('dark')) {
			document.documentElement.classList.add('dark');
		} else if (!$Meta.dark && document.documentElement.classList.contains('dark')) {
			document.documentElement.classList.remove('dark');
		}
	}

	$: title = $titleStore;
	const drawerStore = getDrawerStore();
</script>

<svelte:head>
	<title>
		{title}
	</title>
</svelte:head>
<Drawer>
	{#if $drawerStore.id === 'MainMenu'}
		<MainAppRail />
	{:else if $drawerStore.id === 'ChapterMenu'}
		<ChapterDrawer />
	{:else}
		(fallback contents)
	{/if}
</Drawer>
<Toast />
<Modal />
<slot />
