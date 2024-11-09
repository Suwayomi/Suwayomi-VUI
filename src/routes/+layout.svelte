<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { title as titleStore } from '$lib/MountTitleAction';
	import Toast from '$lib/components/Toast/Toast.svelte';
	import { gmState, toastStore } from '$lib/simpleStores.svelte';
	import '../app.postcss';
	// Floating UI for Popups
	import { getToastStore } from '$lib/components/Toast/stores';
	import { client } from '$lib/gql/graphqlClient';
	import {
		arrow,
		autoUpdate,
		computePosition,
		flip,
		offset,
		shift
	} from '@floating-ui/dom';
	import {
		Drawer,
		Modal,
		getDrawerStore,
		getModalStore,
		initializeStores,
		storePopup
	} from '@skeletonlabs/skeleton';
	import { setContextClient } from '@urql/svelte';
	import { onMount } from 'svelte';
	import ChapterDrawer from './(app)/manga/[MangaID]/chapter/[ChapterID]/chapterDrawer.svelte';
	import QuickSearchModal from './QuickSearchModal.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
	setContextClient(client);

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	initializeStores();

	$effect(themeFunc);
	function themeFunc() {
		document.body.dataset.theme = gmState.theme;
		if (gmState.dark && !document.documentElement.classList.contains('dark')) {
			document.documentElement.classList.add('dark');
			return;
		}
		if (!gmState.dark && document.documentElement.classList.contains('dark')) {
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
					backdropClasses: '!p-0',
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

	$toastStore = getToastStore();
</script>

<svelte:head>
	<title>
		{$titleStore}
	</title>
</svelte:head>
<Drawer>
	{#if $drawerStore.id === 'ChapterMenu'}
		<ChapterDrawer />
	{:else}
		(fallback contents)
	{/if}
</Drawer>
<Toast />
<Modal />
{@render children?.()}
