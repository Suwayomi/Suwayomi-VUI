<!--
 Copyright (c) 2024 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	interface Props {
		titleText?: string;
		title?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
		footer?: import('svelte').Snippet;
	}

	let { titleText = '', title, children, footer }: Props = $props();
</script>

<div
	class="card w-modal flex max-h-dvh flex-col space-y-4 rounded-lg p-0 shadow-xl"
>
	{#if title}{@render title()}{:else}
		<h1 class="h3 pl-4 pt-4">
			{titleText}
		</h1>
	{/if}

	<div
		class="grid max-h-full grid-cols-1 gap-1 overflow-y-auto border-y border-surface-700 px-4"
	>
		{@render children?.()}
	</div>
	{#if footer}{@render footer()}{:else}
		<div class="p-4"></div>
	{/if}
</div>
