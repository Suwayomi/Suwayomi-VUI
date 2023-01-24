<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <q-page :style-fn="myTweak">
    <TabPanel active :tabs="tabs"></TabPanel>
    <MangaGrid v-if="!failedFetch"> </MangaGrid>
    <q-dialog v-model="failedFetch" persistent>
      <q-card style="min-width: 350px">
        <q-card-section
          ><q-item>
            <q-item-section>
              <q-item-label class="text-h6 text-negative"
                >Getting categories failed.
              </q-item-label>
              <q-item-label class="text-info q-pt-lg">
                <div>Have you set your server address?</div>
                <div>Is the server running?</div>
                <div class="q-pt-sm">
                  Pressing Ok will take you to the settings page
                </div>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn v-close-popup flat label="ok" to="/settings" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { tab } from 'src/components/global/models';
import TabPanel from 'src/components/library/TabPanel.vue';
import { defineComponent, ref } from 'vue';
import { cat } from 'src/components/global/models';
import MangaGrid from 'src/components/library/MangaGrid.vue';

export default defineComponent({
  name: 'LibraryPage',
  components: { TabPanel, MangaGrid },
  emits: ['set-title'],
  setup(_props, { emit }) {
    emit('set-title', 'Library');
    const tabs = ref<tab[]>([]);
    const failedFetch = ref(false);
    return {
      tabs,
      failedFetch,
    };
  },
  created: async function () {
    try {
      const jsn = await this.$api.get<cat[]>('/api/v1/category');
      this.tabs = jsn.data.map((cat) => {
        return {
          tabname: cat.name,
          tabID: cat.id,
        };
      });
      this.$router.replace({
        query: { ...this.$route.query, tab: this.tabs[0]?.tabID || 0 },
      });
    } catch (e) {
      this.failedFetch = true;
    }
  },
  methods: {
    myTweak(offset: number) {
      return {
        height: offset ? `calc(100vh - ${offset}px)` : '100vh',
      };
    },
  },
});
</script>
