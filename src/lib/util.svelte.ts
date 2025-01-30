// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { get } from 'svelte/store';

import { toastStore } from './simpleStores.svelte';
import { client } from './gql/graphqlClient';
import {
	deleteDownloadedChapters,
	enqueueChapterDownloads,
	setServerSettings,
	updateChapters
} from './gql/Mutations';
import type { VariablesOf } from '$lib/gql/graphql';
import {
	CombinedError,
	createRequest,
	queryStore,
	subscriptionStore,
	type AnyVariables,
	type MutationArgs,
	type OperationContext,
	type OperationResult,
	type OperationResultState,
	type QueryArgs,
	type SubscriptionArgs
} from '@urql/svelte';
import { introspection } from '../graphql-env';
import { untrack } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

export type TriState = 'on' | 'off' | 'intermediate';
export type OperationResultF<
	/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
	Data = any,
	Variables extends AnyVariables = AnyVariables
> = OperationResult<Data, Variables> & {
	fetching: boolean;
};

export function getObjectEntries<T extends object>(
	obj: T
): [string, T[keyof T]][] {
	return Object.entries(obj) as [string, T[keyof T]][];
}
export function getObjectKeys<T extends object>(obj: T): (keyof T)[] {
	return Object.keys(obj) as (keyof T)[];
}

export class geneticSelectState<T extends { id: number }> {
	selected: SvelteMap<number, T> = $state(new SvelteMap());
	selectMode: boolean = $state(false);
	DoSelect(
		update: T,
		e: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement },
		lastSelected: T | undefined,
		all: T[] | undefined
	) {
		let ids = [update];
		if (e && e.shiftKey) {
			const chaps = all;
			const thisone = chaps?.findIndex((ele) => ele.id === update.id);
			const lastone = chaps?.findIndex((ele) => ele.id === lastSelected?.id);
			if (
				thisone !== undefined &&
				lastone !== undefined &&
				chaps !== undefined
			) {
				const biger = lastone > thisone;
				ids = chaps.slice(
					biger ? thisone : lastone,
					(biger ? lastone : thisone) + 1
				);
			}
		}
		lastSelected = update;
		if (this.selected.get(update.id) === undefined) {
			ids.forEach((ele) => this.selected.set(ele.id, ele));
		} else {
			ids.forEach((ele) => {
				this.selected.delete(ele.id);
			});
		}
		return lastSelected;
	}
	SelectAll(sortedMangas: T[] | undefined) {
		this.selectMode = true;
		if (this.selected.size === sortedMangas?.length) {
			this.selected = new SvelteMap();
		} else {
			sortedMangas?.forEach((ele) => this.selected.set(ele.id, ele));
		}
	}
	selectedIds(): number[] {
		return this.selected
			.values()
			.map((e) => e.id)
			.toArray();
	}
}

export const dlreabook = {
	download: 'download',
	read: 'read',
	bookmark: 'bookmark'
};
export type Tdlreabook = (typeof dlreabook)[keyof typeof dlreabook];

function getToastStore() {
	const toast = get(toastStore);
	if (!toast) {
		throw new Error('failed to get toastStore');
	}
	return toast;
}

export class chapterSelectState<
	T extends {
		id: number;
		isBookmarked: boolean;
		isDownloaded: boolean;
		isRead: boolean;
	}
> extends geneticSelectState<T> {
	async UpdateChapters(param: Tdlreabook): Promise<boolean | undefined> {
		if (this.selected.size) {
			const actions = {
				[dlreabook.bookmark]: async () => {
					const is = this.selected.values().next().value?.isBookmarked;
					const ids = this.selected
						.values()
						.filter((e) => e.isBookmarked === is)
						.map((e) => e.id)
						.toArray();
					await ErrorHelp(
						'failed to update Bookmark status',
						client
							.mutation(updateChapters, {
								isBookmarked: !is,
								ids
							})
							.toPromise()
					);
					return !is;
				},
				[dlreabook.download]: async () => {
					const is = this.selected.values().next().value?.isDownloaded;
					const ids = this.selected
						.values()
						.filter((e) => e.isDownloaded === is)
						.map((e) => e.id)
						.toArray();
					if (is) {
						await ErrorHelp(
							'failed to delete Downloaded chapters',
							client
								.mutation(deleteDownloadedChapters, {
									ids
								})
								.toPromise()
						);
					} else {
						await ErrorHelp(
							'failed to enqueue chapters Downloads',
							client.mutation(enqueueChapterDownloads, { ids }).toPromise()
						);
					}
					return !is;
				},
				[dlreabook.read]: async () => {
					const is = this.selected.values().next().value?.isRead;
					const ids = this.selected
						.values()
						.filter((e) => e.isRead === is)
						.map((e) => e.id)
						.toArray();
					await ErrorHelp(
						'failed to update Read status',
						client
							.mutation(updateChapters, {
								isRead: !is,
								ids
							})
							.toPromise()
					);
					return is;
				}
			} as const;
			return actions[param]();
		}
	}
}

export async function ErrorHelp<T>(
	failMessage: string,
	func: Promise<OperationResult<T>>,
	callback: (result: OperationResult<T>) => void = () => {}
) {
	try {
		const response = await func;
		if (response.error) {
			errortoast(failMessage, JSON.stringify(response.error));
			return;
		}
		callback(response);
	} catch (error) {
		console.error(error);
		if (error instanceof Error) {
			errortoast(failMessage, error.message);
		}
	}
}

export async function ErrorHelpUntyped(
	failMessage: string,
	...func: Promise<OperationResult<unknown>>[]
) {
	try {
		const results = await Promise.all(func);
		results.forEach((e) => {
			if (e.error) {
				errortoast(failMessage, JSON.stringify(e.error));
			}
		});
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			errortoast(failMessage, JSON.stringify(error));
		}
	}
}

export const gridValues =
	'xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-8 3xl:grid-cols-10';

export function errortoast(failMessage: string, errorMessage: string) {
	getToastStore().trigger({
		hoverable: true,
		message: `
      <h3>${failMessage}</h3>
      <p>${errorMessage}</p>
      `,
		background: 'bg-error-500'
	});
}

export function Partition<T>(
	arr: T[],
	comparator: (e: T) => boolean
): [T[], T[]] {
	const trueArr: T[] = [];
	const falseArr: T[] = [];

	for (const item of arr) {
		if (comparator(item)) {
			trueArr.push(item);
		} else {
			falseArr.push(item);
		}
	}

	return [trueArr, falseArr];
}

export type Rename<T, K extends keyof T, N extends string> = Pick<
	T,
	Exclude<keyof T, K>
> & {
	[P in N]: T[K];
};

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export function enumKeys<E extends object>(e: E): (keyof E)[] {
	return Object.keys(e) as (keyof E)[];
}
export function enumValues<E extends object>(e: E): E[keyof E][] {
	return Object.values(e) as E[keyof E][];
}
export function enumEntries<E extends object>(e: E): [keyof E, E[keyof E]][] {
	return Object.entries(e) as [keyof E, E[keyof E]][];
}

export function groupBy<T extends object, K extends string>(
	list: T[],
	keyGetter: (item: T) => K
): [K, T[]][] {
	const map = new Map<K, T[]>();
	for (const item of list) {
		const key = keyGetter(item);
		const collection = map.get(key);
		if (!collection) {
			map.set(key, [item]);
		} else {
			collection.push(item);
		}
	}

	return Array.from(map);
}

export function setSettings(
	settings: VariablesOf<typeof setServerSettings>['settings']
) {
	ErrorHelp(
		'failed to set server settings',
		client.mutation(setServerSettings, { settings }).toPromise()
	);
}

export function GetEnumArray(EnumName: string): string[] {
	const tmp = introspection.__schema.types.find(
		(x) => x.name === EnumName && x.kind === 'ENUM'
	);
	if (!isENUM(tmp)) {
		throw new Error('Enum not found');
	}
	return tmp.enumValues.map((e) => e.name);
}

type hasEnumVals = {
	enumValues: {
		name: string;
	}[];
};

function isENUM(enu: unknown): enu is hasEnumVals {
	return enu instanceof Object && 'enumValues' in enu;
}

export function formatDate(date: Date) {
	const diff = new Date().valueOf() - date.valueOf(); // the difference in milliseconds
	const msPerMinute = 60 * 1000;
	const msPerHour = msPerMinute * 60;
	const msPerDay = msPerHour * 24;
	const msPerMonth = msPerDay * 30;
	const msPerYear = msPerDay * 365;

	if (date.toDateString() === new Date().toDateString()) {
		return date.toLocaleTimeString();
	}
	if (diff < msPerMinute) {
		return Math.round(diff / 1000) + ' seconds ago';
	} else if (diff < msPerHour) {
		return Math.round(diff / msPerMinute) + ' minutes ago';
	} else if (diff < msPerDay) {
		return Math.round(diff / msPerHour) + ' hours ago';
	} else if (diff < msPerMonth) {
		return Math.round(diff / msPerDay) + ' days ago';
	} else if (diff < msPerYear) {
		return Math.round(diff / msPerMonth) + ' months ago';
	} else {
		return Math.round(diff / msPerYear) + ' years ago';
	}

	return date.toLocaleString();
}

export type queryStateReturn<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Data = any,
	Variables extends AnyVariables = AnyVariables
> = {
	get value(): OperationResultState<Data, Variables>;
	get isPaused$(): boolean;
	pause(): void;
	resume(): void;
	reexecute(context: Partial<OperationContext>): void;
};

export function queryState<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Data = any,
	Variables extends AnyVariables = AnyVariables
>(args: QueryArgs<Data, Variables>): queryStateReturn<Data, Variables> {
	const store = queryStore(args);
	let queryState = $state(get(store));
	let isPaused = $state(get(store.isPaused$));

	store.subscribe((value) => {
		// i dont like this but i think its nessessary
		if (JSON.stringify(value) === JSON.stringify(untrack(() => queryState)))
			return;
		queryState = value;
	});
	store.isPaused$.subscribe((value) => {
		isPaused = value;
	});

	return {
		get value() {
			return queryState;
		},
		get isPaused$() {
			return isPaused;
		},
		pause: store.pause,
		resume: store.resume,
		reexecute: store.reexecute
	};
}

const initialResult = {
	operation: undefined,
	fetching: false,
	data: undefined,
	error: undefined,
	extensions: undefined,
	hasNext: false,
	stale: false
};

export function mutationState<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Data = any,
	Variables extends AnyVariables = AnyVariables
>(args: MutationArgs<Data, Variables>) {
	const request = createRequest<Data, Variables>(
		args.query,
		args.variables as Variables
	);
	const operation = args.client.createRequestOperation<Data, Variables>(
		'mutation',
		request,
		args.context
	);
	const state = $state<OperationResultState<Data, Variables>>({
		...initialResult,
		operation,
		fetching: true
	});
	try {
		args.client
			.mutation(args.query, args.variables, args.context)
			.toPromise()
			.then((res) => {
				state.fetching = false;
				state.data = res.data;
				state.error = res.error;
				state.extensions = res.extensions;
				state.hasNext = res.hasNext;
				state.stale = res.stale;
			});
	} catch (error) {
		state.fetching = false;
		if (error instanceof CombinedError) {
			state.error = error;
		}
	}

	return {
		get data() {
			return state.data;
		},
		get error() {
			return state.error;
		},
		get fetching() {
			return state.fetching;
		},
		get extensions() {
			return state.extensions;
		},
		get hasNext() {
			return state.hasNext;
		},
		get stale() {
			return state.stale;
		}
	};
}

export type subscriptionStateReturn<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Data = any,
	Variables extends AnyVariables = AnyVariables
> = {
	get value(): OperationResultState<Data, Variables>;
	get isPaused$(): boolean;
	pause(): void;
	resume(): void;
};

export function subscriptionState<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Data = any,
	Variables extends AnyVariables = AnyVariables
>(
	args: SubscriptionArgs<Data, Variables>
): subscriptionStateReturn<Data, Variables> {
	const store = subscriptionStore(args);
	let queryState = $state(get(store));
	let isPaused = $state(get(store.isPaused$));

	store.subscribe((value) => {
		queryState = value;
	});
	store.isPaused$.subscribe((value) => {
		isPaused = value;
	});

	return {
		get value() {
			return queryState;
		},
		get isPaused$() {
			return isPaused;
		},
		pause: store.pause,
		resume: store.resume
	};
}

export function OTT<T>(these: unknown[], fn: () => T): T {
	const _ = [...these];
	return untrack(fn);
}
