// import { localStorageStore } from "@skeletonlabs/skeleton";
import { writable, type Writable } from 'svelte/store';

export const mangaTitle = writable('');
export const chapterTitle = writable('');
export const ViewNav: Writable<boolean> = writable(false);
