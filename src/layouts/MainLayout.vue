<template>
  <q-layout view="hHh Lpr lFr" :class="scrollbarTheme">
    <q-header
      elevated
      :style="
        `background-color:` +
        ($q.dark.isActive ? `var(--q-primaryD)` : `var(--q-primary)`)
      "
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title class="col-grow q-pr-none">
          {{ title }}
        </q-toolbar-title>

        <component :is="componInBar"></component>

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
      @mini-state="clog"
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
        @setTitle.once="setTitle"
        :class="$q.dark.isActive ? `dark-page` : `white`"
      />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref, shallowRef, watch } from 'vue';
import EssentialLink from 'src/components/mainLayout/EssentialLink.vue';
import { useQuasar } from 'quasar';
import useInBar from 'src/components/global/inBar';

const linksList = [
  {
    title: 'Library',
    caption: '',
    icon: 'o_collections_bookmark',
    link: '/library'
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
    '$route.path'() {
      const bar = useInBar();
      bar.setInBar();
    },
    scrollbarTheme(neww, old) {
      document.body.classList.remove(old);
      document.body.classList.add(neww);
    }
  },
  methods: {
    clog(data: boolean) {
      this.$bus.emit('miniDrawer', data);
    },
    setTitle(titl: string) {
      this.title = titl;
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
  setup() {
    const $q = useQuasar();
    const bar = useInBar();
    $q.dark.set(<boolean>$q.localStorage.getItem('dark'));
    const leftDrawerOpen = ref(true);
    let componInBar = shallowRef();
    watch(bar.inbar, () => {
      componInBar.value = bar.inbar.value;
    });
    return {
      title: ref('Quasar App'),
      essentialLinks: linksList,
      tru: ref(true),
      leftDrawerOpen,
      toggledark() {
        $q.dark.toggle();
        $q.localStorage.set('dark', $q.dark.isActive);
      },
      doSearch: ref(false),
      Searchenter: ref(false),
      componInBar
    };
  }
});
</script>

<style scoped>
.text-primary {
  color: var(--q-primary) !important;
}
</style>
