import { localStorageStore } from '@skeletonlabs/skeleton';
import * as devalue from 'devalue';
import type { Writable } from 'svelte/store';

export type Filter = 'QUEUED' | 'DOWNLOADING' | 'FINISHED' | 'ERROR';

export const filter: Writable<Set<Filter>> = localStorageStore('Downlaodsfilter', new Set([]), {
	serializer: devalue
});
