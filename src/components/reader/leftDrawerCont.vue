<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <q-item
    class="row justify-between no-wrap items-center rounded-borders"
    clickable
    v-ripple
    @click="SreadMargins = !SreadMargins"
  >
    <q-item-label>Page Margins</q-item-label>
    <q-toggle color="blue" v-model="SreadMargins" />
  </q-item>
  <q-item
    class="row justify-between no-wrap items-center rounded-borders"
    clickable
    v-ripple
    @click="SreadScale = !SreadScale"
  >
    <q-item-label>Page Scale</q-item-label>
    <q-toggle color="blue" v-model="SreadScale" />
  </q-item>
  <q-item
    class="row justify-between no-wrap items-center rounded-borders"
    clickable
    v-ripple
    @click="sReadOffset = !sReadOffset"
  >
    <q-item-label>Page Offset</q-item-label>
    <q-toggle color="blue" v-model="sReadOffset" />
  </q-item>
  <q-select
    standout
    label="Reader Mode"
    v-model="SReadModel"
    :options="SReadoptions"
  >
  </q-select>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { chapterMeta } from 'src/components/reader/readerSettings';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'readerDrawerCont',
  created: function () {
    this.$watch('SReadModel', (newer: string) => {
      this.options.setRM(newer);
    });
    this.$watch('SreadMargins', (newer: boolean) => {
      this.options.setWT(newer);
    });
    this.$watch('SreadScale', (newer: boolean) => {
      this.options.setScale(newer);
    });
    this.$watch('sReadOffset', (newer: boolean) => {
      this.options.setOffset(newer);
    });
  },
  setup() {
    const route = useRoute();
    const options = chapterMeta(parseInt(`${route.params['mangaID']}`));
    const SReadModel = options.vue_RM;
    const SreadMargins = options.vue_WT;
    const SreadScale = options.vue_Scale;
    const sReadOffset = options.vue_Offset;
    return {
      SreadMargins,
      SreadScale,
      SReadModel,
      SReadoptions: ['RTL', 'LTR', 'SinglePage', 'Vertical'],
      sReadOffset,
      options
    };
  }
});
</script>
