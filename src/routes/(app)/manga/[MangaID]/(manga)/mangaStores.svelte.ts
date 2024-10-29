// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { ChapterTypeFragment } from '$lib/gql/Fragments';
import type { ResultOf, VariablesOf } from '$lib/gql/graphql';
import { getManga } from '$lib/gql/Queries';
import type { OperationResultF } from '$lib/util.svelte';
import { getContextClient, queryStore } from '@urql/svelte';
import { onDestroy } from 'svelte';
import { writable } from 'svelte/store';

export type chapterType = ResultOf<typeof ChapterTypeFragment>;

export const selectMode = writable(false);
export const selected = writable<chapterType[]>([]);

export const manga: {
	value:
		| OperationResultF<ResultOf<typeof getManga>, VariablesOf<typeof getManga>>
		| undefined;
} = $state({
	value: undefined
});

let unSub = () => {};

export function setMangaId(id: number) {
	unSub();
	const client = getContextClient();
	const mga = queryStore({
		client,
		query: getManga,
		variables: { id }
	});
	unSub = mga.subscribe((queryResult) => {
		manga.value = queryResult;
	});
	onDestroy(() => {
		unSub();
	});
}
