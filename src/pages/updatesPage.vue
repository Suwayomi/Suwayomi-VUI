<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <q-page :style-fn="myTweak" class="notOflow">
    <q-infinite-scroll
      @load="onLoad"
      :offset="$q.screen.height"
      ref="infiniteScrol"
    >
      <div v-for="(item, index) in updates" :key="index">
        <UpdateCard :item="item"></UpdateCard>
      </div>
      <template v-slot:loading>
        <div v-for="(_, index) in 6" :key="index">
          <q-card clickable v-ripple class="q-pa-xs q-ma-sm">
            <q-item>
              <q-item-section avatar>
                <q-skeleton
                  height="93px"
                  style="height: 93px; aspect-ratio: 225/350"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label><q-skeleton type="text" /></q-item-label>
                <q-item-label caption><q-skeleton type="text" /></q-item-label>
              </q-item-section>
              <q-skeleton class="flex-right self-center" type="circle" />
            </q-item>
          </q-card>
        </div>
      </template>
    </q-infinite-scroll>
  </q-page>
</template>

<script lang="ts">
import { QInfiniteScroll } from 'quasar';
import { chapter, manga } from 'src/components/global/models';
import { defineComponent, ref } from 'vue';
import UpdateCard from 'src/components/updates/updatecard.vue';

interface updatesreq {
  hasNextPage: boolean;
  page: { manga: manga; chapter: chapter }[];
}

export default defineComponent({
  name: 'updatesPage',
  components: { UpdateCard },
  methods: {
    myTweak(offset: number) {
      return {
        height: offset ? `calc(100vh - ${offset}px)` : '100vh'
      };
    },
    async onLoad(index: number, done: () => void) {
      const update: updatesreq = await this.$fetchJSON(
        `/api/v1/update/recentChapters/${index}`
      );
      if (!update.hasNextPage)
        (this.$refs['infiniteScrol'] as QInfiniteScroll).stop();
      this.updates.push(...update.page);
      done();
    }
  },
  setup(_props, { emit }) {
    emit('setTitle', 'Updates');
    return { updates: ref(<{ manga: manga; chapter: chapter }[]>[]) };
  }
});
</script>

<style lang="sass" scoped>
.OFlow.notOflow
  overflow-y: unset
</style>
