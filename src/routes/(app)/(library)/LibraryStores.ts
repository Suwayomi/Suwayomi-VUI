import type { CategoryQuery } from '$lib/generated';
// import { localStorageStore } from '@skeletonlabs/skeleton';
import { writable, type Writable } from 'svelte/store';

export type MangaType = NonNullable<CategoryQuery['category']>['mangas']['nodes'][0];
export const selected: Writable<MangaType[]> = writable([]);
export const selectmode = writable(false);
