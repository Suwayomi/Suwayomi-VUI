import { localStorageStore } from '@skeletonlabs/skeleton';
import * as devalue from 'devalue';
import type { Writable } from 'svelte/store';

export const lastFetched: Writable<Date> = localStorageStore('lastFetchedExtentions', new Date(0), {
	serializer: devalue
});

export const langfilt: Writable<Set<string>> = localStorageStore(
	'Extentionslangfilt',
	new Set(['all', 'en']),
	{
		serializer: devalue
	}
);
