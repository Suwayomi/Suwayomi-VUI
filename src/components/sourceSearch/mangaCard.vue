<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <q-intersection>
    <q-card
      v-ripple
      flat
      class="my-card"
      :class="!($q.screen.sm || $q.screen.xs) ? `q-ma-sm` : `q-ma-xs`"
      :style="Display == `list` ? `` : `background: transparent`"
    >
      <router-link
        :to="`/manga/` + manga.id"
        class="cursor-pointer"
        style="text-decoration: none"
        :class="$q.dark.isActive ? `light` : `dark`"
      >
        <q-img
          v-if="Display != `list`"
          :src="imgdata"
          loading="lazy"
          spinner-color="white"
          style="max-width: 100%; aspect-ratio: 225/350"
          :class="$q.dark.isActive ? `bg-dark` : `bg-light`"
          class="rounded-borders"
          :img-style="manga.inLibrary ? { filter: 'brightness(0.4)' } : {}"
          :alt="manga.title"
        >
          <q-inner-loading :showing="!imgdata" color="primary">
          </q-inner-loading>
          <div
            class="transparent absolute-top q-mt-xs q-ml-xs"
            style="padding: 0"
          >
            <q-badge
              color="blue"
              v-if="manga.inLibrary"
              style="width: min-content; padding: 5px"
            >
              In Library
            </q-badge>
          </div>
          <div
            class="absolute-bottom text-subtitle1 text-center"
            v-if="Display == `compact`"
            :title="manga.title"
            style="
              padding: 0;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              text-overflow: ellipsis;
              height: 3.5rem;
            "
          >
            {{ manga.title }}
          </div>
        </q-img>

        <!-- list display mode -->
        <div class="row items-center col-grow no-wrap">
          <q-img
            v-if="Display == `list`"
            :src="imgdata"
            loading="lazy"
            spinner-color="white"
            style="height: 93px; aspect-ratio: 225/350; width: fit-content"
            class="rounded-borders items-center justify-center col-1"
            no-spinner
          >
            <q-inner-loading :showing="!imgdata" color="primary">
            </q-inner-loading>
          </q-img>
          <div
            :class="listdivClass"
            v-if="Display != `compact`"
            :title="manga.title"
            style="
              padding: 0;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              text-overflow: ellipsis;
              overflow: hidden;
              width: 100%;
            "
            :style="Display == `list` ? `` : `height: 5.25rem;`"
          >
            {{ manga.title }}
          </div>
          <div
            class="justify-end flex items-end col-grow"
            :class="!($q.screen.sm || $q.screen.xs) ? `q-mr-lg` : `q-mr-xs`"
            v-if="manga.inLibrary && Display == `list`"
          >
            <q-badge color="blue" style="width: min-content; padding: 5px">
              In Library
            </q-badge>
          </div>
        </div>
      </router-link>
    </q-card>
  </q-intersection>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { manga } from 'src/components/global/models';
import { getImgBlob } from 'src/components/global/usefull';
import { storeGet } from 'src/boot/StoreStuff';

export default defineComponent({
  name: 'MangaCard',
  props: {
    manga: {
      type: Object as PropType<manga>,
      default: () => Object
    },
    Display: {
      type: String as PropType<'compact' | 'comfort' | 'list'>,
      default: 'compact'
    }
  },
  computed: {
    listdivClass(): string {
      return this.Display == 'list'
        ? 'text-left q-ml-md text-h5 col-shrink'
        : 'text-center text-subtitle1';
    }
  },
  mounted: function () {
    getImgBlob(this.manga.thumbnailUrl + '?useCache=' + this.useCache).then(
      (value) => {
        this.imgdata = value;
      }
    );
  },
  setup() {
    const useCache = ref(`${storeGet('useCache', true)}`);
    const imgdata = ref('');
    return { useCache, imgdata };
  }
});
</script>

<style scoped lang="sass">
.my-card div.q-img--menu:hover
  transition: filter $generic-hover-transition
  filter: brightness(0.7)
</style>
