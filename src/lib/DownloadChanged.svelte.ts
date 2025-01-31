// Copyright (c) 2024 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { browser } from '$app/environment';
import { DownloadChanged as getDownloadChanged } from '$lib/gql/Subscriptions';
import { client } from '$lib/gql/graphqlClient';
import type { ResultOf } from 'gql.tada';
import { subscriptionState, type subscriptionStateReturn } from './util.svelte';
import { untrack } from 'svelte';

const downloadSet = new Set([
	'QUEUED',
	'PROGRESS',
	'FINISHED',
	'ERROR',
	'POSITION',
	'PAUSED',
	'STOPPED'
]);

class DownloadChanged {
	#cleanup = () => {};
	#state:
		| subscriptionStateReturn<ResultOf<typeof getDownloadChanged>>
		| undefined = $state();
	#store:
		| NonNullable<
				ResultOf<typeof getDownloadChanged>['downloadStatusChanged']['initial']
		  >
		| undefined = $state();

	restart() {
		this.pause?.();
		this.#cleanup();
		this.#state = subscriptionState({
			query: getDownloadChanged,
			client
		});
		this.#cleanup = $effect.root(() => {
			$effect(() => {
				if (!this.#state?.data) {
					this.#store = undefined;
					return;
				}
				if (this.#state?.data.downloadStatusChanged.initial !== null) {
					this.#store = this.#state.data.downloadStatusChanged.initial;
					return;
				}
				untrack(() => {
					this.#store = this.#store?.filter(
						(item) => item.state !== 'FINISHED'
					);

					this.#state?.data?.downloadStatusChanged.updates.forEach((update) => {
						if (this.#store === undefined && downloadSet.has(update.type)) {
							this.#store = [update.download];
							return;
						}
						if (this.#store === undefined) return;
						if (downloadSet.has(update.type)) {
							if (update.type !== 'QUEUED') {
								const index = this.#store.findIndex(
									(item) => item.chapter.id === update.download.chapter.id
								);
								if (index !== -1) {
									this.#store[index] = update.download;
									return;
								}
							}
							this.#store.push(update.download);
							return;
						}
						if (update.type === 'DEQUEUED') {
							this.#store = this.#store.filter(
								(item) => item.chapter.id !== update.download.chapter.id
							);
							return;
						}
					});
					this.#store = this.#store?.toSorted((a, b) =>
						a.position > b.position ? 1 : -1
					);
				});
			});
		});
	}

	constructor() {
		if (!browser) return;
		this.restart();
		document.addEventListener('visibilitychange', () => {
			if (document.visibilityState === 'visible') {
				this.restart();
			}
		});
	}

	get status() {
		return this.#state?.data?.downloadStatusChanged.state;
	}
	get downlaods() {
		return this.#store;
	}
	get error() {
		return this.#state?.error;
	}
	get pause() {
		return this.#state?.pause;
	}
	get resume() {
		return this.#state?.resume;
	}
	get stale() {
		return this.#state?.stale;
	}
}

export const downloadChanged = new DownloadChanged();
