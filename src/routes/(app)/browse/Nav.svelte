<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { page } from '$app/stores';
	let scrollingElement: HTMLDivElement;
</script>

<div class="relative flex h-full">
	<div
		bind:this={scrollingElement}
		class="absolute bottom-0 top-0 w-full overflow-y-auto"
	>
		<div
			class="card variant-glass hide-scrollbar sticky top-0 z-10 grid justify-items-center overflow-x-auto rounded-none"
		>
			<div class="flex space-x-2 py-2">
				<a
					href="/browse/sources"
					class="btn
    {$page.url.pathname.includes('/browse/sources')
						? 'variant-filled-secondary'
						: 'variant-ghost-secondary'}"
				>
					Sources
				</a>
				<a
					href="/browse/extensions"
					class="btn
    {$page.url.pathname.includes('/browse/extensions')
						? 'variant-filled-secondary'
						: 'variant-ghost-secondary'}"
				>
					Extensions
				</a>
				<a
					href="/browse/migrate"
					class="btn
    {$page.url.pathname.includes('/browse/migrate')
						? 'variant-filled-secondary'
						: 'variant-ghost-secondary'}"
				>
					Migrate
				</a>
				<a
					href="/browse/globalsearch"
					class="btn
    {$page.url.pathname.includes('/browse/globalsearch')
						? 'variant-filled-secondary'
						: 'variant-ghost-secondary'}"
				>
					Global Search
				</a>
			</div>
		</div>
		<slot {scrollingElement} />
	</div>
</div>
