/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ref } from 'vue';
import { LocalStorage } from 'quasar';
import { storeGet, storeSet } from 'src/boot/StoreStuff';

const unread = ref(<Boon>LocalStorage.getItem('lbUnread'));
const downloaded = ref(<Boon>LocalStorage.getItem('lbDownloaded'));

const leftToRead = ref(<Boon>LocalStorage.getItem('lbLeftToRead'));
const alphabetical = ref(<Boon>LocalStorage.getItem('lbAlphabetical'));
const lastRead = ref(<Boon>LocalStorage.getItem('lbLastRead'));
const tmp = LocalStorage.getItem('lbByid');
const ByID = ref(
  <Boon>leftToRead.value === null && alphabetical.value === null && tmp === null
    ? true
    : LocalStorage.getItem('lbByid')
);

const Ubadge = ref(<boolean>storeGet('Ubadge', true));
const Dbadge = ref(<boolean>storeGet('Dbadge', true));

const Display = ref(<Boon>LocalStorage.getItem('lbDisplay'));

type Boon = boolean | null;

export default function useInBar() {
  const setUnread = (data: Boon) => {
    storeSet('lbUnread', data);
    unread.value = data;
  };
  const setDownloaded = (data: Boon): void => {
    storeSet('lbDownloaded', data);
    downloaded.value = data;
  };
  const setDisplay = (data: Boon) => {
    storeSet('lbDisplay', data);
    Display.value = data;
  };

  const setUbadge = (data: boolean) => {
    storeSet('Ubadge', data, true);
    Ubadge.value = data;
  };
  const setDbadge = (data: boolean) => {
    storeSet('Dbadge', data, true);
    Dbadge.value = data;
  };

  const setLeftToRead = (data: Boon) => {
    if (data != null) {
      storeSet('lbLeftToRead', data);
      storeSet('lbAlphabetical', null);
      storeSet('lbLastRead', null);
      storeSet('lbByid', null);
    }
    leftToRead.value = data;
  };
  const setAlphabetical = (data: Boon | null) => {
    if (data != null) {
      storeSet('lbLeftToRead', null);
      storeSet('lbAlphabetical', data);
      storeSet('lbLastRead', null);
      storeSet('lbByid', null);
    }
    alphabetical.value = data;
  };
  const setLastRead = (data: Boon | null) => {
    if (data != null) {
      storeSet('lbLeftToRead', null);
      storeSet('lbAlphabetical', null);
      storeSet('lbLastRead', data);
      storeSet('lbByid', null);
    }
    lastRead.value = data;
  };
  const setByID = (data: Boon | null) => {
    if (data != null) {
      storeSet('lbLeftToRead', null);
      storeSet('lbAlphabetical', null);
      storeSet('lbLastRead', null);
      storeSet('lbByid', data);
    }
    ByID.value = data;
  };

  return {
    setUnread,
    setDownloaded,
    setLeftToRead,
    setAlphabetical,
    setLastRead,
    setByID,
    setDisplay,
    setUbadge,
    setDbadge,
    unread,
    downloaded,
    leftToRead,
    alphabetical,
    lastRead,
    ByID,
    Display,
    Ubadge,
    Dbadge,
  };
}
