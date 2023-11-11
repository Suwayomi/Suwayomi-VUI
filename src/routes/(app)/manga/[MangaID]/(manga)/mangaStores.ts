import type { GetMangaQuery } from '$lib/generated';
// import { localStorageStore } from "@skeletonlabs/skeleton";
import { writable, type Writable } from 'svelte/store';

export type chaptertype = GetMangaQuery['manga']['chapters']['nodes'][0];

export const selectmode = writable(false);
export const selected: Writable<chaptertype[]> = writable([]);
