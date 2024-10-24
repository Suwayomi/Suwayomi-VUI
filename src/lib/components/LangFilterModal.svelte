<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { FindLangName } from '../../routes/(app)/browse/languages';
	import Slide from '$lib/components/Slide.svelte';
	import ModalTemplate from '$lib/components/ModalTemplate.svelte';

	const modalStore = getModalStore();
	interface Props {
		langs: Set<string>;
		langFilter: Writable<Set<string>>;
	}

	let { langs, langFilter }: Props = $props();
</script>

{#if $modalStore[0]}
	<ModalTemplate titleText="Allowed Languages">
		{#snippet children()}
			{#each langs as lang}
				<Slide
					class="p-1 pl-2 outline-0 hover:variant-glass-surface"
					onchange={(e) => {
						if (e) {
							$langFilter.add(lang);
							$langFilter = $langFilter;
							return;
						}
						$langFilter.delete(lang);
						$langFilter = $langFilter;
					}}
					checked={$langFilter.has(lang)}
				>
					{FindLangName(lang)}
				</Slide>
			{/each}
		{/snippet}
	</ModalTemplate>
{/if}
