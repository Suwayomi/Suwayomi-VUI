<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { onDestroy, untrack } from 'svelte';
	import type { LayoutData } from './$types';
	import CheckBoxPreference from './preferences/CheckBoxPreference.svelte';
	import ListPreference from './preferences/ListPreference.svelte';
	import SwitchPreference from './preferences/SwitchPreference.svelte';
	import MultiSelectListPreference from './preferences/MultiSelectListPreference.svelte';
	import EditTextPreference from './preferences/EditTextPreference.svelte';
	import { getContextClient } from '@urql/svelte';
	import { getSource } from '$lib/gql/Queries';
	import ModalTemplate from '$lib/components/ModalTemplate.svelte';
	import { queryState } from '$lib/util.svelte';

	interface Props {
		data: LayoutData;
		clearAll: () => void;
	}

	let { data, clearAll }: Props = $props();

	const modalStore = getModalStore();
	const client = getContextClient();
	onDestroy(clearAll);

	let sauce = $derived.by(() => {
		const _ = [data.sourceID];
		return untrack(
			() =>
				queryState({
					client: getContextClient(),
					query: getSource,
					variables: {
						id: data.sourceID
					}
				}).value.data?.source
		);
	});
</script>

{#if $modalStore[0] && sauce?.isConfigurable}
	<ModalTemplate titleText="Preferences">
		{#each sauce.preferences as pref, index}
			<div>
				{#if pref.__typename === 'CheckBoxPreference'}
					<CheckBoxPreference {pref} {index} id={data.sourceID} />
				{:else if pref.__typename === 'ListPreference'}
					<ListPreference {pref} {index} id={data.sourceID} />
				{:else if pref.__typename === 'SwitchPreference'}
					<SwitchPreference {pref} {index} id={data.sourceID} />
				{:else if pref.__typename === 'MultiSelectListPreference'}
					<MultiSelectListPreference {pref} {index} id={data.sourceID} />
				{:else if pref.__typename === 'EditTextPreference'}
					<EditTextPreference {pref} {index} id={data.sourceID} />
				{/if}
			</div>
		{/each}
	</ModalTemplate>
{/if}
