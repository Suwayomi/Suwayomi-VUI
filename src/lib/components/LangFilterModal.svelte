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
	const modalStore = getModalStore();
	export let langs: Set<string>;
	export let langFilter: Writable<Set<string>>;
</script>

{#if $modalStore[0]}
	<div class="card w-modal max-h-screen space-y-4 rounded-lg p-0 shadow-xl">
		<h1 class="h3 pl-4 pt-4">Allowed Languages</h1>
		<div class="border-y border-surface-700 pl-4">
			<div class="grid max-h-96 grid-cols-1 gap-1 overflow-y-auto pr-4">
				{#each langs as lang}
					<Slide
						class="p-1 pl-2 outline-0 hover:variant-glass-surface"
						on:changeE={(e) => {
							if (e.detail) {
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
			</div>
		</div>
		<div class="p-4" />
	</div>
{/if}
