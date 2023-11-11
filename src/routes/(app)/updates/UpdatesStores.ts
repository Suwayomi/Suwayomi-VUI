import { type Writable, writable } from 'svelte/store';
import type { UpdatesQuery } from '$lib/generated';

export type UpdateNode = UpdatesQuery['chapters']['nodes'][0];

export const selected: Writable<UpdateNode[]> = writable([]);
export const selectmode = writable(false);
