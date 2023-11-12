<script lang="ts">
	import { page } from '$app/stores';

	export let supportsLatest: boolean = false;
</script>

<div class="flex space-x-1 h-full">
	<a
		href="./popular"
		class="btn rounded-none
  {$page.url.pathname.includes('/popular')
			? 'variant-filled-secondary'
			: 'variant-ghost-secondary'}"
	>
		Popular
	</a>
	{#if supportsLatest}
		<a
			href="./latest"
			class="btn rounded-none
  {$page.url.pathname.includes('/latest') ? 'variant-filled-secondary' : 'variant-ghost-secondary'}"
		>
			Latest
		</a>
	{/if}
	<a
		href="./filter"
		class="btn rounded-none
  {$page.url.pathname.includes('/filter') ? 'variant-filled-secondary' : 'variant-ghost-secondary'}"
	>
		Filter
	</a>
</div>
