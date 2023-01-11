<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated :class="$q.dark.isActive ? `bg-primaryD` : `bg-primary`">
      <q-bar
        v-if="$q.platform.is.electron"
        class="q-electron-drag"
        :class="FS ? `hidden` : ``"
      >
        <q-icon name="img:favicon.ico" class="q-electron-drag--exception" />
        <div>{{ `${title} - Tachidesk Quasar` }}</div>

        <q-space />

        <q-btn
          dense
          flat
          icon="minimize"
          class="q-electron-drag--exception"
          @click="minimize"
        />
        <q-btn
          dense
          flat
          icon="crop_square"
          class="q-electron-drag--exception"
          @click="toggleMaximize"
        />
        <q-btn
          dense
          flat
          icon="close"
          class="q-electron-drag--exception"
          @click="closeApp"
        />
      </q-bar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      overlay
      elevated
      class="fixed"
      :breakpoint="0"
      :class="$q.dark.isActive ? `bg-secondaryD` : `bg-secondary`"
    >
      <q-item class="justify-between">
        <q-btn
          icon="close"
          flat
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
        >
          <q-tooltip> close menu </q-tooltip>
        </q-btn>
        <q-btn icon="arrow_back" flat round @click="$router.go(-1)">
          <q-tooltip> back </q-tooltip>
        </q-btn>
      </q-item>
      <q-separator />
      <q-item>
        <div class="text-h5">{{ titleData[1] }}</div>
      </q-item>
      <q-separator />
      <q-item>
        <div class="text-h6 text-weight-regular">{{ titleData[0] }}</div>
      </q-item>
      <q-separator />
      <leftDrawerVue></leftDrawerVue>
    </q-drawer>
    <q-page-container>
      <router-view
        :class="$q.dark.isActive ? `bg-dark-page` : `bg-light-page`"
        @title-data="settitleData"
        @open-menu="leftDrawerOpen = !leftDrawerOpen"
      />
      <q-page-sticky
        v-if="!leftDrawerOpen"
        position="top-left"
        :offset="[18, 18]"
        class="fabb"
      >
        <q-btn
          fab
          icon="menu"
          color="primary"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import {
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
} from 'vue-router';
import leftDrawerVue from 'src/components/reader/leftDrawerCont.vue';
import { useMeta } from 'quasar';

export default defineComponent({
  name: 'ChapterLayout',
  components: { leftDrawerVue },
  setup() {
    const title = ref('');
    useMeta(() => {
      return {
        title: title.value,
        titleTemplate: (title) => `${title} - Reading - Tachidesk Quasar `,
      };
    });
    return {
      titleData: ref(<[string, string]>['', '']),
      leftDrawerOpen: ref(false),
      title,
      FS: ref(false),
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
    $route(to: RouteLocationNormalized, from: RouteLocationNormalizedLoaded) {
      if (
        to.params['mangaID'] != from.params['mangaID'] ||
        to.params['chapterID'] !=
          (parseInt(`${from.params['chapterID']}`) + 1).toString()
      ) {
        this.$router.go(0);
      }
    },
  },
  mounted() {
    document.body.classList.add(this.scrollbarTheme);
    window.addEventListener('full-screen', (e) => this.isFS(e as CustomEvent));
  },
  unmounted() {
    document.body.classList.remove(this.scrollbarTheme);
  },
  created: function () {
    this.$q.dark.set(<boolean>this.$storeGet('dark', this.$q.dark.isActive));
  },
  methods: {
    settitleData(titldat: [string, string]) {
      this.titleData = titldat;
      this.title = `${titldat[0]} ${titldat[1]}`;
    },
    toggledark() {
      this.$q.dark.toggle();
      this.$storeSet('dark', this.$q.dark.isActive, true);
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
      this.FS = event.detail;
    },
  },
});
</script>

<style scoped lang="sass">
.fabb
  opacity: 0.2

.fabb:hover
  transition: opacity $generic-hover-transition
  opacity: 1
</style>
