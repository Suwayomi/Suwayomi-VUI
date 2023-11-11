import { localStorageStore } from '@skeletonlabs/skeleton';
import type { Writable } from 'svelte/store';
import * as devalue from 'devalue';

export const Sourcelangfilt: Writable<Set<string>> = localStorageStore(
	'Sourcelangfilt',
	new Set(['all', 'localsourcelang']),
	{
		serializer: devalue
	}
);
