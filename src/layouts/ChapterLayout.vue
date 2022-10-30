<template>
  <q-layout>
    <q-page-container>
      <router-view :class="$q.dark.isActive ? `dark-page` : `white`" />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import {
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded
} from 'vue-router';

export default defineComponent({
  name: 'chapterLayout',
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
    }
  },
  setup() {
    return {
      tru: ref(true),
      leftDrawerOpen: ref(true)
    };
  }
});
</script>
