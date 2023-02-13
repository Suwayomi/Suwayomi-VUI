<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <q-list separator :dark="$q.dark.isActive" :style-fn="myTweak">
    <!-- categories -->
    <q-item to="/settings/categories">
      <q-item-section avatar>
        <q-icon name="category" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Categories</q-item-label>
      </q-item-section>
    </q-item>
    <!-- dark mode -->
    <q-item
      v-ripple
      clickable
      class="row justify-between"
      @click="darkmode = !darkmode"
    >
      <q-item-section avatar>
        <q-icon name="brightness_6" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Dark mode</q-item-label>
      </q-item-section>
      <q-toggle v-model="darkmode" color="blue" val="battery" />
    </q-item>
    <!-- manga grid width -->
    <q-item v-ripple clickable @click="Mitem = true">
      <q-item-section avatar>
        <q-icon name="view_module" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Manga Item width</q-item-label>
        <q-item-label caption>{{ MitemW }}px</q-item-label>
      </q-item-section>
      <q-dialog v-model="Mitem">
        <q-card class="q-pa-lg">
          <q-card-section class="q-px-none q-pt-none">
            <div class="text-h6">Manga Item width:</div>
          </q-card-section>
          <q-card-section class="q-pt-none q-px-none">
            the target width for manga items in grids like the library and
            scource views
          </q-card-section>
          <q-input
            v-model="MitemW"
            standout
            type="number"
            suffix="px"
          ></q-input>
          <q-slider v-model="MitemW" :step="50" snap :min="100" :max="1000" />

          <q-card-actions align="right" class="q-pb-none">
            <q-btn flat label="Default" color="primary" @click="MitemW = 300" />
            <q-btn v-close-popup flat label="Cancel" color="primary" />
            <q-btn
              v-close-popup
              flat
              label="Save"
              color="primary"
              @click="setMitemW(MitemW)"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-item>
    <!-- server address -->
    <q-item v-ripple clickable @click="Saddr = true">
      <q-item-section avatar>
        <q-icon name="dns" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Server Address</q-item-label>
        <q-item-label caption>{{ serverAddr }}</q-item-label>
      </q-item-section>
      <q-dialog v-model="Saddr">
        <q-card class="q-px-md">
          <q-card-section>
            <div class="text-h6">Enter Server Address</div>
          </q-card-section>
          <q-input v-model="serverAddr" standout type="text"></q-input>

          <q-card-actions align="right">
            <q-btn
              flat
              label="Default"
              color="primary"
              @click="serverAddr = 'http://localhost'"
            />
            <q-btn v-close-popup flat label="Cancel" color="primary" />
            <q-btn
              v-close-popup
              flat
              label="Save"
              color="primary"
              @click="setserverAddr(serverAddr)"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-item>
    <!-- basic auth -->
    <q-item v-ripple clickable @click="baut = true">
      <q-item-section avatar>
        <q-icon :name="bpsw && busr ? 'o_lock_open' : 'lock'" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Basic Auth</q-item-label>
      </q-item-section>
      <q-dialog v-model="baut">
        <q-card class="q-px-md">
          <q-card-section>
            <div class="text-h6">Enter Username and Password</div>
          </q-card-section>
          <q-input
            v-model="busr"
            standout
            label="Username"
            type="text"
            name="username"
            class="q-my-sm"
          >
          </q-input>
          <q-input
            v-model="bpsw"
            standout
            label="Password"
            :type="!isPwd ? 'password' : 'text'"
            class="q-my-sm"
            name="password"
          >
            <template #append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <q-card-actions align="right">
            <q-btn
              v-close-popup
              flat
              label="Clear Auth"
              color="primary"
              @click="setserverAuth()"
            />
            <q-btn v-close-popup flat label="Cancel" color="primary" />
            <q-btn
              v-close-popup
              flat
              label="Save"
              color="primary"
              @click="setserverAuth(busr, bpsw)"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-item>
    <!-- Reader Defaults -->
    <q-item v-ripple clickable @click="SRead = true">
      <q-item-section avatar>
        <q-icon name="menu_book" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Default Reader Settings</q-item-label>
      </q-item-section>

      <q-dialog v-model="SRead">
        <q-card class="q-px-sm">
          <q-card-section>
            <div class="text-h6">Default Reader Settings</div>
          </q-card-section>
          <q-card-section>
            <q-item
              v-ripple
              class="row justify-between no-wrap items-center rounded-borders"
              clickable
              @click="SreadMargins = !SreadMargins"
            >
              <q-item-label>Page Margins</q-item-label>
              <q-toggle v-model="SreadMargins" color="blue" />
            </q-item>
            <q-separator class="q-my-xs"></q-separator>
            <q-item
              v-ripple
              class="row justify-between no-wrap items-center rounded-borders"
              clickable
              @click="SreadScale = !SreadScale"
            >
              <q-item-label>Page Scale</q-item-label>
              <q-toggle v-model="SreadScale" color="blue" />
            </q-item>
            <q-separator class="q-my-xs"></q-separator>
            <q-select
              v-model="SReadModel"
              standout
              label="Reader Mode"
              :options="SReadoptions"
            >
            </q-select>
            <q-separator class="q-my-xs"></q-separator>
            <q-select
              v-model="SReadPath"
              standout
              label="Navigation layout"
              :options="PathOptions"
            >
            </q-select>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              v-close-popup
              flat
              label="Save"
              color="primary"
              @click="setReaderOptions"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-item>
    <!-- backups -->
    <q-expansion-item
      expand-separator
      icon="backup"
      label="Backup"
      default-closed
    >
      <q-item v-ripple clickable class="q-pl-xl" @click="createbackup">
        <q-item-section>
          <q-item-label>Create Backup</q-item-label>
          <q-item-label caption
            >Backup library as a Tachiyomi backup</q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item v-ripple clickable class="q-pl-xl">
        <q-item-section>
          <q-uploader
            :url="serverAddr + `/api/v1/backup/import/file`"
            class="q-ma-none"
            label="Upload Backup"
            accept=".proto.gz"
            field-name="backup.proto.gz"
            :headers="[
              {
                name: 'Authorization',
                value: 'Basic' + btoa(busr + ':' + bpsw),
              },
            ]"
            auto-upload
            style="width: 100%"
          />
        </q-item-section>
      </q-item>
    </q-expansion-item>
    <q-item>
      <q-item-section avatar>
        <q-icon name="question_mark" />
      </q-item-section>
      <q-item-section>
        <q-item-label>VUI Version</q-item-label>
        <q-item-label caption>{{ verison }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent, ref } from 'vue';
import { resetAxiosBase, resetAxiosAuth } from 'src/boot/axios';
import { storeGet } from 'src/boot/StoreStuff';
import { paths } from 'src/components/global/models';
import getEnv from 'src/getenv';

export default defineComponent({
  name: 'SettingsPage',
  emits: ['set-title'],
  setup(_props, { emit }) {
    emit('set-title', 'Settings');
    const $q = useQuasar();
    const darkmode = ref($q.dark.isActive);
    const MitemW = ref(storeGet('MitemW', 300) as number);
    const serverAddr = ref(
      storeGet(
        'baseUrl',
        getEnv('TachideskURL') ? getEnv('TachideskURL') : location.origin
      ) as string
    );
    const auth = $q.localStorage.getItem('auth') as {
      username: string;
      password: string;
    } | null;
    const SReadModel = ref(
      ($q.localStorage.getItem('vue_RM') || 'RTL') as string
    );
    const SReadPath = ref(
      ($q.localStorage.getItem('vue_Paths') || 'L') as keyof paths
    );
    const SreadMargins = ref(
      ($q.localStorage.getItem('vue_WT') || false) as boolean
    );
    const SreadScale = ref(
      ($q.localStorage.getItem('vue_Scale') || false) as boolean
    );

    return {
      darkmode,
      Mitem: ref(false),
      MitemW,
      Saddr: ref(false),
      SRead: ref(false),
      SReadModel,
      SReadPath,
      PathOptions: ['L', 'RAL', 'Kindle', 'Edge'],
      SReadoptions: ['RTL', 'LTR', 'SinglePage', 'Vertical'],
      SreadMargins,
      SreadScale,
      serverAddr,
      baut: ref(false),
      busr: ref(auth != null ? auth.username : ''),
      bpsw: ref(auth != null ? auth.password : ''),
      resetAxiosBase,
      resetAxiosAuth,
      isPwd: ref(false),
    };
  },
  computed: {
    verison() {
      return process.env.VERSION || 'test';
    },
  },
  watch: {
    '$q.dark.isActive': function () {
      this.darkmode = this.$q.dark.isActive;
    },
    darkmode: function (val) {
      this.$q.dark.set(val);
      this.$storeSet('dark', val, true);
    },
  },
  methods: {
    createbackup() {
      this.$api
        .get(this.serverAddr + '/api/v1/backup/export/file', {
          responseType: 'blob',
        })
        .then((resp) => {
          let url = window.URL.createObjectURL(resp.data);
          let a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          if (typeof resp.headers.get == 'function') {
            const tmp2 = <string>resp.headers.get('content-disposition');
            if (tmp2 != null) {
              const tmp = tmp2.match(/filename="([^"]+)"/);
              if (tmp != null && tmp[1]) a.download = tmp[1];
            }
          }
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        });
    },
    myTweak(offset: number) {
      return {
        height: offset ? `calc(100vh - ${offset}px)` : '100vh',
      };
    },
    setMitemW(val: number) {
      this.$q.localStorage.set('MitemW', val);
    },
    setserverAddr: function (val: string) {
      this.$storeSet(
        'baseUrl',
        val.endsWith('/') ? val.slice(0, -1) : val,
        getEnv('TachideskURL') ? getEnv('TachideskURL') : location.origin
      );
      this.resetAxiosBase();
    },
    setserverAuth(username = '', password = '') {
      if (username == '' || password == '') {
        this.$q.localStorage.remove('auth');
        this.busr = '';
        this.bpsw = '';
      } else {
        this.$q.localStorage.set('auth', { username, password });
      }
      this.resetAxiosAuth();
    },
    btoa(val: string) {
      return btoa(val);
    },
    setReaderOptions() {
      this.$q.localStorage.set('vue_RM', this.SReadModel);
      this.$q.localStorage.set('vue_Paths', this.SReadPath);
      this.$q.localStorage.set('vue_WT', this.SreadMargins);
      this.$q.localStorage.set('vue_Scale', this.SreadScale);
    },
  },
});
</script>
