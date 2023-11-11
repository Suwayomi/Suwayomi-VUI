import type { FilterChangeInput } from '$lib/generated';
import { type Writable, writable } from 'svelte/store';

export const filters: Writable<FilterChangeInput[]> = writable([]);
export const filtersSause = writable('');
