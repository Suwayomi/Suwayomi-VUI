<script lang="ts">
	export let text: undefined | string | null = undefined;
	export let name: string = 'undefined';
</script>

{#if text}
	<h3 class="h3 md:h5 lg:h4 xl:h3 flex items-center space-x-2">
		<span>{name}:</span>
		<span class=" line-clamp-1">{text}</span>
	</h3>
{/if}
