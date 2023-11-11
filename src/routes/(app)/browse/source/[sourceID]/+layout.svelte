<script lang="ts">
	import { AppBarData } from '$lib/MountTitleAction';
	import type { LayoutData } from './$types';
	import NavActions from './NavActions.svelte';

	export let data: LayoutData;

	const sause = data.sause;

	$: AppBarData($sause.data.source?.displayName, {
		component: NavActions,
		props: {
			supportsLatest: $sause.data.source?.supportsLatest
		}
	});
</script>

<slot />
