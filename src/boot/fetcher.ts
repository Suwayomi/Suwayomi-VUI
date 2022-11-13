/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { boot } from 'quasar/wrappers';
import { LocalStorage } from 'quasar';
let base = LocalStorage.getItem('baseUrl') as string;

export function authOptions(options: RequestInit | undefined = undefined) {
  const update = { ...options };
  const auth = <{ username: string; password: string } | null>(
    LocalStorage.getItem('auth')
  );
  if (auth != null) {
    update.headers = {
      ...update.headers,
      Authorization: `Basic ${btoa(auth.username + ':' + auth.password)}`
    };
  }
  return update;
}

export function resetBase() {
  base = LocalStorage.getItem('baseUrl') as string;
}

export function fetcher(
  url: RequestInfo | URL,
  options: RequestInit | undefined = undefined
) {
  const tmp = base + url;
  return fetch(tmp, authOptions(options));
}

export async function fetchJSON(
  url: RequestInfo | URL,
  options: RequestInit | undefined = undefined
) {
  const tmp = await fetcher(url, options);
  return tmp.json();
}

export default boot(({ app }) => {
  // for Options API
  app.config.globalProperties['$fetch'] = fetcher;
  app.config.globalProperties['$fetchJSON'] = fetchJSON;

  // for Composition API
  app.provide('fetch', fetcher);
  app.provide('fetchJSON', fetchJSON);
});

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $fetch: typeof fetcher;
    $fetchJSON: typeof fetchJSON;
  }
}
