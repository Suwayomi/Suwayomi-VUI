<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->

<template>
  <ETB></ETB>
  <q-btn flat round icon="travel_explore" to="/sources/Global/"></q-btn>
</template>

<script lang="ts">
import ETB from 'src/components/extantions/TopBar.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ExtTopBar',
  components: { ETB },
  setup() {
    return {};
  },
});
</script>
