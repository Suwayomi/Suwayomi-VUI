<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { langFilter } from './ExtensionsStores';
	import Search from '$lib/components/Search.svelte';
	import LangFilterButton from '$lib/components/LangFilterButton.svelte';
	export let langs: Set<string>;
</script>

<div class="h-full flex">
	<Search />
	<LangFilterButton {langFilter} {langs} />
</div>
