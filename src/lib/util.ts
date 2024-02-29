// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { get, type Writable } from 'svelte/store';

import { toastStore } from './simpleStores';
import { client } from './gql/graphqlClient';
import {
	deleteDownloadedChapters,
	enqueueChapterDownloads,
	setServerSettings,
	updateChapters
} from './gql/Mutations';
import type { VariablesOf } from 'gql.tada';
import type { OperationResult } from '@urql/svelte';

export type TriState = 0 | 1 | 2;

export function HelpDoSelect<T extends { id: number }>(
	update: T,
	e: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement },
	lastSelected: T | undefined,
	all: T[] | undefined,
	selected: Writable<T[]>
) {
	let ids = [update];
	if (e && e.shiftKey) {
		const chaps = all;
		const thisone = chaps?.findIndex((ele) => ele.id === update.id);
		const lastone = chaps?.findIndex((ele) => ele.id === lastSelected?.id);
		if (thisone !== undefined && lastone !== undefined && chaps !== undefined) {
			const biger = lastone > thisone;
			ids = chaps.slice(
				biger ? thisone : lastone,
				(biger ? lastone : thisone) + 1
			);
		}
	}
	lastSelected = update;
	if (get(selected)[update.id] === undefined) {
		ids.forEach((ele) =>
			selected.update((e) => {
				e[ele.id] = ele;
				return e;
			})
		);
	} else {
		ids.forEach((ele) => {
			selected.update((e) => {
				delete e[ele.id];
				return e;
			});
		});
	}
	return lastSelected;
}

export function HelpSelectAll<T extends { id: number }>(
	selectMode: Writable<boolean>,
	selected: Writable<T[]>,
	sortedMangas: T[] | undefined
) {
	selectMode.set(true);
	if (get(selected).filter((e) => e).length === sortedMangas?.length) {
		selected.set([]);
	} else {
		sortedMangas?.forEach((ele) =>
			selected.update((n) => {
				const e = n;
				e[ele.id] = ele;
				return e;
			})
		);
	}
}

export enum dlreabook {
	download = 'download',
	read = 'read',
	bookmark = 'bookmark'
}

function getToastStore() {
	const toast = get(toastStore);
	if (!toast) {
		throw new Error('failed to get toastStore');
	}
	return toast;
}

export async function HelpUpdateChapters<
	T extends {
		id: number;
		isBookmarked: boolean;
		isDownloaded: boolean;
		isRead: boolean;
	}
>(param: dlreabook, selected: Writable<T[]>) {
	const ids = get(selected)
		.filter((e) => e)
		.map((e) => e.id);
	let is = true;
	if (ids)
		switch (param) {
			case dlreabook.bookmark:
				is = !get(selected).filter((e) => e)[0].isBookmarked;
				ErrorHelp(
					'failed to update Bookmark status',
					client
						.mutation(updateChapters, {
							isBookmarked: is,
							ids
						})
						.toPromise()
				);
				return is;
			case dlreabook.download:
				is = get(selected).filter((e) => e)[0].isDownloaded;
				if (is) {
					ErrorHelp(
						'failed to delete Downloaded chapters',
						client
							.mutation(deleteDownloadedChapters, {
								ids
							})
							.toPromise()
						// deleteDownloadedChapters({ variables: { ids } })
					);
				} else {
					ErrorHelp(
						'failed to enqueue chapters Downloads',
						client.mutation(enqueueChapterDownloads, { ids }).toPromise()
						// enqueueChapterDownloads({ variables: { ids } })
					);
				}
				return !is;
			default:
				is = !get(selected).filter((e) => e)[0].isRead;
				ErrorHelp(
					'failed to update Read status',
					client
						.mutation(updateChapters, {
							isRead: !get(selected).filter((e) => e)[0].isRead,
							ids
						})
						.toPromise()
				);
				return is;
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

export function getObjectKeys<T extends object>(obj: T): (keyof T)[] {
	return Object.keys(obj) as (keyof T)[];
}

export function getObjectEntries<T extends object>(
	obj: T
): [keyof T, T[keyof T]][] {
	return Object.entries(obj) as [keyof T, T[keyof T]][];
}

export function setSettings(
	settings: VariablesOf<typeof setServerSettings>['settings']
) {
	ErrorHelp(
		'failed to set server settings',
		client.mutation(setServerSettings, { settings }).toPromise()
	);
}
