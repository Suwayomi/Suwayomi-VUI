/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { EventBus } from 'quasar';
import { boot } from 'quasar/wrappers';

export default boot(({ app }) => {
  const bus = new EventBus();

  // for Options API
  // for Options API
  app.config.globalProperties['$bus'] = bus;

  // for Composition API
  app.provide('bus', bus);
});

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $bus: EventBus;
  }
}
