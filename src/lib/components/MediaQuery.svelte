<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	interface Props {
		query: string;
		children?: import('svelte').Snippet<[{ matches: boolean }]>;
	}

	let { query, children }: Props = $props();

	let mql: MediaQueryList;
	let mqlListener: ((e: MediaQueryListEvent) => void) | undefined;
	let wasMounted = false;
	let matches = $state(false);

	$effect(() => {
		wasMounted = true;
		return () => {
			removeActiveListener();
		};
	});

	$effect(() => {
		if (wasMounted) {
			removeActiveListener();
			addNewListener(query);
		}
	});

	function addNewListener(query: string) {
		mql = window.matchMedia(query);
		mqlListener = (e: MediaQueryListEvent) => {
			matches = e.matches;
		};
		mql.addEventListener('change', mqlListener);
		matches = mql.matches;
	}

	function removeActiveListener() {
		if (mql && mqlListener) {
			mql.removeEventListener('change', mqlListener);
		}
	}
</script>

{@render children?.({ matches })}
