<script>
	import { page } from '$app/stores';
	import { AppRail, AppRailAnchor } from '@skeletonlabs/skeleton';
	import IconWrapper from './IconWrapper.svelte';
	import Tooltip from './Tooltip.svelte';
</script>

<AppRail width="w-14">
	<AppRailAnchor href="/" selected={$page.url.pathname === '/'}>
		<Tooltip
			tip="Library"
			placement="right"
			tipclass="z-20"
			class="w-full flex justify-center items-center"
		>
			<IconWrapper name="mdi:bookmark-box-multiple" class="w-4/6 h-full aspect-square" />
		</Tooltip>
	</AppRailAnchor>
	<AppRailAnchor href={'/updates'} selected={$page.url.pathname.includes('/updates')}>
		<Tooltip
			tip="Updates"
			placement="right"
			tipclass="z-20"
			class="w-full flex justify-center items-center"
		>
			<IconWrapper name="mdi:alert-decagram-outline" class="w-4/6 h-full aspect-square" />
		</Tooltip>
	</AppRailAnchor>
	<AppRailAnchor href={'/browse/sources'} selected={$page.url.pathname.includes('/browse')}>
		<Tooltip
			tip="Browse"
			placement="right"
			tipclass="z-20"
			class="w-full flex justify-center items-center"
		>
			<IconWrapper name="mdi:compass-outline" class="w-4/6 h-full aspect-square" />
		</Tooltip>
	</AppRailAnchor>
	<AppRailAnchor
		href={'/downloads'}
		selected={$page.url.pathname.includes('/downloads')}
		title="Downloads"
	>
		<Tooltip
			tip="Downloads"
			placement="right"
			tipclass="z-20"
			class="w-full flex justify-center items-center"
		>
			<IconWrapper name="mdi:download" class="w-4/6 h-full aspect-square" />
		</Tooltip>
	</AppRailAnchor>
	<AppRailAnchor href={'/settings'} selected={$page.url.pathname.includes('/settings')}>
		<Tooltip
			tip="Settings"
			placement="right"
			tipclass="z-20"
			class="w-full flex justify-center items-center"
		>
			<IconWrapper name="mdi:cog" class="w-4/6 h-full aspect-square" />
		</Tooltip>
	</AppRailAnchor>
</AppRail>
