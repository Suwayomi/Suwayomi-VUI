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

<div class="flex relative h-full">
	<div
		bind:this={scrollingElement}
		class="w-full overflow-y-auto absolute top-0 bottom-0"
	>
		<div
			class="sticky top-0 z-10 overflow-x-auto hide-scrollbar grid justify-items-center card rounded-none variant-glass"
		>
			<div class="py-2 flex space-x-2">
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
