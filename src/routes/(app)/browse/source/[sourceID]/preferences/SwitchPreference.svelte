<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import Slide from '$lib/components/Slide.svelte';
	import { updateSourcePreference } from '$lib/gql/Mutations';
	import type { getSource } from '$lib/gql/Queries';
	import { getContextClient } from '@urql/svelte';
	import type { ResultOf } from '$lib/gql/graphql';

	interface Props {
		pref: Extract<
			ResultOf<typeof getSource>['source']['preferences'][0],
			{ __typename: 'SwitchPreference' | undefined }
		>;
		index: number;
		id: string;
	}

	let { pref, index, id }: Props = $props();

	let checked = pref.SwitchCurrentValue ?? pref.SwitchDefault;
	const client = getContextClient();
	function handelcheck(state: boolean) {
		client
			.mutation(updateSourcePreference, {
				source: id,
				switchState: state,
				position: index
			})
			.toPromise();
	}
</script>

<Slide
	onchange={handelcheck}
	{checked}
	class="my-1 w-full px-3 py-1 hover:variant-glass-surface"
	labelClass="w-full ml-1"
>
	<div class="flex flex-col">
		<div>
			{pref.SwitchTitle}
		</div>
		<div class="text-sm text-surface-500">
			{pref.summary}
		</div>
	</div>
</Slide>
