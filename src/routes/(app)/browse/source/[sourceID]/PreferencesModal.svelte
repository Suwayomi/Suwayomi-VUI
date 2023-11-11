<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { onDestroy } from 'svelte';
	import type { LayoutData } from './$types';
	import CheckBoxPreference from './preferences/CheckBoxPreference.svelte';
	import ListPreference from './preferences/ListPreference.svelte';
	import SwitchPreference from './preferences/SwitchPreference.svelte';
	import MultiSelectListPreference from './preferences/MultiSelectListPreference.svelte';
	import EditTextPreference from './preferences/EditTextPreference.svelte';

	export let data: LayoutData;
	export let clearAll: () => void;

	const modalStore = getModalStore();
	const sause = data.sause;
	onDestroy(clearAll);
</script>

{#if $modalStore[0] && $sause.data.source?.isConfigurable}
	<div class="card p-0 w-modal shadow-xl space-y-4 rounded-lg max-h-screen overflow-y-auto">
		<h1 class="h3 p-4 border-b border-surface-500">Preferences</h1>
		<div class="pl-4 pb-4 max-h-96 overflow-y-auto">
			{#each $sause.data.source.preferences as pref, index}
				<div>
					{#if pref.__typename === 'CheckBoxPreference'}
						<CheckBoxPreference {pref} {index} id={data.sourceID} />
					{:else if pref.__typename === 'ListPreference'}
						<ListPreference {pref} {index} id={data.sourceID} />
					{:else if pref.__typename === 'SwitchPreference'}
						<SwitchPreference {pref} {index} id={data.sourceID} />
					{:else if pref.__typename === 'MultiSelectListPreference'}
						<MultiSelectListPreference {pref} {index} id={data.sourceID} />
					{:else if pref.__typename === 'EditTextPreference'}
						<EditTextPreference {pref} {index} id={data.sourceID} />
					{/if}
				</div>
			{/each}
		</div>
		<div />
	</div>
{/if}
