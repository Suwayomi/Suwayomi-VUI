<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 -->
<template>
  <q-btn
    class="q-ml-sm"
    round
    :text-color="$q.dark.isActive ? `white` : `dark`"
    icon="filter_list"
    @click="dialo = true"
  >
    <q-tooltip>Filter</q-tooltip>
  </q-btn>
  <q-dialog v-model="dialo">
    <q-card class="q-pa-md">
      <q-card-section
        v-for="(item, count) in ['Downloading', 'Queued', 'finished']"
        :key="count"
        class="q-py-xs"
      >
        <q-checkbox
          style="width: 100%"
          v-model="filter"
          :dark="$q.dark.isActive"
          :val="item"
        >
          <div style="margin-right: 12.5px">{{ item }}</div>
        </q-checkbox>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          flat
          label="clear"
          color="primary"
          v-close-popup
          @click="
            filter = [];
            dofilter();
          "
        />
        <q-btn
          flat
          label="Save"
          color="primary"
          v-close-popup
          @click="dofilter"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-btn
    elevated
    class="q-ml-sm"
    round
    :text-color="$q.dark.isActive ? `white` : `dark`"
    icon="clear_all"
    @click="clear"
  >
    <q-tooltip> Clear all downloads </q-tooltip>
  </q-btn>
  <q-btn
    elevated
    class="q-ml-sm"
    round
    :text-color="$q.dark.isActive ? `white` : `dark`"
    :icon="PlayPause ? `pause` : `play_arrow`"
    @click="toggleplay"
  >
    <q-tooltip>
      {{ PlayPause ? `stop downloads` : `start downloads` }}
    </q-tooltip>
  </q-btn>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import useDlSock from 'src/components/downloads/useDlSock';
import { dlsock, isdlsock } from '../global/models';

export default defineComponent({
  name: 'SearchBar',
  methods: {
    toggleplay() {
      if (!this.PlayPause) {
        this.$fetch('/api/v1/downloads/start');
      } else {
        this.$fetch('/api/v1/downloads/stop');
      }
    },
    clear() {
      this.$fetch('/api/v1/downloads/clear');
    },
    dofilter() {
      this.$bus.emit('DLFilter', this.filter);
    }
  },
  watch: {
    'Emitter.eventsFromServer'(val) {
      const tmp = <dlsock>JSON.parse(val);
      if (isdlsock(tmp)) {
        this.PlayPause = tmp.status == 'Started';
      }
    }
  },
  setup() {
    const Emitt = useDlSock();
    const Emitter = ref(Emitt);

    const PlayPause = ref();
    const tmp = Emitt.eventsFromServer.value
      ? JSON.parse(Emitt.eventsFromServer.value)
      : [];
    if (isdlsock(tmp)) {
      PlayPause.value = tmp.status == 'Started';
    }
    if (Emitter.value.isConnected) {
      Emitt.sendMsg('STATUS');
    }

    return {
      dialo: ref(false),
      filter: ref([]),
      PlayPause,
      Emitter
    };
  }
});
</script>
