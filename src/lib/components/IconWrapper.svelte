<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import Icon from '@iconify/svelte';
	interface Props {
		name: string;
		width?: string;
		height?: string;
		class?: string;
	}

	let { width, height, class: className, name }: Props = $props();
</script>

<Icon icon={name} class="pointer-events-none {className}" {width} {height} />
