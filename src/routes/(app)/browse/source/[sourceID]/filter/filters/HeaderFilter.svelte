<script lang="ts">
	import type { SourceQuery } from '$lib/generated';

	export let filter: Extract<
		SourceQuery['source']['filters'][0],
		{ __typename?: 'HeaderFilter' | undefined }
	>;
</script>

{filter.name}
