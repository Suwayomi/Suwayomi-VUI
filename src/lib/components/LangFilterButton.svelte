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

	interface Props {
		langs: Set<string>;
		langFilter: Writable<Set<string>>;
	}

	let { langs, langFilter }: Props = $props();
	const modalStore = getModalStore();
</script>

<TooltipIconButton
	onclick={() => {
		modalStore.trigger({
			type: 'component',
			backdropClasses: '!p-0',
			component: { ref: LangFilterModal, props: { langs, langFilter } }
		});
	}}
	tipclass="z-20"
	tip="Language Filters"
	name="mdi:translate"
	offset={{ crossAxis: -57 }}
/>
