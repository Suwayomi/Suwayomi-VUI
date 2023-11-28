<!--
 Copyright (c) 2023 Contributors to the Suwayomi project
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import { screens, type Screens } from '$lib/screens';
	import { onMount } from 'svelte';

	const queries = Object.fromEntries(
		Object.entries(screens).map((e) => {
			return [e[0], `(min-width: ${e[1]})`];
		})
	) as Screens<string>;

	let mql: Screens<MediaQueryList | undefined> = Object.fromEntries(
		Object.entries(screens).map((e) => [e[0], undefined])
	) as Screens<MediaQueryList | undefined>;
	let mqlListener: Screens<((e: MediaQueryListEvent) => void) | undefined> = Object.fromEntries(
		Object.entries(screens).map((e) => [e[0], undefined])
	) as Screens<((e: MediaQueryListEvent) => void) | undefined>;

	let wasMounted = false;
	let matches: Screens<boolean> = Object.fromEntries(
		Object.entries(screens).map((e) => [e[0], false])
	) as Screens<boolean>;

	onMount(() => {
		wasMounted = true;
		return () => {
			removeActiveListener(queries);
		};
	});

	$: {
		if (wasMounted) {
			removeActiveListener(queries);
			addNewListener(queries);
		}
	}

	function addNewListener(queries: Screens<string>) {
		(Object.entries(queries) as [keyof Screens<string>, string][]).forEach((query) => {
			mql[query[0]] = window.matchMedia(query[1]);
			mqlListener[query[0]] = (e: MediaQueryListEvent) => {
				matches[query[0]] = e.matches;
			};
			const listne = mqlListener[query[0]];
			const ml = mql[query[0]];
			if (!listne || !ml) return;
			ml.addEventListener('change', listne);
			matches[query[0]] = ml.matches;
		});
	}

	function removeActiveListener(queries: Screens<string>) {
		(Object.entries(queries) as [keyof Screens<string>, string][]).forEach((query) => {
			const listne = mqlListener[query[0]];
			const ml = mql[query[0]];
			if (!listne || !ml) return;
			ml.removeEventListener('change', listne);
		});
	}

	$: gridnumber = getgridnumber(matches);
	function getgridnumber(matches: Screens<boolean>) {
		if (matches['3xl']) return 10;
		else if (matches['2xl']) return 8;
		else if (matches['xl']) return 7;
		else if (matches['lg']) return 5;
		else if (matches['md']) return 4;
		else if (matches['sm']) return 3;
		else if (matches['xs']) return 2;
		else return 1;
	}
</script>

<slot {matches} {gridnumber} />
