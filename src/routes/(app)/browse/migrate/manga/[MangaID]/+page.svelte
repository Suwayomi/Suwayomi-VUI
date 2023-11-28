<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { getManga } from '$lib/generated';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import type { PageData } from './$types';
	import GlobalSearch from '../../../globalSearch.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import MigrateModal from './migrateModal.svelte';
	export let data: PageData;

	const modalStore = getModalStore();

	const query = queryParam('q', ssp.string(), { pushHistory: false });

	const manga = getManga({ variables: { id: data.MangaID } });

	$: $query = $manga.data.manga?.title || null;

	function OpenModal(id: number) {
		modalStore.trigger({
			type: 'component',
			component: {
				ref: MigrateModal,
				props: {
					id,
					manga: $manga.data.manga
				}
			}
		});
	}
</script>

{#if $manga.data.manga?.title}
	<GlobalSearch title={$manga.data.manga.title} {OpenModal} />
{/if}
