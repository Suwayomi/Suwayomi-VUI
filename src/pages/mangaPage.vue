<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <q-page
    class="nowrap"
    :class="$q.screen.sm || $q.screen.xs ? `col` : `row`"
    :style-fn="myTweak"
  >
    <mangaInfo
      @inlib="getonline"
      :manga="manga"
      :offset="offset"
      class="col-6"
    />
    <mangaChapters class="col-6" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { manga } from 'src/components/global/models';
import mangaInfo from 'src/components/manga/mangaInfo.vue';
import mangaChapters from 'src/components/manga/chapterList.vue';
import { AxiosResponse } from 'axios';

export default defineComponent({
  name: 'mangaPage',
  components: { mangaInfo, mangaChapters },
  created: async function () {
    this.$bus.on('updateManga', () => {
      this.getonline('true');
    });
    await this.getonline();
    this.$emit('setTitle', this.manga?.title || 'manga');
    if (
      new Date(this.manga.lastFetchedAt * 1000) <
      new Date(new Date().setDate(new Date().getDate() - 1))
    ) {
      this.$bus.emit('updateManga');
    }
  },
  methods: {
    async getonline(TF = 'false', retry = 3) {
      try {
        this.manga = (
          (await this.$api.get(
            `/api/v1/manga/${this.$route.params['mangaID']}/?onlineFetch=${TF}`
          )) as AxiosResponse<manga>
        ).data;
      } catch (error) {
        if (retry >= 1) await this.getonline(TF, retry - 1);
      }
    },
    myTweak(offset: number) {
      this.offset = offset;
      return {
        height: offset ? `calc(100vh - ${offset}px)` : '100vh'
      };
    }
  },
  setup() {
    const manga = ref(<manga>{});
    return { manga, offset: ref(<number>Number()) };
  }
});
</script>
