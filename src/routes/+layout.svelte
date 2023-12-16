<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import MainAppRail from '$lib/components/MainAppRail.svelte';
	import Toast from '$lib/components/Toast/Toast.svelte';
	import { Meta, title as titleStore, toastStore } from '$lib/simpleStores';
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
	import QuickSearchModal from './QuickSearchModal.svelte';
	import { getToastStore } from '$lib/components/Toast/stores';

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
		if ((e.code === 'Slash' || e.code === 'KeyP') && e.ctrlKey) {
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
		detectSWUpdate();
	});

	async function detectSWUpdate() {
		const registration = await navigator.serviceWorker.ready;
		registration.addEventListener('updatefound', () => {
			const newSW = registration.installing;
			newSW?.addEventListener('statechange', () => {
				if (newSW.state === 'installed') {
					if (confirm('New version available. Load new version?')) {
						newSW.postMessage({ type: 'SKIP_WAITING' });
						window.location.reload();
					}
				}
			});
		});

		navigator.serviceWorker.addEventListener('message', (event) => {
			if (event.data && event.data.type === 'auth401') {
				const iframe = window.document.createElement('iframe');
				iframe.src = '/api/v1';
				document.body.appendChild(iframe);
				iframe.addEventListener('load', () => {
					window.location.reload();
				});
			}
		});
	}

	const toastStor = getToastStore();
	$toastStore = toastStor;
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
