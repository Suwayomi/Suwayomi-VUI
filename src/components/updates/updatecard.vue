<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <q-card clickable v-ripple class="q-pa-xs q-ma-sm">
    <q-item :to="`/manga/` + item.manga.id">
      <q-item-section avatar>
        <q-img
          :src="imgdata"
          loading="lazy"
          spinner-color="white"
          style="height: 93px; aspect-ratio: 225/350; width: fit-content"
          class="rounded-borders items-center justify-center col-1"
          no-spinner
        >
          <q-inner-loading
            :showing="!imgdata"
            color="primary"
            style="padding: 0"
          >
          </q-inner-loading>
        </q-img>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ item.manga.title }}</q-item-label>
        <q-item-label caption>{{ item.chapter.name }}</q-item-label>
      </q-item-section>
      <q-btn
        v-if="!item.chapter.downloaded"
        @click.prevent="download(item)"
        round
        style="height: fit-content"
        flat
        icon="download"
        class="flex-right self-center"
      >
      </q-btn>
    </q-item>
  </q-card>
</template>

<script lang="ts">
import { storeGet } from 'src/boot/StoreStuff';
import { defineComponent, PropType, ref } from 'vue';
import { chapter, manga } from '../global/models';
import { getImgBlob } from '../global/usefull';

export default defineComponent({
  name: 'UpdateCard',
  props: {
    item: {
      type: Object as PropType<{ manga: manga; chapter: chapter }>,
      required: true
    }
  },
  methods: {
    async download(item: { manga: manga; chapter: chapter }) {
      await this.$fetch(
        `/api/v1/download/${item.manga.id}/chapter/${item.chapter.index}`
      );
    }
  },
  mounted: function () {
    getImgBlob(
      this.item.manga.thumbnailUrl + '?useCache=' + this.useCache
    ).then((value) => {
      this.imgdata = value;
    });
  },
  setup() {
    const imgdata = ref('');
    const useCache = ref(`${storeGet('useCache', true)}`);
    return { useCache, imgdata };
  }
});
</script>
