<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <q-layout view="hHh Lpr lFr" :class="scrollbarTheme" class="mainLayout">
    <q-header
      elevated
      :style="
        `background-color:` +
        ($q.dark.isActive ? `var(--q-primaryD)` : `var(--q-primary)`)
      "
    >
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
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-btn icon="arrow_back" flat round @click="$router.go(-1)" />

        <q-toolbar-title class="col-grow q-pr-none">
          {{ !$q.screen.xs ? title : `` }}
        </q-toolbar-title>

        <router-view name="inBar" />

        <q-btn
          elevated
          class="q-ml-sm"
          round
          :text-color="$q.dark.isActive ? `white` : `dark`"
          :icon="$q.dark.isActive ? `light_mode` : `dark_mode`"
          @click="toggledark"
        />
      </q-toolbar>
    </q-header>

    <q-footer
      elevated
      class="text-primary flex no-wrap justify-evenly"
      :class="$q.dark.isActive ? `bg-dark` : `bg-white`"
      v-if="$q.screen.sm || $q.screen.xs"
    >
      <q-item
        v-for="menu in essentialLinks"
        :key="menu.link"
        :to="menu.link"
        class="text-grey-7"
        active-class="text-primary"
      >
        <q-item-section> <q-icon :name="menu.icon" size="sm" /></q-item-section>
      </q-item>
    </q-footer>

    <q-drawer
      v-if="!($q.screen.sm || $q.screen.xs)"
      v-model="tru"
      show-if-above
      :mini="leftDrawerOpen"
      :breakpoint="0"
      :style="
        `background-color:` +
        ($q.dark.isActive ? `var(--q-secondaryD)` : `var(--q-secondary)`)
      "
    >
      <EssentialLink
        v-for="link in essentialLinks"
        :key="link.title"
        v-bind="link"
      />
    </q-drawer>

    <q-page-container>
      <router-view
        @setTitle="setTitle"
        :class="$q.dark.isActive ? `dark-page` : `white`"
        style="overflow-y: auto"
      />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import EssentialLink from 'src/components/mainLayout/EssentialLink.vue';
import { useQuasar } from 'quasar';
import { useMeta } from 'quasar';
import { storeGet, storeSet } from 'src/boot/StoreStuff';

const linksList = [
  {
    title: 'Library',
    caption: '',
    icon: 'o_collections_bookmark',
    link: '/library?tab=0'
  },
  {
    title: 'Updates',
    caption: '',
    icon: 'o_new_releases',
    link: '/updates'
  },
  {
    title: 'Extensions',
    caption: '',
    icon: 'o_extension',
    link: '/extensions'
  },
  {
    title: 'Sources',
    caption: '',
    icon: 'o_explore',
    link: '/sources'
  },
  {
    title: 'Downloads',
    caption: '',
    icon: 'o_download',
    link: '/downloads'
  },
  {
    title: 'Settings',
    caption: '',
    icon: 'settings',
    link: '/settings'
  }
];

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },
  watch: {
    scrollbarTheme(neww, old) {
      document.body.classList.remove(old);
      document.body.classList.add(neww);
    }
  },
  methods: {
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
    }
  },
  computed: {
    scrollbarTheme(): string {
      return this.$q.dark.isActive ? 'darkSB' : 'lightSB';
    }
  },
  mounted() {
    document.body.classList.add(this.scrollbarTheme);
    window.addEventListener('full-screen', (e) => this.isFS(e as CustomEvent));
  },
  unmounted() {
    document.body.classList.remove(this.scrollbarTheme);
  },
  setup() {
    const $q = useQuasar();
    const title = ref('Quasar App');
    useMeta(() => {
      return {
        title: title.value,
        titleTemplate: (title) => `${title} - Tachidesk Quasar`
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
      FS: ref(false)
    };
  }
});
</script>
