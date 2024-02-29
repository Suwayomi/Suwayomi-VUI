<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { AppBarData } from '$lib/MountTitleAction';
	import { getContextClient, queryStore } from '@urql/svelte';
	import type { LayoutData } from './$types';
	import NavActions from './NavActions.svelte';
	import { getSource } from '$lib/gql/Queries';

	export let data: LayoutData;
	const client = getContextClient();
	const sause = queryStore({
		client,
		query: getSource,
		variables: { id: data.sourceID }
	});

	$: AppBarData($sause.data?.source?.displayName ?? '', {
		component: NavActions,
		props: {
			supportsLatest: $sause.data?.source?.supportsLatest
		}
	});
</script>

<slot />
