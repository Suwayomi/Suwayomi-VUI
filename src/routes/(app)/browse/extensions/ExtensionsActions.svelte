<script lang="ts">
	import { langfilt } from './ExtensionsStores';
	import Search from '$lib/components/Search.svelte';
	import LangFilterbutton from '$lib/components/LangFilterbutton.svelte';
	export let langs: Set<string>;
</script>

<div class="h-full flex">
	<Search />
	<LangFilterbutton {langfilt} {langs} />
</div>
