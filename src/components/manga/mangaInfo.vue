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
      v-if="$q.screen.sm || $q.screen.xs"
      style="width: fit-content; max-width: 100%"
      loading="lazy"
      class="rounded-borders q-mx-md"
      img-class="test"
      :src="imgdata"
      fit="scale-down"
    />
    <div class="flex no-wrap">
      <q-img
        v-if="!($q.screen.sm || $q.screen.xs)"
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
          :class="$q.screen.sm || $q.screen.xs ? `q-my-sm` : ``"
        >
          {{ manga.title }}
        </h3>
        <div class="text-h5 q-my-xs" v-if="manga.author">
          Author: <span class="text-subtitle1">{{ manga.author }}</span>
        </div>
        <div class="text-h5 q-my-xs" v-if="manga.artist">
          Artist:
          <span class="text-subtitle1">{{ manga.artist }}</span>
        </div>
        <div class="text-h5 q-my-xs" v-if="manga.status">
          Status: <span class="text-subtitle1">{{ manga.status }}</span>
        </div>
        <div class="text-h5 q-my-xs" v-if="manga.source?.displayName">
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
      <q-btn flat color="grey-9" icon="public" label="Open Site" />
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
import { useQuasar } from 'quasar';
import { getImgBlob } from '../global/usefull';

export default defineComponent({
  name: 'mangaInfo',
  props: {
    manga: {
      type: Object as PropType<manga>
    },
    offset: {
      type: Number as PropType<number>,
      default: () => 0
    }
  },
  created: function () {
    if (!this.imgdata && this.manga) {
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
        await this.$fetch(
          `/api/v1/manga/${this.$route.params['mangaID']}/library/`
        );
      } else {
        await this.$fetch(
          `/api/v1/manga/${this.$route.params['mangaID']}/library/`,
          {
            method: 'DELETE'
          }
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
    }
  },
  setup(props) {
    const $q = useQuasar();
    const useCache = $q.localStorage.getItem('useCache');
    return {
      useCache,
      inLib: ref(props.manga?.inLibrary || false),
      imgdata: ref()
    };
  }
});
</script>

<style>
.MangaInfo .q-img__container {
  position: unset;
}
.MangaInfo .q-img.q-img--menu :first-child {
  padding: 0 !important;
}
</style>
