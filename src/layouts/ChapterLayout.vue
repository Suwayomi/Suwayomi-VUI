<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <q-layout view="hHh Lpr fFf">
    <q-drawer
      overlay
      v-model="leftDrawerOpen"
      elevated
      class="fixed"
      :breakpoint="0"
      :style="
        `background-color:` +
        ($q.dark.isActive ? `var(--q-secondaryD)` : `var(--q-secondary)`)
      "
    >
      <q-item class="justify-between">
        <q-btn
          icon="close"
          flat
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-btn icon="arrow_back" flat round @click="$router.go(-1)" />
      </q-item>
      <leftDrawerVue></leftDrawerVue>
    </q-drawer>
    <q-page-container>
      <router-view
        @setTitle="setTitle"
        :class="$q.dark.isActive ? `dark-page` : `white`"
      />
      <q-page-sticky
        position="top-left"
        :offset="[18, 18]"
        v-if="!leftDrawerOpen"
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
  RouteLocationNormalizedLoaded
} from 'vue-router';
import leftDrawerVue from 'src/components/reader/leftDrawerCont.vue';
import { useMeta } from 'quasar';

export default defineComponent({
  name: 'chapterLayout',
  components: { leftDrawerVue },
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
    }
  },
  computed: {
    scrollbarTheme(): string {
      return this.$q.dark.isActive ? 'darkSB' : 'lightSB';
    }
  },
  mounted() {
    document.body.classList.add(this.scrollbarTheme);
  },
  unmounted() {
    document.body.classList.remove(this.scrollbarTheme);
  },
  created: function () {
    this.$q.dark.set(<boolean>this.$q.localStorage.getItem('dark'));
  },
  methods: {
    toggledark() {
      this.$q.dark.toggle();
      this.$q.localStorage.set('dark', this.$q.dark.isActive);
    },
    setTitle(titl: string) {
      this.title = titl;
    }
  },
  setup() {
    const title = ref('');
    useMeta(() => {
      return {
        title: title.value,
        titleTemplate: (title) => `${title} - Reading - Tachidesk Quasar `
      };
    });
    return {
      leftDrawerOpen: ref(false),
      title
    };
  }
});
</script>

<style scoped>
.fabb {
  opacity: 0.2;
}
.fabb:hover {
  opacity: 1;
}
</style>
