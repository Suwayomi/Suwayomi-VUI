<!--
 Copyright (c) 2024 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
-->
<script>
	import IconWrapper from '$lib/components/IconWrapper.svelte';
</script>

<a
	href="/downloads"
	class="flex h-16 w-full cursor-pointer items-center text-left hover:variant-glass-surface"
>
	<IconWrapper class="h-full w-auto p-2" name="mdi:download" />
	<div class="w-full">Downloads</div>
</a>

<a
	href="/settings"
	class="flex h-16 w-full cursor-pointer items-center text-left hover:variant-glass-surface"
>
	<IconWrapper class="h-full w-auto p-2" name="mdi:cog" />
	<div class="w-full">Settings</div>
</a>
