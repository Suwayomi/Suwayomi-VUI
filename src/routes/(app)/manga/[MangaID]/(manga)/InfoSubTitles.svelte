<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	interface Props {
		text?: undefined | string | null;
		name?: string;
		href?: string;
	}

	let { text = undefined, name = 'undefined', href = '' }: Props = $props();
</script>

{#if text}
	<h3 class="h6 flex items-center space-x-2 xs:h3 md:h5 lg:h4 xl:h3">
		<span>{name}:</span>
		<a {href} target="_blank" class="line-clamp-1 hover:opacity-75">{text}</a>
	</h3>
{/if}
