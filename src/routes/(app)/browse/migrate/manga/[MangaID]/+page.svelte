<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import type { PageData } from './$types';
	import GlobalSearch from '../../../globalSearch.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import MigrateModal from './migrateModal.svelte';
	import { getContextClient } from '@urql/svelte';
	import { getManga } from '$lib/gql/Queries';
	import { queryState } from '$lib/util.svelte';
	import { mmState } from '$lib/simpleStores.svelte';
	import { untrack } from 'svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	mmState.id = data.MangaID;

	const client = getContextClient();
	const manga = queryState({
		client,
		query: getManga,
		variables: { id: data.MangaID }
	});

	const modalStore = getModalStore();

	function OpenModal(id: number) {
		modalStore.trigger({
			type: 'component',
			backdropClasses: '!p-0',
			component: {
				ref: MigrateModal,
				props: {
					id,
					manga: manga.data?.manga
				}
			}
		});
	}

	function getTitle() {
		return untrack(() => {
			if (manga.data?.manga?.title) {
				return manga.data.manga.title;
			}
		});
	}
</script>

{#if manga.data?.manga?.title}
	<GlobalSearch title={getTitle()} {OpenModal} />
{/if}
