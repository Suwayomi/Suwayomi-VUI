<script lang="ts">
	import { page } from '$app/stores';
	let scrollingElement: HTMLDivElement;
</script>

<div class="flex relative h-full">
	<div bind:this={scrollingElement} class="w-full overflow-y-auto absolute top-0 bottom-0">
		<div
			class="sticky top-0 z-10 overflow-x-auto hide-scrollbar grid justify-items-center card rounded-none variant-glass"
		>
			<div class="py-2 flex space-x-2">
				<a
					href="sources"
					class="btn
    {$page.url.pathname.includes('/browse/sources')
						? 'variant-filled-primary'
						: 'variant-ghost-primary'}"
				>
					Sources
				</a>
				<a
					href="extensions"
					class="btn
    {$page.url.pathname.includes('/browse/extensions')
						? 'variant-filled-primary'
						: 'variant-ghost-primary'}"
				>
					Extentions
				</a>
				<a
					href="migrate"
					class="btn
    {$page.url.pathname.includes('/browse/migrate')
						? 'variant-filled-primary'
						: 'variant-ghost-primary'}"
				>
					Migrate
				</a>
				<a
					href="globalsearch"
					class="btn
    {$page.url.pathname.includes('/browse/globalsearch')
						? 'variant-filled-primary'
						: 'variant-ghost-primary'}"
				>
					Global Search
				</a>
			</div>
		</div>
		<slot {scrollingElement} />
	</div>
</div>
