<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <SearchBar></SearchBar>
  <q-btn flat class="q-ml-sm" round icon="filter_list" @click="dial = true" />
  <q-dialog v-model="dial">
    <q-card>
      <q-card-section>
        <div class="text-h6">Enabled Languages</div>
      </q-card-section>
      <q-separator />
      <q-card-section
        class="q-pt-none"
        style="max-height: 30vh; overflow-y: auto"
      >
        <q-card-section
          v-for="(filt, index) in filters.currlangs"
          :key="index"
          class="q-pa-none"
        >
          <q-item class="row justify-between q-pa-none" style="width: 100%">
            <q-item-section>
              <q-item-label>{{ langCodeToName(filt) }}</q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-toggle v-model="curr" color="blue" :val="filt" />
            </q-item-section>
          </q-item>
        </q-card-section>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn v-close-popup flat label="OK" color="primary" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import useInBar from './Filters';
import SearchBar from 'src/components/global/SearchBar.vue';
import { langCodeToName } from './language';

export default defineComponent({
  name: 'ExtTopBar',
  components: { SearchBar },
  setup() {
    const filters = ref(useInBar());
    const curr = ref(filters.value.langs);
    const dial = ref(false);
    return { filters, dial, curr, langCodeToName };
  },
  watch: {
    curr() {
      this.filters.setlangs(this.curr);
    },
  },
});
</script>
