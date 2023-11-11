<script lang="ts">
	import { page } from '$app/stores';

	export let supportsLatest: boolean = false;
</script>

<div class="flex space-x-1 h-full">
	<a
		href="./popular"
		class="btn rounded-none
  {$page.url.pathname.includes('/popular') ? 'variant-ghost-primary' : 'variant-glass-primary'}"
	>
		Popular
	</a>
	{#if supportsLatest}
		<a
			href="./latest"
			class="btn rounded-none
  {$page.url.pathname.includes('/latest') ? 'variant-ghost-primary' : 'variant-glass-primary'}"
		>
			Latest
		</a>
	{/if}
	<a
		href="./filter"
		class="btn rounded-none
  {$page.url.pathname.includes('/filter') ? 'variant-ghost-primary' : 'variant-glass-primary'}"
	>
		Filter
	</a>
</div>
