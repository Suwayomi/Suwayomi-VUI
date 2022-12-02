/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { LocalStorage } from 'quasar';
import { ref } from 'vue';
import { storeSet } from 'src/boot/StoreStuff';

type bnn = boolean | null;

type disp = 'source' | 'chapter';

const Unread = ref(<bnn>null);
const Downloaded = ref(<bnn>null);
const Bookmarked = ref(<bnn>null);
const Source = ref(<bnn>null);
const FetchDate = ref(<bnn>null);
const Display = ref(<disp>'source');

export function chaptersFilter(mangaID: number) {
  Unread.value = <bnn>LocalStorage.getItem(`${mangaID}ChUnread`);
  Downloaded.value = <bnn>LocalStorage.getItem(`${mangaID}ChDownloaded`);
  Bookmarked.value = <bnn>LocalStorage.getItem(`${mangaID}ChBookmarked`);
  Source.value = <bnn>LocalStorage.getItem(`${mangaID}ChSource`);
  FetchDate.value = <bnn>LocalStorage.getItem(`${mangaID}ChFetchDate`);
  Display.value = <disp>LocalStorage.getItem(`${mangaID}ChDisplay`);

  const setUnread = function (value: bnn) {
    if (value == null) LocalStorage.remove(`${mangaID}ChUnread`);
    else LocalStorage.set(`${mangaID}ChUnread`, value);
    Unread.value = value;
  };
  const setDownloaded = function (value: bnn) {
    storeSet(`${mangaID}ChDownloaded`, value);
    Downloaded.value = value;
  };
  const setBookmarked = function (value: bnn) {
    storeSet(`${mangaID}ChBookmarked`, value);
    Bookmarked.value = value;
  };
  const setSource = function (value: bnn) {
    if (value != null) {
      storeSet(`${mangaID}ChSource`, value);
      LocalStorage.remove(`${mangaID}ChFetchDate`);
    }
    Source.value = value;
  };
  const setFetchDate = function (value: bnn) {
    if (value != null) {
      storeSet(`${mangaID}ChFetchDate`, value);
      LocalStorage.remove(`${mangaID}ChSource`);
    }
    FetchDate.value = value;
  };
  const setDisplay = function (value: 'source' | 'chapter') {
    storeSet(`${mangaID}ChDisplay`, value, 'source');
    Display.value = value;
  };

  // needs a default if no sort is set
  if (Source.value == null && FetchDate.value == null) Source.value = false;
  if (Display.value == null) Display.value = 'source';

  return {
    Unread,
    Downloaded,
    Bookmarked,
    Source,
    FetchDate,
    Display,
    setUnread,
    setDownloaded,
    setBookmarked,
    setSource,
    setFetchDate,
    setDisplay,
  };
}
