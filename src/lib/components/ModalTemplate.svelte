<!--
 Copyright (c) 2024 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	export let title = '';
</script>

<div
	class="card w-modal flex max-h-dvh flex-col space-y-4 rounded-lg p-0 shadow-xl"
>
	<slot name="title">
		<h1 class="h3 pl-4 pt-4">
			{title}
		</h1>
	</slot>

	<div
		class="grid max-h-full grid-cols-1 gap-1 overflow-y-auto border-y border-surface-700 px-4"
	>
		<slot />
	</div>
	<slot name="footer">
		<div class="p-4" />
	</slot>
</div>
