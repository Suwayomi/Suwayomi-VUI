/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { LocalStorage, Dark } from 'quasar';
if (LocalStorage.isEmpty()) {
  LocalStorage.set('lbByid', true);
  LocalStorage.set('baseUrl', location.href);
  LocalStorage.set('useCache', true);
  LocalStorage.set('MitemW', 300);
  LocalStorage.set('dark', true);
  LocalStorage.set('ExtLangFilt', ['en']);
  Dark.set(true);
}
