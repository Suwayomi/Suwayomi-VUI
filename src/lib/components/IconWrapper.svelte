<script lang="ts">
	import Icon from '@iconify/svelte';
	export let name: string;
</script>

<Icon
	icon={name}
	class="pointer-events-none {$$props.class}"
	width={$$props.width}
	height={$$props.height}
/>
