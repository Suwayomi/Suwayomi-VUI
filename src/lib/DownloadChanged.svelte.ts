// Copyright (c) 2024 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { browser } from '$app/environment';
import { DownloadChanged as getDownloadChanged } from '$lib/gql/Subscriptions';
import { client } from '$lib/gql/graphqlClient';
import { subscriptionStore } from '@urql/svelte';
import type { ResultOf } from 'gql.tada';

class DownloadChanged {
	store:
		| NonNullable<
				ResultOf<typeof getDownloadChanged>['downloadStatusChanged']['initial']
		  >
		| undefined = $state();
	status:
		| ResultOf<typeof getDownloadChanged>['downloadStatusChanged']['state']
		| undefined = $state();
	fetching = $state();
	error = $state();
	private unSub = () => {};
	private pause = () => {};

	constructor() {
		if (!browser) return;
		this.restart();
		document.onvisibilitychange = () => {
			if (document.visibilityState === 'visible') {
				this.restart();
			}
		};
	}

	restart() {
		this.pause();
		this.unSub();
		const SubStore = subscriptionStore({
			query: getDownloadChanged,
			client
		});
		this.pause = SubStore.pause;
		this.unSub = SubStore.subscribe((result) => {
			this.error = result.error;
			this.fetching = result.fetching;
			if (!result.data) {
				this.store = undefined;
				return;
			}
			this.status = result.data.downloadStatusChanged.state;
			if (result.data.downloadStatusChanged.initial !== null) {
				this.store = result.data.downloadStatusChanged.initial;
				return;
			}

			this.store = this.store?.filter((item) => item.state !== 'FINISHED');

			result.data.downloadStatusChanged.updates.forEach((update) => {
				if (
					this.store === undefined &&
					['QUEUED', 'PROGRESS', 'FINISHED', 'ERROR', 'POSITION'].includes(
						update.type
					)
				) {
					this.store = [update.download];
					return;
				}
				if (this.store === undefined) return;
				if (
					['PROGRESS', 'FINISHED', 'ERROR', 'POSITION'].includes(update.type)
				) {
					const index = this.store.findIndex(
						(item) => item.chapter.id === update.download.chapter.id
					);
					if (index !== -1) {
						this.store[index] = update.download;
						return;
					}
					this.store.push(update.download);
					return;
				}
				if (update.type === 'QUEUED') {
					this.store.push(update.download);
					return;
				}
				if (update.type === 'DEQUEUED') {
					this.store = this.store.filter(
						(item) => item.chapter.id !== update.download.chapter.id
					);
					return;
				}
			});

			this.store?.sort((a, b) => (a.position > b.position ? 1 : -1));
		});
	}
}

export const downloadChanged = new DownloadChanged();
