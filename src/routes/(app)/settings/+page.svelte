<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import LibrarySettings from './LibrarySettings.svelte';
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	import { AppBarData } from '$lib/MountTitleAction';
	import Lightswitch from '$lib/components/lightswitch.svelte';
	import { display, gmState } from '$lib/simpleStores.svelte';

	import { presetWithIcons } from '$lib/presets';
	import Slide from '$lib/components/Slide.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import ReaderDefaultsModal from './ReaderDefaultsModal.svelte';
	import BackupModal from './BackupModal.svelte';
	import { enumKeys } from '$lib/util.svelte';
	import MangaSettingsModal from './MangaSettingsModal.svelte';
	import TrackingModal from './TrackingModal.svelte';
	import CacheSettingsModal from './CacheSettingsModal.svelte';

	const modalStore = getModalStore();
	AppBarData('Settings');
</script>

<a
	href="/settings/categories"
	class="flex h-16 w-full cursor-pointer items-center text-left hover:variant-glass-surface"
>
	<IconWrapper class="h-full w-auto p-2" name="mdi:shape" />
	<div class="w-full">Categories</div>
</a>
<button
	onclick={() =>
		modalStore.trigger({
			type: 'component',
			component: { ref: BackupModal },
			backdropClasses: '!p-0'
		})}
	class="flex h-16 w-full cursor-pointer items-center text-left hover:variant-glass-surface"
>
	<IconWrapper class="h-full w-auto p-2" name="mdi:backup" />
	<div class="w-full">Backup</div>
</button>
<button
	onclick={() =>
		modalStore.trigger({
			type: 'component',
			component: { ref: ReaderDefaultsModal },
			backdropClasses: '!p-0'
		})}
	class="flex h-16 w-full cursor-pointer items-center text-left hover:variant-glass-surface"
>
	<IconWrapper
		class="h-full w-auto p-2"
		name="mdi:book-open-page-variant-outline"
	/>
	<div class="w-full">Default Reader Settings</div>
</button>
<button
	onclick={() =>
		modalStore.trigger({
			type: 'component',
			component: { ref: LibrarySettings },
			backdropClasses: '!p-0'
		})}
	class="flex h-16 w-full cursor-pointer items-center text-left hover:variant-glass-surface"
>
	<IconWrapper class="h-full w-auto p-2" name="mdi:bookmark-box-multiple" />
	<div class="w-full">Library Settings</div>
</button>
<button
	onclick={() =>
		modalStore.trigger({
			type: 'component',
			component: { ref: MangaSettingsModal },
			backdropClasses: '!p-0'
		})}
	class="flex h-16 w-full cursor-pointer items-center text-left hover:variant-glass-surface"
>
	<IconWrapper class="h-full w-auto p-2" name="streamline:insert-top-left" />
	<div class="w-full">Manga Settings</div>
</button>
<label
	class="flex h-16 w-full cursor-pointer items-center text-left hover:variant-glass-surface"
>
	<IconWrapper class="h-full w-auto p-2" name="mdi:television-guide" />
	<div class="w-full">Grid Display</div>
	<select bind:value={gmState.value.Display} class="select mr-1 max-w-sm">
		{#each enumKeys(display) as value}
			<option {value}>{value}</option>
		{/each}
	</select>
</label>
<button
	onclickcapture={(e) => {
		e.stopPropagation();
		e.preventDefault();
		gmState.value.dark = !gmState.value.dark;
	}}
	class="flex h-16 w-full cursor-pointer items-center text-left hover:variant-glass-surface"
>
	<IconWrapper class="h-full w-auto p-2" name="mdi:theme-light-dark" />
	<div class="w-full">Dark mode</div>
	<Lightswitch class="flex-shrink-0 " />
</button>
<label
	class="flex h-16 w-full cursor-pointer items-center text-left hover:variant-glass-surface"
>
	<IconWrapper class="h-full w-auto p-2" name="mdi:palette-outline" />
	<div class="w-full">Theme settings</div>
	<select bind:value={gmState.value.theme} class="select mr-1 max-w-sm">
		{#each presetWithIcons as preset}
			<option value={preset.name}>{preset.icon} {preset.name}</option>
		{/each}
	</select>
</label>
<button
	onclick={() => {
		gmState.value.nsfw = !gmState.value.nsfw;
	}}
	class="flex h-16 w-full cursor-pointer items-center text-left hover:variant-glass-surface"
>
	<IconWrapper class="h-full w-auto p-2" name="mdi:heart" />
	<div class="w-full">Show Nsfw</div>
	<Slide
		bind:checked={gmState.value.nsfw}
		class="p-1 hover:variant-glass-surface focus:outline-0"
	/>
</button>
<button
	onclick={() =>
		modalStore.trigger({
			type: 'component',
			component: { ref: TrackingModal },
			backdropClasses: '!p-0'
		})}
	class="flex h-16 w-full cursor-pointer items-center text-left hover:variant-glass-surface"
>
	<IconWrapper class="h-full w-auto p-2" name="mdi:target" />
	<div class="w-full">Tracking settings</div>
</button>
<a
	href="/settings/about"
	class="flex h-16 w-full cursor-pointer items-center text-left hover:variant-glass-surface"
>
	<IconWrapper class="h-full w-auto p-2" name="mdi:information" />
	<div class="w-full">About</div>
</a>
<button
	onclick={() =>
		modalStore.trigger({
			type: 'component',
			backdropClasses: '!p-0',
			component: { ref: CacheSettingsModal }
		})}
	class="flex h-16 w-full cursor-pointer items-center text-left hover:variant-glass-surface"
>
	<IconWrapper class="h-full w-auto p-2" name="mdi:files" />
	<div class="w-full">Cache</div>
</button>
<a
	href="/settings/server"
	class="flex h-16 w-full cursor-pointer items-center text-left hover:variant-glass-surface"
>
	<IconWrapper class="h-full w-auto p-2" name="mdi:server" />
	<div class="w-full">Server Settings</div>
</a>
