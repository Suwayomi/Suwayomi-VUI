<script lang="ts">
	import Slide from '$lib/components/Slide.svelte';
	import { updateSourcePreference, type SourceQuery } from '$lib/generated';

	export let pref: Extract<
		SourceQuery['source']['preferences'][0],
		{ __typename?: 'CheckBoxPreference' | undefined }
	>;
	export let index: number;
	export let id: string;

	let checked = pref.CheckBoxCheckBoxCurrentValue ?? pref.CheckBoxDefault;

	function handelcheck(state: CustomEvent<boolean>) {
		updateSourcePreference({
			variables: {
				source: id,
				checkBoxState: state.detail,
				position: index
			}
		});
	}
</script>

<Slide
	on:changee={handelcheck}
	{checked}
	class="w-full hover:variant-glass-surface py-1 px-3 my-1"
	labelclass="w-full ml-1"
>
	<div class="flex flex-col">
		<div>
			{pref.CheckBoxTitle}
		</div>
		<div class="text-sm text-surface-500">
			{pref.summary}
		</div>
	</div>
</Slide>
