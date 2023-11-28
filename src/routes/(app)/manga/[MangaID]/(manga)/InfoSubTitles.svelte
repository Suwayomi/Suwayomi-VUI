<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	export let text: undefined | string | null = undefined;
	export let name: string = 'undefined';
</script>

{#if text}
	<h3 class="h3 md:h5 lg:h4 xl:h3 flex items-center space-x-2">
		<span>{name}:</span>
		<span class=" line-clamp-1">{text}</span>
	</h3>
{/if}
