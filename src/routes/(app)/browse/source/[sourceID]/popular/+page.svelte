<script lang="ts">
	import { FetchSourceMangaType } from '$lib/generated';
	import type { LayoutData } from '../$types';
	import Grid from '../Grid.svelte';
	export let data: LayoutData;
</script>

<Grid {data} type={FetchSourceMangaType.Popular} />
