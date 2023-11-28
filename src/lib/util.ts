// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { ToastStore } from '@skeletonlabs/skeleton';
import { get, type Writable } from 'svelte/store';
import { deleteDownloadedChapters, enqueueChapterDownloads, updateChapters } from './generated';
import type { FetchResult } from '@apollo/client/link/core';

export type TriState = 0 | 1 | 2;

export function HelpDoSelect<T extends { id: number }>(
	update: T,
	e: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement },
	lastselected: T | undefined,
	all: T[] | undefined,
	selected: Writable<T[]>
) {
	let ids = [update];
	if (e && e.shiftKey) {
		const chaps = all;
		const thisone = chaps?.findIndex((ele) => ele.id === update.id);
		const lastone = chaps?.findIndex((ele) => ele.id === lastselected?.id);
		if (thisone !== undefined && lastone !== undefined && chaps !== undefined) {
			const biger = lastone > thisone;
			ids = chaps.slice(biger ? thisone : lastone, (biger ? lastone : thisone) + 1);
		}
	}
	lastselected = update;
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
	return lastselected;
}

export function HelpSelectall<T extends { id: number }>(
	selectmode: Writable<boolean>,
	selected: Writable<T[]>,
	sortedMangas: T[] | undefined
) {
	selectmode.set(true);
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

export async function HelpUpdateChapters<
	T extends { id: number; isBookmarked: boolean; isDownloaded: boolean; isRead: boolean }
>(param: dlreabook, selected: Writable<T[]>, toastStore: ToastStore) {
	const ids = get(selected)
		.filter((e) => e)
		.map((e) => e.id);
	let is = true;
	if (ids)
		switch (param) {
			case dlreabook.bookmark:
				is = !get(selected).filter((e) => e)[0].isBookmarked;
				Errorhelp(
					'failed to update Bookmark status',
					updateChapters({
						variables: {
							isBookmarked: is,
							ids
						}
					}),
					toastStore
				);
				return is;
			case dlreabook.download:
				is = get(selected).filter((e) => e)[0].isDownloaded;
				if (is) {
					Errorhelp(
						'failed to delete Downloaded chapters',
						deleteDownloadedChapters({ variables: { ids } }),
						toastStore
					);
				} else {
					Errorhelp(
						'failed to enqueue chapters Downloads',
						enqueueChapterDownloads({ variables: { ids } }),
						toastStore
					);
				}
				return !is;
			default:
				is = !get(selected).filter((e) => e)[0].isRead;
				Errorhelp(
					'failed to update Read status',
					updateChapters({
						variables: {
							isRead: !get(selected).filter((e) => e)[0].isRead,
							ids
						}
					}),
					toastStore
				);
				return is;
		}
}

export async function Errorhelp<T>(
	failmsg: string,
	func: Promise<FetchResult<T>>,
	toastStore: ToastStore,
	callback: (result: FetchResult<T>) => void = () => {}
) {
	try {
		const responce = await func;
		if (responce.errors) {
			responce.errors.forEach((e) => console.error(e));
			errortoast(toastStore, failmsg, JSON.stringify(responce.errors));
			return;
		}
		callback(responce);
	} catch (error) {
		console.error(error);
		if (error instanceof Error) {
			errortoast(toastStore, failmsg, error.message);
		}
	}
}

export async function ErrorhelpUntyped(
	failmsg: string,
	toastStore: ToastStore,
	...func: Promise<FetchResult<unknown>>[]
) {
	try {
		const results = await Promise.all(func);
		results.forEach((e) => {
			if (e.errors) {
				errortoast(toastStore, failmsg, JSON.stringify(e.errors));
			}
		});
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			errortoast(toastStore, failmsg, JSON.stringify(error));
		}
	}
}

export const gridValues =
	'xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-8 3xl:grid-cols-10';

export function errortoast(toastStore: ToastStore, failmsg: string, errorMessage: string) {
	toastStore.trigger({
		hoverable: true,
		message: `
      <h3>${failmsg}</h3>
      <p>${errorMessage}</p>
      `,
		background: 'bg-error-500'
	});
}

export function Partition<T>(arr: T[], comparator: (e: T) => boolean) {
	return arr.reduce(
		(a, c) => {
			if (comparator(c)) a[0].push(c);
			else a[1].push(c);
			return a;
		},
		[[], []] as [T[], T[]]
	);
}

export type Rename<T, K extends keyof T, N extends string> = Pick<T, Exclude<keyof T, K>> & {
	[P in N]: T[K];
};
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export function enumKeys<E>(e: E & object): (keyof E)[] {
	return Object.keys(e) as (keyof E)[];
}

export function groupBy<T extends { [key: string]: unknown }>(
	list: T[],
	keyGetter: (item: T) => T[keyof T]
): [string, T[]][] {
	const map = new Map();
	list.forEach((item) => {
		const key = keyGetter(item);
		const collection = map.get(key);
		if (!collection) {
			map.set(key, [item]);
		} else {
			collection.push(item);
		}
	});
	return Array.from(map);
}
