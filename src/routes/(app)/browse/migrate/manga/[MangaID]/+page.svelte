<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { queryParam, ssp } from 'sveltekit-search-params';
	import type { PageData } from './$types';
	import GlobalSearch from '../../../globalSearch.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import MigrateModal from './migrateModal.svelte';
	import { getContextClient, queryStore } from '@urql/svelte';
	import { getManga } from '$lib/gql/Queries';

	export let data: PageData;

	const modalStore = getModalStore();

	const query = queryParam('q', ssp.string(), { pushHistory: false });
	const client = getContextClient();
	const manga = queryStore({
		client,
		query: getManga,
		variables: { id: data.MangaID }
	});

	const unSub = manga.subscribe(onSub);

	function onSub(mangaNow: typeof $manga) {
		if (mangaNow?.data?.manga?.title) {
			$query = mangaNow?.data?.manga?.title;
			unSub();
		}
	}

	function OpenModal(id: number) {
		modalStore.trigger({
			type: 'component',
			backdropClasses: '!p-0',
			component: {
				ref: MigrateModal,
				props: {
					id,
					manga: $manga.data?.manga
				}
			}
		});
	}
</script>

{#if $manga.data?.manga?.title}
	<GlobalSearch title={$manga.data?.manga?.title} {OpenModal} />
{/if}
