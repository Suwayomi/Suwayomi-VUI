/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { fetcher } from 'src/boot/fetcher';

/**
 * It fetches an image from a URL, converts it to a blob, converts the blob to a data URL, and returns
 * the data URL
 * @param {string} imgUrl - The URL of the image you want to get the blob of.
 * @returns A promise that resolves to a string.
 */
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
