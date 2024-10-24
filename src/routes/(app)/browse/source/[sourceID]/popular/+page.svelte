<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import type { LayoutData } from '../$types';
	import Grid from '../Grid.svelte';
	interface Props {
		data: LayoutData;
	}

	let { data }: Props = $props();
</script>

<Grid {data} type="POPULAR" />
