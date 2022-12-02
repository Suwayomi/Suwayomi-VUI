/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ref } from 'vue';
import { storeGet, storeSet } from 'src/boot/StoreStuff';

const langs = ref(<string[]>[
  ...(<string[]>storeGet('ExtLangFilt', [])),
  'all',
  'updates pending',
  'installed',
]);
const currlangs = ref(<string[]>[]);

export default function useInBar() {
  const setlangs = (data: string[]) => {
    storeSet(
      'ExtLangFilt',
      data.filter((e) => !['all', 'updates pending', 'installed'].includes(e)),
      []
    );
    langs.value = [...data];
  };

  const setcurrlangs = (data: string[]) => {
    currlangs.value = data;
  };

  return {
    setcurrlangs,
    currlangs,
    setlangs,
    langs,
  };
}
