// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

// import { localStorageStore } from "@skeletonlabs/skeleton";
import { getManga } from '$lib/gql/Queries';
import type { getDrawerStore } from '@skeletonlabs/skeleton';
import { queryStore } from '@urql/svelte';
import type { ResultOf } from 'gql.tada';
import { get } from 'svelte/store';
import { client } from '$lib/gql/graphqlClient';
import type { OperationResultF } from '$lib/util.svelte';
import { SvelteMap, SvelteSet } from 'svelte/reactivity';
import { goto } from '$app/navigation';

export const readerState = $state({
	mangaTitle: '',
	chapterTitle: '',
	ViewNav: false,
	MangaID: -1,
	ChapterID: -1,
	ChapterPagesMap: new SvelteMap<number, string[]>(),
	displayedChapters: new SvelteSet<number>(),
	loadingChaptersIds: new SvelteSet<number>()
});

export function makeToggleDrawer(
	drawerStore: ReturnType<typeof getDrawerStore>
) {
	return () => {
		if (get(drawerStore).open) drawerStore.close();
		else {
			drawerStore.open({
				id: 'ChapterMenu',
				width: 'w-[280px] md:w-[480px]'
			});
		}
	};
}

class GetManga {
	#manga: OperationResultF<ResultOf<typeof getManga>> | undefined = $state();
	#last_id = -1;
	private unSub = () => {};
	constructor(idd: number) {
		this.id = idd;
	}
	set id(id: number) {
		if (id === -1) return;
		if (id === this.#last_id) return;
		this.#last_id = id;
		this.unSub();
		const tmp = queryStore({
			client,
			query: getManga,
			variables: { id }
		});
		this.unSub = tmp.subscribe((res) => {
			this.#manga = res;
		});
	}
	get manga() {
		return this.#manga;
	}
}

export const get_manga = new GetManga(-1);

export function gotoChapter(id: number) {
	goto(makeChapterUrl(id), { replaceState: true });
}

export function restartOnChapter(id: number) {
	goto(makeChapterUrl(id), { replaceState: true }).then(() => {
		readerState.displayedChapters.clear();
	});
}

export function makeChapterUrl(id: number) {
	return `/manga/${readerState.MangaID}/chapter/${id}`;
}
