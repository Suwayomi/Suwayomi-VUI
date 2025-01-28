<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { actionState } from '$lib/MountTitleAction.svelte';
	import { getContextClient } from '@urql/svelte';
	import type { LayoutData } from './$types';
	import NavActions from './NavActions.svelte';
	import { getSource } from '$lib/gql/Queries';
	import { queryState } from '$lib/util.svelte';

	interface Props {
		data: LayoutData;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();
	const client = getContextClient();
	const source = queryState({
		client,
		query: getSource,
		variables: { id: data.sourceID }
	});

	$effect(() => {
		actionState.AppBarData(source.value.data?.source?.displayName ?? '', {
			component: NavActions,
			props: {
				supportsLatest: source.value.data?.source?.supportsLatest
			}
		});
	});
</script>

{@render children?.()}
