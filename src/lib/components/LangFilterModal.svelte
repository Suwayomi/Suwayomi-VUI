<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { ISOLanguages } from '../../routes/(app)/browse/languages';
	import Slide from '$lib/components/Slide.svelte';
	const modalStore = getModalStore();
	export let langs: Set<string>;
	export let langfilt: Writable<Set<string>>;
</script>

{#if $modalStore[0]}
	<div class="card p-0 w-modal shadow-xl space-y-4 rounded-lg max-h-screen">
		<h1 class="h3 pt-4 pl-4">Allowed Languages</h1>
		<div class="pl-4 border-y border-surface-700">
			<div class="max-h-96 overflow-y-auto grid grid-cols-1 gap-1 pr-4">
				{#each langs as lang}
					<Slide
						class="outline-0 p-1 pl-2 hover:variant-glass-surface"
						on:changee={(e) => {
							if (e.detail) {
								$langfilt.add(lang);
								$langfilt = $langfilt;
								return;
							}
							$langfilt.delete(lang);
							$langfilt = $langfilt;
						}}
						checked={$langfilt.has(lang)}
					>
						{ISOLanguages.find((ele) => ele.code.toLowerCase() === lang.toLowerCase())
							?.nativeName ?? lang}
					</Slide>
				{/each}
			</div>
		</div>
		<div class="p-4" />
	</div>
{/if}
