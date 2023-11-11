<script lang="ts">
	import LangFilterbutton from '$lib/components/LangFilterbutton.svelte';
	import Search from '$lib/components/Search.svelte';

	import { Sourcelangfilt as langfilt } from './SourcesStores';
	export let langs: Set<string>;
</script>

<div class="h-full flex">
	<Search />
	<LangFilterbutton {langfilt} {langs} />
</div>
