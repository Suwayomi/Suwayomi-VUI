// Copyright (c) 2023 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

declare let self: ServiceWorkerGlobalScope;

import { build, files, version } from '$service-worker';

const CACHE = `cache-${version}`;
const ASSETS = [...files, ...build];

self.addEventListener('install', (event) => {
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}

	event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
	event.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', (event) => {
	const openCache = caches.open(CACHE);
	const url = new URL(event.request.url);
	if (url.protocol !== 'https:' && url.protocol !== 'http:') return;

	if (event.request.method === 'POST' && event.request.url.includes('/api/graphql')) {
		respondGQL();
		return;
	}

	if (event.request.method === 'GET') {
		respondGET();
		return;
	}

	function respondGQL() {
		function respondGQL2() {
			async function responce() {
				const resp = await networkResponse;
				if (resp.status === 401) {
					const client = await self.clients.get(event.clientId);
					if (client) {
						client.postMessage({ type: 'auth401' });
					}
				}

				//general Responce, network first
				try {
					return await networkResponse;
				} catch (error) {
					const cache = await openCache;
					const queryId = await generateQueryId;
					const cachedResult = queryId && (await cache.match(queryId));
					if (cachedResult) {
						return cachedResult;
					}
				}
				return Response.json(
					{
						errors: [
							{
								message:
									"You are offline (or the server is) and this data hasn't been cached, please try again.",
								path: ['cache']
							}
						]
					},
					{ status: 200 }
				);
			}
			async function cacheResponse() {
				try {
					if (url.protocol !== 'https:' && url.protocol !== 'http:') return;
					const responce = await networkResponse;
					const clone = responce.clone();
					const queryId = await generateQueryId;
					if (queryId) {
						const cache = await openCache;
						await cache.put(queryId, clone);
					}
				} catch {}
			}

			event.respondWith(responce());
			event.waitUntil(cacheResponse());
		}

		const generateQueryId = event.request
			.clone()
			.json()
			.then(async ({ query, operationName, variables }) => {
				// skip mutation caching...
				if (query.startsWith('mutation') || query.startsWith('subscription')) {
					return null;
				}

				// Mocks a request since `caches` only works with requests.
				return `https://GQL?Q=${JSON.stringify({ operationName, variables }).toString()}`;
			});
		const networkResponse = fetch(event.request);
		respondGQL2();
	}

	function respondGET() {
		const networkResponse = fetch(event.request);

		let putToCache = async (clone: Response, cache: Cache) => {
			await cache.put(event.request, clone);
		};

		// given event return appropriate Response
		async function responce() {
			// static assets/thumbnails, cache first
			if (ASSETS.includes(url.pathname) || url.pathname.endsWith('thumbnail')) {
				const cache = await openCache;
				const cachedResponce = await cache.match(event.request);
				if (cachedResponce) {
					return cachedResponce;
				}
			}

			// the main html page, cache first
			if (
				(url.protocol === 'https:' || url.protocol === 'http:') &&
				!url.pathname.startsWith('/api') &&
				!url.pathname.includes('vite') &&
				!url.pathname.includes('svelte') &&
				!url.pathname.includes('/src/') &&
				!url.pathname.includes('.json') &&
				!url.pathname.endsWith('.png')
			) {
				const cache = await openCache;
				const cachedResponce = await cache.match('/');
				putToCache = async (clone: Response, cache: Cache) => {
					await cache.put('/', clone);
				};
				if (cachedResponce) {
					return cachedResponce;
				}
			}

			//general Responce, network first
			try {
				return await networkResponse;
			} catch (error) {
				const cache = await openCache;
				const cachedResponce = await cache.match(url.pathname);
				if (cachedResponce) {
					return cachedResponce;
				}
			}
			return new Response('not Found', { status: 404 });
		}

		//Caches the network response.
		async function cacheResponse() {
			try {
				const responce = await networkResponse;
				const clone = responce.clone();
				const cache = await openCache;
				await putToCache(clone, cache);
			} catch {}
		}

		event.respondWith(responce());
		event.waitUntil(cacheResponse());
	}

	return;
});

self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
	if (event.data && event.data.type === 'clearCache') {
		event.waitUntil(clearCache());
	}
});

async function deleteOldCaches() {
	for (const key of await caches.keys()) {
		if (key !== CACHE) await caches.delete(key);
	}
}

async function clearCache() {
	await caches.delete(CACHE);
}
