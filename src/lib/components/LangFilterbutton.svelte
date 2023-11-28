<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import type { Writable } from 'svelte/store';
	import TooltipIconButton from './TooltipIconButton.svelte';
	import LangFilterModal from './LangFilterModal.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';

	export let langs: Set<string>;
	export let langfilt: Writable<Set<string>>;
	const modalStore = getModalStore();
</script>

<TooltipIconButton
	on:click={() => {
		modalStore.trigger({
			type: 'component',
			component: { ref: LangFilterModal, props: { langs, langfilt } }
		});
	}}
	tipclass="z-20"
	tip="Language Filters"
	name="mdi:translate"
	offset={{ crossAxis: -57 }}
/>
