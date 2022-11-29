<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <q-card flat class="q-ma-sm">
    <q-item
      v-ripple
      clickable
      style="height: 100px"
      :to="`/sources/${source.id}/popular/`"
    >
      <div class="row content-center col-grow">
        <q-item-section avatar>
          <q-img
            :src="imgdata"
            loading="lazy"
            spinner-color="white"
            style="height: 100px; aspect-ratio: 225/225; width: fit-content"
            class="rounded-borders items-center justify-center"
            no-spinner
          >
            <q-inner-loading
              :showing="!imgdata"
              color="primary"
              class="bg-transparent"
            >
            </q-inner-loading>
          </q-img>
        </q-item-section>
        <q-item-section class="flex-grow">
          <q-item-label>{{ capitalizeFirstLetter(source.name) }}</q-item-label>
          <q-item-label caption
            >{{ langCodeToName(source.lang) }}
            <span v-if="source.isNsfw" style="color: red">18+</span>
          </q-item-label>
        </q-item-section>
      </div>
      <div class="flex items-center">
        <q-btn
          class="q-ma-sm"
          outline
          color="blue"
          label="latest"
          :to="`/sources/${source.id}/latest/`"
          v-if="source.supportsLatest"
        >
        </q-btn>
        <q-btn
          class="q-ma-sm"
          outline
          color="blue"
          label="browse"
          v-if="!$q.screen.xs"
          :to="`/sources/${source.id}/popular/`"
        >
        </q-btn>
      </div>
    </q-item>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { source } from '../global/models';
import { langCodeToName } from 'src/components/extantions/language';
import { getImgBlob } from '../global/usefull';
import { storeGet } from 'src/boot/StoreStuff';

export default defineComponent({
  name: 'sourceCard',
  props: {
    source: {
      type: Object as PropType<source>,
      required: true
    }
  },
  emits: ['reload'],
  methods: {
    capitalizeFirstLetter(string: string): string {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    langCodeToName,
    getSetImg() {
      getImgBlob(this.source.iconUrl + '?useCache=' + this.useCache).then(
        (value) => {
          this.imgdata = value;
        }
      );
    }
  },
  mounted: function () {
    this.getSetImg();
  },
  watch: {
    'source.iconUrl'() {
      this.imgdata = '';
      this.getSetImg();
    }
  },
  setup() {
    const useCache = ref(`${storeGet('useCache', true)}`);
    const imgdata = ref('');
    return { useCache, imgdata };
  }
});
</script>
