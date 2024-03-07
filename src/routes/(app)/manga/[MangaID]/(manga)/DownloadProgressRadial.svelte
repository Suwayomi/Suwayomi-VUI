<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import type { downloadsOnChapters } from '$lib/gql/Subscriptions';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import type { ResultOf } from '$lib/gql/graphql';

	export let download:
		| ResultOf<typeof downloadsOnChapters>['downloadChanged']['queue'][0]
		| undefined;
</script>

{#if download}
	{#if download.state === 'DOWNLOADING'}
		<ProgressRadial
			width="w-auto"
			class="flex aspect-square h-full items-center"
			value={Math.round(download.progress * 100)}
			font={150}
		>
			{Math.round(download.progress * 100)}%
		</ProgressRadial>
	{:else}
		<div class="capitalize">{download.state.toLocaleLowerCase()}</div>
	{/if}
{/if}
