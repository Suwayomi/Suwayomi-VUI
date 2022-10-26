<template>
  <q-list separator :dark="$q.dark.isActive ? true : false">
    <!-- dark mode -->
    <q-item
      clickable
      v-ripple
      @click="darkmode = !darkmode"
      class="row justify-between"
    >
      <q-item-section avatar>
        <q-icon name="brightness_6" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Dark mode</q-item-label>
      </q-item-section>
      <q-toggle color="blue" v-model="darkmode" val="battery" />
    </q-item>
    <!-- manga width -->
    <q-item clickable v-ripple @click="Mitem = true">
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
            standout
            type="number"
            v-model="MitemW"
            suffix="px"
          ></q-input>
          <q-slider :step="50" snap v-model="MitemW" :min="100" :max="1000" />

          <q-card-actions align="right" class="q-pb-none">
            <q-btn flat label="Default" color="primary" @click="MitemW = 300" />
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn
              flat
              label="OK"
              color="primary"
              v-close-popup
              @click="setMitemW(MitemW)"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-item>
    <!-- use cache -->
    <q-item
      clickable
      v-ripple
      @click="useCache = !useCache"
      class="row justify-between"
    >
      <q-item-section avatar>
        <q-icon name="cached" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Use imanga cache</q-item-label>
      </q-item-section>
      <q-toggle color="blue" v-model="useCache" val="battery" />
    </q-item>
    <!-- server address -->
    <q-item clickable v-ripple @click="Saddr = true">
      <q-item-section avatar>
        <q-icon name="dns" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Server Address</q-item-label>
        <q-item-label caption>{{
          $q.localStorage.getItem('baseUrl')
        }}</q-item-label>
      </q-item-section>
      <q-dialog v-model="Saddr">
        <q-card class="q-px-md">
          <q-card-section>
            <div class="text-h6">Enter Server Address</div>
          </q-card-section>
          <q-input standout type="text" v-model="serverAddr"></q-input>

          <q-card-actions align="right">
            <q-btn
              flat
              label="Default"
              color="primary"
              @click="serverAddr = 'http://localhost'"
            />
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn
              flat
              label="OK"
              color="primary"
              v-close-popup
              @click="setserverAddr(serverAddr)"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-item>
    <!-- basic auth -->
    <q-item clickable v-ripple @click="baut = true">
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
            standout
            label="Username"
            type="text"
            v-model="busr"
            name="username"
            class="q-my-sm"
          ></q-input>
          <q-input
            standout
            label="Password"
            type="password"
            v-model="bpsw"
            class="q-my-sm"
            name="password"
          ></q-input>

          <q-card-actions align="right">
            <q-btn
              flat
              label="Clear Auth"
              color="primary"
              v-close-popup
              @click="setserverAuth()"
            />
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn
              flat
              label="OK"
              color="primary"
              v-close-popup
              @click="setserverAuth(busr, bpsw)"
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
      <q-item clickable v-ripple class="q-pl-xl">
        <q-item-section>
          <q-item-label>Create Backup</q-item-label>
          <q-item-label caption
            >Backup library as a Tachiyomi backup</q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple class="q-pl-xl">
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
                value: 'Basic' + btoa(busr + ':' + bpsw)
              }
            ]"
            auto-upload
            style="width: 100%"
          />
        </q-item-section>
      </q-item>
    </q-expansion-item>
  </q-list>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'settingsPage',
  methods: {
    setMitemW(val: number) {
      this.$q.localStorage.set('MitemW', val);
    },
    setserverAddr: function (val: string) {
      this.$q.localStorage.set(
        'baseUrl',
        val.endsWith('/') ? val.slice(0, -1) : val
      );
    },
    setserverAuth(username = '', password = '') {
      if (username == '' || password == '') {
        this.$q.localStorage.set('auth', null);
        this.busr = '';
        this.bpsw = '';
      } else {
        this.$q.localStorage.set('auth', { username, password });
      }
    },
    btoa(val: string) {
      return btoa(val);
    }
  },
  watch: {
    darkmode: function (val) {
      this.$q.dark.set(val);
      this.$q.localStorage.set('dark', val);
    },
    useCache: function (val) {
      this.$q.localStorage.set('useCache', val);
    }
  },
  setup(_props, { emit }) {
    emit('setTitle', 'Settings');
    const $q = useQuasar();
    const darkmode = ref($q.dark.isActive);
    const MitemW = ref($q.localStorage.getItem('MitemW') as number);
    const useCache = ref($q.localStorage.getItem('useCache') as boolean);
    const serverAddr = ref($q.localStorage.getItem('baseUrl') as string);
    const auth = $q.localStorage.getItem('auth') as {
      username: string;
      password: string;
    } | null;

    return {
      darkmode,
      Mitem: ref(false),
      MitemW,
      useCache,
      Saddr: ref(false),
      serverAddr,
      baut: ref(false),
      busr: ref(auth != null ? auth.username : ''),
      bpsw: ref(auth != null ? auth.password : '')
    };
  }
});
</script>
