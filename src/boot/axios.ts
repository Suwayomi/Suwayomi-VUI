/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { boot } from 'quasar/wrappers';
import axios from 'axios';
import { storeGet } from './StoreStuff';
import getEnv from 'src/getenv';

let api = axios.create({
  baseURL: storeGet(
    'baseUrl',
    getEnv('TachideskURL') ? getEnv('TachideskURL') : location.origin
  ) as string,
});

export default boot(({ app }) => {
  app.config.globalProperties['$axios'] = axios;
  app.config.globalProperties['$api'] = api;
  resetAxiosAuth();
});

export function resetAxiosBase() {
  api = axios.create({
    baseURL: storeGet(
      'baseUrl',
      getEnv('TachideskURL') ? getEnv('TachideskURL') : location.origin
    ) as string,
  });
}

export function resetAxiosAuth() {
  const auth = <{ username: string; password: string } | null>storeGet('auth');
  if (auth != null) {
    api.defaults.headers.common['Authorization'] = `Basic ${btoa(
      auth.username + ':' + auth.password
    )}`;
  } else {
    api.defaults.headers.common['Authorization'] = undefined;
  }
}

export { axios, api };

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: typeof axios;
    $api: typeof api;
  }
}
