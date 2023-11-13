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
		getModalStore,
		initializeStores,
		storePopup
	} from '@skeletonlabs/skeleton';
	import ChapterDrawer from './(app)/manga/[MangaID]/chapter/[ChapterID]/chapterDrawer.svelte';
	import { onMount } from 'svelte';
	import QuickSearchModal from '$lib/components/QuickSearchModal.svelte';

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
	const drawerStore = getDrawerStore();
	const modalStore = getModalStore();

	function openQuickSearch(e: KeyboardEvent) {
		if (e.code === 'KeyP' && e.ctrlKey) {
			e.preventDefault();
			if (!$modalStore.find((e) => e.meta?.id === 'QuickSearchModal'))
				modalStore.trigger({
					type: 'component',
					component: { ref: QuickSearchModal },
					position: 'items-start',
					meta: { id: 'QuickSearchModal' }
				});
		}
	}

	onMount(() => {
		window.addEventListener('keydown', openQuickSearch);
	});
</script>

<svelte:head>
	<title>
		{$titleStore}
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
