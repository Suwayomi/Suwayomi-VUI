<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <q-layout view="hHh Lpr lFr" :class="scrollbarTheme" class="mainLayout">
    <q-header elevated :class="$q.dark.isActive ? `bg-primaryD` : `bg-primary`">
      <q-bar
        v-if="$q.platform.is.electron"
        class="q-electron-drag"
        :class="FS ? `hidden` : ``"
      >
        <q-icon name="img:favicon.ico" class="q-electron-drag--exception" />
        <div>{{ `${title} - Tachidesk Quasar` }}</div>

        <q-space />

        <q-btn dense flat icon="minimize" @click="minimize" />
        <q-btn dense flat icon="crop_square" @click="toggleMaximize" />
        <q-btn dense flat icon="close" @click="closeApp" />
      </q-bar>
      <q-toolbar :class="$q.screen.sm || $q.screen.xs ? `q-px-none` : ``">
        <q-btn
          v-if="!($q.screen.xs || $q.screen.sm)"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-btn icon="arrow_back" flat round @click="$router.go(-1)" />

        <q-toolbar-title
          class="col-grow q-pr-none"
          :class="$q.screen.sm || $q.screen.xs ? `q-px-none` : ``"
        >
          {{ !$q.screen.xs ? title : undefined }}
        </q-toolbar-title>

        <router-view name="inBar" />

        <q-btn
          elevated
          class="q-ml-sm"
          round
          :class="$q.dark.isActive ? `light` : `dark`"
          :icon="$q.dark.isActive ? `light_mode` : `dark_mode`"
          @click="toggledark"
        />
      </q-toolbar>
    </q-header>

    <q-footer
      v-if="$q.screen.sm || $q.screen.xs"
      elevated
      class="text-primary flex no-wrap"
      :class="$q.dark.isActive ? `bg-dark` : `bg-light`"
    >
      <q-item
        v-for="menu in essentialLinks"
        :key="menu.link"
        :to="menu.link"
        class="text-grey-7 col-grow q-px-none"
        active-class="text-primary"
      >
        <q-item-section class="content-center">
          <q-icon :name="menu.icon" :size="$q.screen.xs ? `sm` : `xl`"
        /></q-item-section>
      </q-item>
    </q-footer>

    <q-drawer
      v-if="!($q.screen.sm || $q.screen.xs)"
      v-model="tru"
      show-if-above
      :mini="leftDrawerOpen"
      :breakpoint="0"
      :class="$q.dark.isActive ? `bg-secondaryD` : `bg-secondary`"
    >
      <EssentialLink
        v-for="link in essentialLinks"
        :key="link.title"
        v-bind="link"
      />
    </q-drawer>

    <q-page-container>
      <router-view
        :class="$q.dark.isActive ? `bg-dark-page` : `bg-light-page`"
        class="OFlow"
        @set-title="setTitle"
      />
    </q-page-container>

    <q-dialog v-model="newReleasepopup">
      <q-card style="min-width: 350px">
        <q-card-section class="">
          <q-item>
            <q-item-section>
              <q-item-label class="text-h6">
                A new version of VUI is avalable
              </q-item-label>
              <q-item-label caption class="text-info q-pt-lg">
                <div>Download the newest release from the github</div>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn
            v-close-popup
            :href="newReleaseData.html_url"
            flat
            label="Github"
          />
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
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import EssentialLink from 'src/components/mainLayout/EssentialLink.vue';
import { useQuasar } from 'quasar';
import { useMeta } from 'quasar';
import { storeGet, storeSet } from 'src/boot/StoreStuff';
import { AxiosResponse } from 'axios';

const linksList = [
  {
    title: 'Library',
    caption: '',
    icon: 'o_collections_bookmark',
    link: '/library?tab=0',
  },
  {
    title: 'Updates',
    caption: '',
    icon: 'o_new_releases',
    link: '/updates',
  },
  {
    title: 'Extensions',
    caption: '',
    icon: 'o_extension',
    link: '/extensions',
  },
  {
    title: 'Sources',
    caption: '',
    icon: 'o_explore',
    link: '/sources',
  },
  {
    title: 'Downloads',
    caption: '',
    icon: 'o_download',
    link: '/downloads',
  },
  {
    title: 'Settings',
    caption: '',
    icon: 'settings',
    link: '/settings',
  },
];

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
  },
  setup() {
    const $q = useQuasar();
    const title = ref('Quasar App');
    useMeta(() => {
      return {
        title: title.value,
        titleTemplate: (title) => `${title} - Tachidesk Quasar`,
      };
    });
    $q.dark.set(<boolean>storeGet('dark', true));
    const leftDrawerOpen = ref(true);
    return {
      title,
      essentialLinks: linksList,
      tru: ref(true),
      leftDrawerOpen,
      toggledark() {
        $q.dark.toggle();
        storeSet('dark', $q.dark.isActive, true);
      },
      doSearch: ref(false),
      Searchenter: ref(false),
      FS: ref(false),
      newReleaseData: ref(<{ tag_name: string; html_url: string }>{}),
      newReleasepopup: ref(false),
    };
  },
  computed: {
    scrollbarTheme(): string {
      return this.$q.dark.isActive ? 'darkSB' : 'lightSB';
    },
  },
  watch: {
    scrollbarTheme(neww, old) {
      document.body.classList.remove(old);
      document.body.classList.add(neww);
    },
  },
  mounted() {
    document.body.classList.add(this.scrollbarTheme);
    window.addEventListener('full-screen', (e) => this.isFS(e as CustomEvent));
    if (!this.$q.localStorage.getItem('dontshowagainRL'))
      this.$axios
        .get(
          'https://api.github.com/repos/Suwayomi/Tachidesk-VUI/releases/latest'
        )
        .then(
          ({ data }: AxiosResponse<{ tag_name: string; html_url: string }>) => {
            if (data.tag_name != process.env.VERSION) {
              this.newReleaseData = data;
              this.newReleasepopup = true;
            }
          }
        );
  },
  unmounted() {
    document.body.classList.remove(this.scrollbarTheme);
  },
  methods: {
    dontshowagain() {
      this.$q.localStorage.set('dontshowagainRL', true);
    },
    setTitle(titl: string) {
      this.title = titl;
    },
    minimize() {
      if (this.$q.platform.is.electron) {
        window.myWindowAPI.minimize();
      }
    },
    toggleMaximize() {
      if (this.$q.platform.is.electron) {
        window.myWindowAPI.toggleMaximize();
      }
    },
    closeApp() {
      if (this.$q.platform.is.electron) {
        window.myWindowAPI.close();
      }
    },
    isFS(event: CustomEvent) {
      console.log(event);
      this.FS = event.detail;
    },
  },
});
</script>

<style lang="sass" scoped>
.OFlow
  overflow-y: auto
</style>
