import { goto } from '$app/navigation';
import { page } from '$app/state';
import {
	compressToEncodedURIComponent,
	decompressFromEncodedURIComponent
} from 'lz-string';

export type Coder<T = unknown> = {
	encode: (value: T) => string | undefined;
	decode: (value: string | null) => T | null;
	defaultValue?: T;
};

type Options = {
	pushHistory?: boolean | undefined;
};

function primitiveEncodeAndDecodeOptions<T>({
	encode,
	decode
}: Coder<T>): (defaultValue?: T) => Coder<T> {
	return (defaultValue?: T) => {
		return { encode, decode, defaultValue };
	};
}

function objectEncodeAndDecodeOptions<k>(
	defaultValue?: Record<string, k>
): Coder<Record<string, k>> {
	return {
		encode: (value) => JSON.stringify(value),
		decode: (value) => {
			if (value === null) return null;
			try {
				return JSON.parse(value);
			} catch {
				return null;
			}
		},
		defaultValue
	};
}
function arrayEncodeAndDecodeOptions<k>(defaultValue?: k[]): Coder<k[]> {
	return {
		encode: (value) => JSON.stringify(value),
		decode: (value) => {
			if (value === null) return null;
			try {
				return JSON.parse(value);
			} catch {
				return null;
			}
		},
		defaultValue
	};
}
function lzEncodeAndDecodeOptions<k>(defaultValue?: k): Coder<k> {
	return {
		encode: (value) => compressToEncodedURIComponent(JSON.stringify(value)),
		decode: (value) => {
			if (!value) return null;
			try {
				return JSON.parse(decompressFromEncodedURIComponent(value) ?? '');
			} catch {
				return null;
			}
		},
		defaultValue
	};
}

export const ssp = {
	number: primitiveEncodeAndDecodeOptions<number>({
		encode: (value) => value.toString(),
		decode: (value) => (value ? parseFloat(value) : null)
	}),
	boolean: primitiveEncodeAndDecodeOptions<boolean>({
		encode: (value) => value + '',
		decode: (value) => value !== null && value !== 'false'
	}),
	string: primitiveEncodeAndDecodeOptions<string>({
		encode: (value) => value ?? '',
		decode: (value) => value
	}),
	object: objectEncodeAndDecodeOptions,
	array: arrayEncodeAndDecodeOptions,
	lz: lzEncodeAndDecodeOptions
};

const GOTO_OPTIONS = {
	keepFocus: true,
	noScroll: true,
	replaceState: true
};
const GOTO_OPTIONS_PUSH = {
	keepFocus: true,
	noScroll: true,
	replaceState: false
};

export function queryParam<T>(key: string, coder: Coder<T>, options?: Options) {
	const state = $state<{ value: T }>({
		value: coder.defaultValue ? coder.defaultValue : (undefined as T)
	});
	$effect(() => {
		const searchParam = page.url.searchParams.get(key);
		if (searchParam !== null && searchParam !== undefined) {
			state.value = coder.decode(searchParam) as T;
		} else {
			state.value = coder.defaultValue as T;
		}
	});

	$effect(() => {
		const value = state.value;
		const url = new URL(location.href);
		if (value !== null && value !== undefined) {
			const searchParam = coder.encode(value);
			if (!searchParam) {
				url.searchParams.delete(key);
			} else {
				url.searchParams.set(key, searchParam);
			}
		} else {
			url.searchParams.delete(key);
		}

		if (url.href === location.href) {
			return;
		}

		if (options?.pushHistory) {
			goto(url.href, GOTO_OPTIONS_PUSH);
		} else {
			goto(url.href, GOTO_OPTIONS);
		}
	});
	return state;
}
