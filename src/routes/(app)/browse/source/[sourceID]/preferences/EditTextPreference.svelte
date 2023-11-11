<script lang="ts">
	import { updateSourcePreference, type SourceQuery } from '$lib/generated';
	import { popup } from '@skeletonlabs/skeleton';

	export let pref: Extract<
		SourceQuery['source']['preferences'][0],
		{ __typename?: 'EditTextPreference' | undefined }
	>;
	export let index: number;
	export let id: string;
	let value = pref.EditTextCurrentValue ?? pref.EditTextDefault;

	function handelChange() {
		updateSourcePreference({
			variables: {
				source: id,
				editTextState: value,
				position: index
			}
		});
	}
</script>

<label class="ml-4 mr-3">
	<span>{pref.EditTextTitle}</span>
	<input
		use:popup={{
			event: 'focus-blur',
			target: `${id} ${index}`,
			placement: 'bottom'
		}}
		bind:value
		on:change={handelChange}
		class="input"
		title="Input (text)"
		type="text"
		placeholder="input text"
	/>
</label>
<div class="card p-4 max-w-sm z-50" data-popup="{id} {index}">
	<p>{pref.summary}</p>
	<div class="card arrow z-50" style="border-radius:0" />
</div>
