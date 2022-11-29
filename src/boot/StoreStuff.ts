/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { boot } from 'quasar/wrappers';
import { LocalStorage } from 'quasar';

/**
 * If the data is the same as the default, remove the key from local storage, otherwise set the key to
 * the data.
 * @param {string} key - The key to store the data under.
 * @param {null | unknown} data - The data to store.
 * @param {unknown} [setDefault=null] - The default value to set if the data is null.
 */
export function storeSet(
  key: string,
  data: null | unknown,
  setDefault: unknown = null
): void {
  if (data == setDefault) LocalStorage.remove(key);
  else LocalStorage.set(key, data);
}

/**
 * If the key exists in local storage, return the value, otherwise return the default value.
 * @param {string} key - The key to store the value under.
 * @param {unknown} getDefault - The default value to return if the key doesn't exist.
 * @returns The value of the key in local storage, or the default value if the key is not found.
 */
export function storeGet(key: string, getDefault: unknown = null): unknown {
  const tmp = LocalStorage.getItem(key);
  return tmp === null ? getDefault : tmp;
}

export default boot(({ app }) => {
  // for Options API
  app.config.globalProperties['$storeSet'] = storeSet;
  app.config.globalProperties['$storeGet'] = storeGet;

  // for Composition API
  app.provide('storeSet', storeSet);
  app.provide('storeGet', storeGet);
});

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $storeSet: typeof storeSet;
    $storeGet: typeof storeGet;
  }
}
