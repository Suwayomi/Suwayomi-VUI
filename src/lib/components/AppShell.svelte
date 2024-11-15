<script lang="ts">
	import type { CssClasses } from '@skeletonlabs/skeleton';
	import type { Snippet } from 'svelte';

	interface Props {
		header?: Snippet;
		sidebarLeft?: Snippet;
		pageHeader?: Snippet;
		children: Snippet;
		pageFooter?: Snippet;
		sidebarRight?: Snippet;
		footer?: Snippet;
		onscroll?: (
			e: UIEvent & {
				currentTarget: EventTarget & HTMLDivElement;
			}
		) => void;
		scrollbarGutter?: CssClasses;
		regionPage?: CssClasses;
		slotHeader?: CssClasses;
		slotSidebarLeft?: CssClasses;
		slotSidebarRight?: CssClasses;
		slotPageHeader?: CssClasses;
		slotPageContent?: CssClasses;
		slotPageFooter?: CssClasses;
		slotFooter?: CssClasses;
		class?: CssClasses;
	}

	const {
		header,
		sidebarLeft,
		pageHeader,
		children,
		pageFooter,
		sidebarRight,
		footer,
		onscroll = () => {},
		scrollbarGutter = 'auto',
		regionPage = '',
		slotHeader = 'z-10',
		slotSidebarLeft = 'w-auto',
		slotSidebarRight = 'w-auto',
		slotPageHeader = '',
		slotPageContent = '',
		slotPageFooter = '',
		slotFooter = '',
		class: classNames
	}: Props = $props();

	// Base Classes
	const cBaseAppShell = 'w-full h-full flex flex-col overflow-hidden';
	const cContentArea = 'w-full h-full flex overflow-hidden';
	const cPage = 'flex-1 overflow-x-hidden flex flex-col';
	const cSidebarLeft = 'flex-none overflow-x-hidden overflow-y-auto';
	const cSidebarRight = 'flex-none overflow-x-hidden overflow-y-auto';

	// Reactive Classes
	const classesBase = $derived(`${cBaseAppShell} ${classNames ?? ''}`);
	const classesHeader = $derived(`${slotHeader}`);
	const classesSidebarLeft = $derived(`${cSidebarLeft} ${slotSidebarLeft}`);
	const classesSidebarRight = $derived(`${cSidebarRight} ${slotSidebarRight}`);
	const classesPageHeader = $derived(`${slotPageHeader}`);
	const classesPageContent = $derived(`${slotPageContent}`);
	const classesPageFooter = $derived(`${slotPageFooter}`);
	const classesFooter = $derived(`${slotFooter}`);
</script>

<div id="appShell" class={classesBase} data-testid="app-shell">
	<!-- Slot: Header -->
	{#if header}
		<header id="shell-header" class="flex-none {classesHeader}">
			{@render header?.()}
		</header>
	{/if}

	<!-- Content Area -->
	<div class="flex-auto {cContentArea}">
		<!-- Slot: Sidebar (left) -->
		{#if sidebarLeft}
			<aside id="sidebar-left" class={classesSidebarLeft}>
				{@render sidebarLeft?.()}
			</aside>
		{/if}

		<!-- Page -->
		<div
			id="page"
			class="{regionPage} {cPage}"
			style:scrollbar-gutter={scrollbarGutter}
			{onscroll}
		>
			<!-- Slot: Page Header -->
			{#if pageHeader}
				<header id="page-header" class="flex-none {classesPageHeader}">
					{#if pageHeader}{@render pageHeader()}{:else}(slot:header){/if}
				</header>
			{/if}

			<!-- Slot: Page Content (default) -->
			<main id="page-content" class="flex-auto {classesPageContent}">
				{@render children?.()}
			</main>

			<!-- Slot: Page Footer -->
			{#if pageFooter}
				<footer id="page-footer" class="flex-none {classesPageFooter}">
					{#if pageFooter}{@render pageFooter()}{:else}(slot:footer){/if}
				</footer>
			{/if}
		</div>

		<!-- Slot: Sidebar (right) -->
		{#if sidebarRight}
			<aside id="sidebar-right" class={classesSidebarRight}>
				{@render sidebarRight?.()}
			</aside>
		{/if}
	</div>

	<!-- Slot: footer -->
	{#if footer}
		<footer id="shell-footer" class="flex-none {classesFooter}">
			{@render footer?.()}
		</footer>
	{/if}
</div>
