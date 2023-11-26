<script lang="ts">
	import LibrarySettings from './LibrarySettings.svelte';
	import IconWrapper from '$lib/components/IconWrapper.svelte';
	import { AppBarData } from '$lib/MountTitleAction';
	import Lightswitch from '$lib/components/lightswitch.svelte';
	import { Meta, display } from '$lib/simpleStores';
	import { presetWithIcons } from '$lib/presets';
	import Slide from '$lib/components/Slide.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import ReaderDefaultsModal from './ReaderDefaultsModal.svelte';
	import BackupModal from './BackupModal.svelte';
	import { enumKeys } from '$lib/util';
	import MangaSettingsModal from './MangaSettingsModal.svelte';
	import TrackingModal from './TrackingModal.svelte';
	const modalStore = getModalStore();
	AppBarData('Settings');
</script>

<a
	href="settings/categories"
	class=" text-left flex items-center w-full h-16 hover:variant-glass-surface cursor-pointer"
>
	<IconWrapper class="h-full w-auto p-2" name="mdi:shape" />
	<div class="w-full">Categories</div>
</a>
<button
	on:click={() =>
		modalStore.trigger({
			type: 'component',
			component: { ref: BackupModal }
		})}
	class=" text-left flex items-center w-full h-16 hover:variant-glass-surface cursor-pointer"
>
	<IconWrapper class="h-full w-auto p-2" name="mdi:backup" />
	<div class="w-full">Backup</div>
</button>
<button
	on:click={() =>
		modalStore.trigger({
			type: 'component',
			component: { ref: ReaderDefaultsModal }
		})}
	class=" text-left flex items-center w-full h-16 hover:variant-glass-surface cursor-pointer"
>
	<IconWrapper class="h-full w-auto p-2" name="mdi:book-open-page-variant-outline" />
	<div class="w-full">Default Reader Settings</div>
</button>
<button
	on:click={() =>
		modalStore.trigger({
			type: 'component',
			component: { ref: LibrarySettings }
		})}
	class=" text-left flex items-center w-full h-16 hover:variant-glass-surface cursor-pointer"
>
	<IconWrapper class="h-full w-auto p-2" name="mdi:bookmark-box-multiple" />
	<div class="w-full">Library Settings</div>
</button>
<button
	on:click={() =>
		modalStore.trigger({
			type: 'component',
			component: { ref: MangaSettingsModal }
		})}
	class=" text-left flex items-center w-full h-16 hover:variant-glass-surface cursor-pointer"
>
	<IconWrapper class="h-full w-auto p-2" name="streamline:insert-top-left" />
	<div class="w-full">Manga Settings</div>
</button>
<label class="text-left flex items-center w-full h-16 hover:variant-glass-surface cursor-pointer">
	<IconWrapper class="h-full w-auto p-2" name="mdi:television-guide" />
	<div class="w-full">Grid Display</div>
	<select bind:value={$Meta.Display} class="select max-w-sm mr-1">
		{#each enumKeys(display) as value}
			<option {value}>{value}</option>
		{/each}
	</select>
</label>
<button
	on:click|preventDefault|stopPropagation|capture={() => ($Meta.dark = !$Meta.dark)}
	class=" text-left flex items-center w-full h-16 hover:variant-glass-surface cursor-pointer"
>
	<IconWrapper class="h-full w-auto p-2" name="mdi:theme-light-dark" />
	<div class="w-full">Dark mode</div>
	<Lightswitch width="w-16" height="h-8" class="mr-1" />
</button>
<label class="text-left flex items-center w-full h-16 hover:variant-glass-surface cursor-pointer">
	<IconWrapper class="h-full w-auto p-2" name="mdi:palette-outline" />
	<div class="w-full">Theme settings</div>
	<select bind:value={$Meta.theme} class="select max-w-sm mr-1">
		{#each presetWithIcons as preset}
			<option value={preset.name}>{preset.icon} {preset.name}</option>
		{/each}
	</select>
</label>
<button
	on:click={() => {
		$Meta.nsfw = !$Meta.nsfw;
	}}
	class=" text-left flex items-center w-full h-16 hover:variant-glass-surface cursor-pointer"
>
	<IconWrapper class="h-full w-auto p-2" name="mdi:heart" />
	<div class="w-full">Show Nsfw</div>
	<Slide bind:checked={$Meta.nsfw} class=" focus:outline-0 p-1 pl-2 hover:variant-glass-surface" />
</button>
{#if window.tracking === 'docker'}
	<button
		on:click={() =>
			modalStore.trigger({
				type: 'component',
				component: { ref: TrackingModal }
			})}
		class=" text-left flex items-center w-full h-16 hover:variant-glass-surface cursor-pointer"
	>
		<IconWrapper class="h-full w-auto p-2" name="mdi:target" />
		<div class="w-full">Tracking settings</div>
	</button>
{/if}
<a
	href="settings/about"
	class=" text-left flex items-center w-full h-16 hover:variant-glass-surface cursor-pointer"
>
	<IconWrapper class="h-full w-auto p-2" name="mdi:information" />
	<div class="w-full">About</div>
</a>
