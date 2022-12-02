<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <div
    class="q-px-md q-py-md col MangaInfo"
    style="overflow-y: auto"
    :style="
      $q.screen.sm || $q.screen.xs
        ? ``
        : `max-height: calc(100vh - ` + offset + `px)`
    "
  >
    <q-img
      v-if="$q.screen.sm || $q.screen.xs || $q.screen.md"
      style="width: fit-content; max-width: 100%"
      loading="lazy"
      class="rounded-borders q-mx-md"
      img-class="test"
      :src="imgdata"
      fit="scale-down"
    />
    <div class="flex no-wrap">
      <q-img
        v-if="!($q.screen.sm || $q.screen.xs || $q.screen.md)"
        style="width: fit-content; max-width: 50%; flex: none"
        loading="lazy"
        class="rounded-borders"
        img-class="test"
        :src="imgdata"
        fit="scale-down"
      />
      <div v-if="manga" class="q-mx-md" style="display: inline-block">
        <h3
          style="overflow-wrap: anywhere"
          :class="$q.screen.sm || $q.screen.xs || $q.screen.md ? `q-my-sm` : ``"
        >
          {{ manga.title }}
        </h3>
        <div v-if="manga.author" class="text-h5 q-my-xs">
          Author: <span class="text-subtitle1">{{ manga.author }}</span>
        </div>
        <div v-if="manga.artist" class="text-h5 q-my-xs">
          Artist:
          <span class="text-subtitle1">{{ manga.artist }}</span>
        </div>
        <div v-if="manga.status" class="text-h5 q-my-xs">
          Status: <span class="text-subtitle1">{{ manga.status }}</span>
        </div>
        <div v-if="manga.source?.displayName" class="text-h5 q-my-xs">
          Source:
          <span class="text-subtitle1">{{ manga.source?.displayName }}</span>
        </div>
      </div>
    </div>
    <div class="q-my-md" style="display: flex; justify-content: space-evenly">
      <q-btn
        flat
        :color="manga?.inLibrary ? `primary` : `grey-9`"
        icon="favorite"
        :label="manga?.inLibrary ? `In Library` : `Add To Library`"
        @click="InLibrary"
      />
      <q-btn
        flat
        color="grey-9"
        icon="public"
        label="Open Site"
        :href="manga?.realUrl"
        target="_blank"
      />
    </div>
    <div v-if="manga?.description">
      <h6 class="q-my-sm">About:</h6>
      <p style="font-size: 1.3em">{{ manga.description }}</p>
    </div>
    <div v-if="manga?.genre">
      <q-chip v-for="tag in manga.genre" :key="tag" outline color="primary">{{
        tag
      }}</q-chip>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { manga } from 'src/components/global/models';
import { getImgBlob } from '../global/usefull';
import { storeGet } from 'src/boot/StoreStuff';

export default defineComponent({
  name: 'MangaInfo',
  props: {
    manga: {
      type: Object as PropType<manga>,
      default: Object,
    },
    offset: {
      type: Number as PropType<number>,
      default: () => 0,
    },
  },
  emits: ['inlib'],
  setup(props) {
    const useCache = storeGet('useCache', true);
    return {
      useCache,
      inLib: ref(props.manga?.inLibrary || false),
      imgdata: ref(),
    };
  },
  created: function () {
    if (this.imgdata && this.manga) {
      this.getImg();
    } else {
      const unwatch = this.$watch(
        () => [this.imgdata, this.manga],
        () => {
          if (!this.imgdata && this.manga) {
            this.getImg();
            unwatch();
          }
        }
      );
    }
  },
  methods: {
    async InLibrary() {
      this.inLib = !this.inLib;
      if (this.inLib) {
        await this.$api.get(
          `/api/v1/manga/${this.$route.params['mangaID']}/library/`
        );
      } else {
        await this.$api.delete(
          `/api/v1/manga/${this.$route.params['mangaID']}/library/`
        );
      }
      this.$emit('inlib');
    },
    getImg() {
      getImgBlob(this.manga?.thumbnailUrl + '?useCache=' + this.useCache).then(
        (value) => {
          this.imgdata = value;
        }
      );
    },
  },
});
</script>

<style lang="sass">
.MangaInfo .q-img__container
  position: unset

.MangaInfo .q-img.q-img--menu :first-child
  padding: 0 !important
</style>
