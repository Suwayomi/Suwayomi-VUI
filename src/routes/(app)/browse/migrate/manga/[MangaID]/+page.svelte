<script lang="ts">
	import { getManga } from '$lib/generated';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import type { PageData } from './$types';
	import GlobalSearch from '../../../globalSearch.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import MigrateModal from './migrateModal.svelte';
	export let data: PageData;

	const modalStore = getModalStore();

	const query = queryParam('q', ssp.string());

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
