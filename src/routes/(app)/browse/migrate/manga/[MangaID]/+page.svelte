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
	import { getContextClient } from '@urql/svelte';
	import { getManga } from '$lib/gql/Queries';
	import { queryState } from '$lib/util.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const modalStore = getModalStore();

	const query = queryParam('q', ssp.string(), { pushHistory: false });
	const client = getContextClient();
	const manga = queryState({
		client,
		query: getManga,
		variables: { id: data.MangaID }
	});

	let unSub = false;
	$effect(() => {
		if (!unSub) onSub(manga.value);
	});

	function onSub(mangaNow: typeof manga.value) {
		if (mangaNow?.data?.manga?.title) {
			$query = mangaNow?.data?.manga?.title;
			unSub = true;
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
					manga: manga.value.data?.manga
				}
			}
		});
	}
</script>

{#if manga.value.data?.manga?.title}
	<GlobalSearch title={manga.value.data?.manga?.title} {OpenModal} />
{/if}
