<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <q-page class="flex items-center justify-center" :style-fn="myTweak">
    <div v-if="!downloads.length && Emitter.isConnected">No Downloads</div>
    <div v-if="!downlfilt.length && downloads.length && Emitter.isConnected">
      No Downloads fit filter
    </div>
    <q-virtual-scroll
      v-if="downlfilt.length"
      v-slot="{ item }"
      :items="downlfilt"
      class="self-start"
      style="flex: auto; height: 100%"
    >
      <q-item v-ripple clickable class="q-pa-lg">
        <q-item-section avatar>
          <q-icon name="drag_handle" size="sm"></q-icon>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-weight-medium text-h6">
            {{ item.manga.title }}
          </q-item-label>
          <q-item-label caption class="">
            <div class="col-6">
              Chapter {{ item.chapterIndex }} ({{
                (item.progress * 100).toFixed(2)
              }}%) => state:
              {{ item.state }}
            </div>
            <q-linear-progress
              :value="item.progress"
              style="width: 100%; max-width: 500px"
            />
          </q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-btn
            round
            flat
            icon="delete"
            class="flex-right"
            @click.prevent
            @click="delet(item)"
          ></q-btn>
        </q-item-section>
      </q-item>
    </q-virtual-scroll>
    <q-dialog v-model="goodBase" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class=""
          ><q-item>
            <q-item-section>
              <q-item-label class="text-h6 text-negative">
                Downloads webhook may not work with authentication.
              </q-item-label>
              <q-item-label class="text-info q-pt-lg">
                <div>
                  1. Move this UI to the same origin as the server (Recomended)
                </div>
              </q-item-label>
              <q-item-label caption class="text-info">
                <div>replace the default webui files with this ones files</div>
                <div>or some reverse proxy jank</div>
              </q-item-label>
              <q-item-label class="text-info q-pt-lg">
                <div>2. dissable authentication on the webhook url</div>
              </q-item-label>
              <q-item-label caption class="text-info">
                <div>/api/v1/downloads</div>
                <div>with some reverse proxy jank</div>
              </q-item-label>
              <q-item-label class="text-info q-pt-lg">
                <div>3. dissable authentication</div>
              </q-item-label>
              <q-item-label caption class="text-info">
                <div>in server configs</div>
              </q-item-label>
              <q-item-label class="text-info q-pt-lg">
                <div>4. Go to the default webUI and login</div>
              </q-item-label>
              <q-item-label caption class="text-info">
                <div>per browser</div>
                <div>
                  this is a temporary fix as it will clear after a month (i
                  think)
                </div>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn v-close-popup flat label="Ok" />
          <q-btn
            v-close-popup
            flat
            label="Dont show again"
            @click="dontshowagain"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import useDlSock from 'src/components/downloads/useDlSock';
import { defineComponent, ref } from 'vue';
import { download, dlsock, isdlsock } from 'src/components/global/models';
import { useQuasar } from 'quasar';
import { storeGet } from 'src/boot/StoreStuff';
import getEnv from 'src/getenv';

export default defineComponent({
  emits: ['set-title'],
  setup(_props, { emit }) {
    emit('set-title', 'Downloads');
    const $q = useQuasar();
    const Emitt = useDlSock();
    const Emitter = ref(Emitt);
    const base = storeGet(
      'baseUrl',
      getEnv('TachideskURL') ? getEnv('TachideskURL') : location.origin
    ) as string;

    const downloads = ref(<download[]>[]);
    const tmp = Emitt.eventsFromServer.value
      ? JSON.parse(Emitt.eventsFromServer.value)
      : [];
    if (isdlsock(tmp)) {
      downloads.value = <download[]>tmp.queue;
    }
    if (Emitter.value.isConnected) {
      Emitt.sendMsg('STATUS');
    }

    const goodBase = ref(
      new URL(base).origin != location.origin &&
        !$q.localStorage.getItem('dontshowagainWH') &&
        !!$q.localStorage.getItem('auth')
    );
    return {
      downloads,
      goodBase,
      Emitter,
      filtering: ref(<string[]>[]),
    };
  },
  computed: {
    downlfilt(): download[] {
      if (this.filtering.length) {
        return this.downloads.filter((e) => this.filtering.includes(e.state));
      }
      return this.downloads;
    },
  },
  watch: {
    'Emitter.eventsFromServer'(val) {
      const tmp = <dlsock>JSON.parse(val);
      if (isdlsock(tmp)) {
        this.downloads = <download[]>tmp.queue;
      }
    },
  },
  created() {
    this.$bus.on('DLFilter', (e: string[]) => {
      this.filtering = e;
    });
  },
  methods: {
    myTweak(offset: number) {
      return {
        height: offset ? `calc(100vh - ${offset}px)` : '100vh',
      };
    },
    async delet(download: download) {
      this.$api.delete(
        `/api/v1/download/${download.mangaId}/chapter/${download.chapterIndex}`
      );
      this.$api.delete(
        `/api/v1/manga/${download.mangaId}/chapter/${download.chapterIndex}`,
        { method: 'DELETE' }
      );
    },
    dontshowagain() {
      this.$q.localStorage.set('dontshowagainWH', true);
    },
  },
});
</script>
