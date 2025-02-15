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
const ImageCache = `cache-image`;
const ASSETS = [...files, ...build];

self.addEventListener('install', (event) => {
	async function addFilesToCache() {
		await caches.open(CACHE);
		// await cache.addAll(ASSETS);
	}

	event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
	event.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', (event) => {
	const url = new URL(event.request.url);
	if (url.protocol !== 'https:' && url.protocol !== 'http:') return;

	// if (event.request.method === 'POST' && event.request.url.includes('/api/graphql')) {
	// 	respondGQL(event);
	// 	return;
	// }

	if (event.request.method === 'GET') {
		respondGET(event);
		return;
	}
	return;
});

self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
	if (event.data && event.data.type === 'clearCache') {
		event.waitUntil(
			(async () => {
				await clearCache();
				await clearCache(ImageCache);
			})()
		);
	}
	if (event.data && event.data.type === 'clearCachedImages') {
		event.waitUntil(clearCache(ImageCache));
	}
});

// function respondGQL(event: FetchEvent) {
// 	const generateQueryId = event.request
// 		.clone()
// 		.json()
// 		.then(async ({ query, operationName, variables }) => {
// 			// skip mutation caching...
// 			if (query.startsWith('mutation') || query.startsWith('subscription')) {
// 				return null;
// 			}

// 			// Mocks a request since `caches` only works with requests.
// 			return `https://GQL?Q=${JSON.stringify({ operationName, variables }).toString()}`;
// 		});
// 	const url = new URL(event.request.url);
// 	const openCache = caches.open(CACHE);
// 	const networkResponse = fetch(event.request);

// 	async function response() {
// 		try {
// 			const resp = await networkResponse;
// 			if (resp.status === 401) {
// 				const client = await self.clients.get(event.clientId);
// 				if (client) {
// 					client.postMessage({ type: 'auth401' });
// 				}
// 			}
// 		} catch {}

// 		//general Response, network first
// 		try {
// 			return await networkResponse;
// 		} catch (error) {
// 			const cache = await openCache;
// 			const queryId = await generateQueryId;
// 			const cachedResult = queryId && (await cache.match(queryId));
// 			if (cachedResult) {
// 				return cachedResult;
// 			}
// 		}
// 		return Response.json(
// 			{
// 				errors: [
// 					{
// 						message:
// 							"You are offline (or the server is) and this data hasn't been cached, please try again.",
// 						path: ['cache']
// 					}
// 				]
// 			},
// 			{ status: 200 }
// 		);
// 	}
// 	async function cacheResponse() {
// 		try {
// 			if (url.protocol !== 'https:' && url.protocol !== 'http:') return;
// 			const response = (await networkResponse).clone();
// 			const queryId = await generateQueryId;
// 			if (queryId) {
// 				const cache = await openCache;
// 				await cache.put(queryId, response);
// 			}
// 		} catch {}
// 	}

// 	event.respondWith(response());
// 	event.waitUntil(cacheResponse());
// }

function respondGET(event: FetchEvent) {
	const url = new URL(event.request.url);
	// const openCache = caches.open(CACHE);
	const openImageCache = caches.open(ImageCache);
	const networkResponse = fetch(event.request);

	// given event return appropriate Response
	async function response() {
		// static assets, cache first
		// if (ASSETS.includes(url.pathname)) {
		// 	const cache = await openCache;
		// 	const cachedResponse = await cache.match(event.request);
		// 	if (cachedResponse) {
		// 		return cachedResponse;
		// 	}
		// }

		// thumbnails, cache first
		if (
			url.pathname.endsWith('thumbnail') ||
			url.pathname.startsWith('/api/v1/extension/icon/')
		) {
			const imageCache = await openImageCache;
			const cachedResponse = await imageCache.match(event.request);
			if (cachedResponse) {
				return cachedResponse;
			}
		}

		// the main html page, cache first
		// if (event.request.referrer === url.href) {
		// 	const cache = await openCache;
		// 	const cachedResponse = await cache.match('/');
		// 	putToCache = async (clone: Response, cache: Cache) => {
		// 		await cache.put('/', clone);
		// 	};
		// 	if (cachedResponse) {
		// 		return cachedResponse;
		// 	}
		// }

		//general Response, no-cache
		try {
			return await networkResponse;
		} catch {
			return new Response('not Found', { status: 404 });
		}
	}

	//Caches the network response.
	async function cacheResponse() {
		try {
			if (
				url.pathname.endsWith('thumbnail') ||
				url.pathname.startsWith('/api/v1/extension/icon/')
			) {
				const response = await networkResponse;
				const clone = response.clone();
				await (await openImageCache).put(event.request, clone);
			}
		} catch {}
	}

	event.respondWith(response());
	event.waitUntil(cacheResponse());
}

async function deleteOldCaches() {
	for (const key of await caches.keys()) {
		if (key !== CACHE && key !== ImageCache) await caches.delete(key);
	}
}

async function clearCache(cacheName: string = CACHE) {
	const cache = await caches.open(cacheName);
	const keys = await cache.keys();
	keys.forEach(async (key) => {
		await cache.delete(key);
	});
	if (cacheName === CACHE) {
		await cache.addAll(ASSETS);
	}
}
