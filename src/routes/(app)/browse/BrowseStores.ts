import { localStorageStore } from '@skeletonlabs/skeleton';
import * as devalue from 'devalue';
import type { Writable } from 'svelte/store';

export const langfilt: Writable<Set<string>> = localStorageStore(
	'Global/MigrateLangfilt',
	new Set(['all']),
	{
		serializer: devalue
	}
);

export const SpecificSourceFilter: Writable<Set<string>> = localStorageStore(
	'Global/MigrateSpecificSourceFilter',
	new Set([]),
	{
		serializer: devalue
	}
);
