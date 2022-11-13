/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { LocalStorage } from 'quasar';
import { fetcher } from 'src/boot/fetcher';

export function storeSet(
  key: string,
  data: null | unknown,
  set: unknown = null
): void {
  if (data == set) LocalStorage.remove(key);
  else LocalStorage.set(key, data);
}

export async function getImgBlob(imgUrl: string): Promise<string> {
  const resp = await fetcher(imgUrl);
  if (resp.status == 200) {
    const blob = await resp.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return await new Promise((resolve) => {
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
    });
  } else {
    return new Promise((resolve) => {
      resolve('');
    });
  }
}
