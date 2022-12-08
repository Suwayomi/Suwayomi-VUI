<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <q-page :style-fn="myTweak" class="notOflow">
    <q-infinite-scroll
      ref="infiniteScrol"
      :offset="$q.screen.height"
      @load="onLoad"
    >
      <div v-for="(item, index) in updates" :key="index">
        <UpdateCard :item="item"></UpdateCard>
      </div>
      <template #loading>
        <div v-for="(_, index) in 6" :key="index">
          <q-card v-ripple clickable class="q-pa-xs q-ma-sm">
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
  name: 'UpdatesPage',
  components: { UpdateCard },
  emits: ['set-title'],
  setup(_props, { emit }) {
    emit('set-title', 'Updates');
    return { updates: ref(<{ manga: manga; chapter: chapter }[]>[]) };
  },
  methods: {
    myTweak(offset: number) {
      return {
        height: offset ? `calc(100vh - ${offset}px)` : '100vh',
      };
    },
    async onLoad(index: number, done: () => void) {
      const { data: update } = await this.$api.get<updatesreq>(
        `/api/v1/update/recentChapters/${index}`
      );
      if (!update.hasNextPage)
        (this.$refs['infiniteScrol'] as QInfiniteScroll).stop();
      this.updates.push(...update.page);
      done();
    },
  },
});
</script>

<style lang="sass" scoped>
.OFlow.notOflow
  overflow-y: unset
</style>
