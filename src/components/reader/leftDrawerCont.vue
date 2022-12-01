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
    style="width: 100%"
    label="Reader Mode"
    v-model="SReadModel"
    :options="SReadoptions"
  >
  </q-select>

  <q-item
    class="row justify-between no-wrap items-center rounded-borders"
    clickable
    v-ripple
    @click="showPath = !showPath"
  >
    <q-item-label>View Path</q-item-label>
    <q-toggle color="blue" v-model="showPath" />
    <q-tooltip>
      <div>blue = next</div>
      <div>red = back</div>
      <div>green = menu</div>
    </q-tooltip>
  </q-item>

  <q-select
    standout
    style="width: 100%"
    label="Navigation layout"
    v-model="SReadPath"
    :options="PathOptions"
  >
  </q-select>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { chapterMeta } from 'src/components/reader/readerSettings';
import { useRoute } from 'vue-router';
import { paths } from '../global/models';

export default defineComponent({
  name: 'readerDrawerCont',
  created: function () {
    this.$watch('SReadModel', (newer: string) => {
      this.options.setRM(newer);
    });
    this.$watch('SReadPath', (newer: keyof paths) => {
      this.options.setPaths(newer);
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
    this.$watch('showPath', () => {
      this.options.toggPath();
    });
  },
  setup() {
    const route = useRoute();
    const options = chapterMeta(parseInt(`${route.params['mangaID']}`));
    const SReadModel = options.vue_RM;
    const SReadPath = options.vue_Paths;
    const SreadMargins = options.vue_WT;
    const SreadScale = options.vue_Scale;
    const sReadOffset = options.vue_Offset;
    const showPath = ref(options.pathVisable.value);
    return {
      SreadMargins,
      SreadScale,
      SReadModel,
      SReadPath,
      PathOptions: ['L', 'RAL', 'Kindle', 'Edge'],
      showPath,
      SReadoptions: ['RTL', 'LTR', 'SinglePage', 'Vertical'],
      sReadOffset,
      options
    };
  }
});
</script>
