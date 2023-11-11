<script lang="ts">
	import IconButton from '$lib/components/IconButton.svelte';
	import MainAppRail from '$lib/components/MainAppRail.svelte';
	import MediaQuery from '$lib/components/MediaQuery.svelte';
	import { screens } from '$lib/screens';
	import { action, title } from '$lib/simpleStores';
	import { AppBar, AppShell } from '@skeletonlabs/skeleton';
	import { getDrawerStore } from '@skeletonlabs/skeleton';

	const drawerStore = getDrawerStore();
</script>

<AppShell slotHeader="">
	<svelte:fragment slot="header">
		<AppBar padding="" slotTrail="h-10 xs:h-14" gap="" slotLead="h-10 xs:h-14">
			<svelte:fragment slot="lead">
				<MediaQuery query="(min-width: {screens.xs})" let:matches>
					{#if !matches}
						<IconButton
							on:click={() => {
								drawerStore.open({
									id: 'MainMenu',
									width: 'max-w-[50%]'
								});
							}}
							name="mdi:dots-vertical"
							class="h-full"
						/>
					{/if}
				</MediaQuery>
				<span class="text-xl/[5rem] sm:text-4xl/[5rem] py-2 px-2 sm:px-4 line-clamp-1">
					{$title}
				</span>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if $action?.props}
					<svelte:component this={$action.component} {...$action.props} />
				{:else if $action?.component}
					<svelte:component this={$action.component} />
				{/if}
			</svelte:fragment>
			<!-- <svelte:fragment slot="headline">(headline)</svelte:fragment> -->
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<MediaQuery query="(min-width: {screens.xs})" let:matches>
			{#if matches}
				<MainAppRail />
			{/if}
		</MediaQuery>
	</svelte:fragment>
	<slot />
</AppShell>
