<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <div ref="MangaGrid" class="flex">
    <q-intersection
      v-for="manga in dosrt"
      :key="manga.id"
      :style="widt"
      transition="fade"
    >
      <MangaCard
        :display="Displ"
        :ubadge="filters.Ubadge"
        :dbadge="filters.Dbadge"
        :manga="manga"
      ></MangaCard>
    </q-intersection>
  </div>
  <q-inner-loading
    style="
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: fit-content;
      height: fit-content;
      background-color: transparent;
    "
    :showing="!dosrt.length"
    color="primary"
  >
  </q-inner-loading>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { manga } from 'src/components/global/models';
import MangaCard from 'src/components/library/MangaCard.vue';
import Filters from 'src/components/library/Filters';
import { debounce } from 'quasar';

export default defineComponent({
  name: 'MangaGrid',
  components: { MangaCard },
  setup() {
    const filters = ref(Filters());
    const devider = ref<number>(0);
    const clwidth = ref<number>(0);
    const mangas = ref(<manga[]>[]);
    return {
      devider,
      mangas,
      filters,
      clwidth,
    };
  },
  computed: {
    doFilt(): manga[] {
      let mangas = this.mangas;
      if (this.$route.query['q']) {
        mangas = mangas.filter((manga) =>
          manga.title
            .toLowerCase()
            .includes(`${this.$route.query['q'] || ''}`.toLowerCase())
        );
      }
      if (this.filters.unread != null) {
        mangas = mangas.filter((manga) =>
          this.filters.unread ? !!manga.unreadCount : !manga.unreadCount
        );
      }
      if (this.filters.downloaded != null) {
        mangas = mangas.filter((manga) =>
          this.filters.downloaded ? !!manga.downloadCount : !manga.downloadCount
        );
      }
      return mangas;
    },
    dosrt(): manga[] {
      let mangas = this.doFilt;
      if (this.filters.leftToRead != null) {
        mangas = mangas.sort((a, b) => {
          if (this.filters.leftToRead) {
            return a.unreadCount >= b.unreadCount ? -1 : 1;
          }
          return a.unreadCount <= b.unreadCount ? -1 : 1;
        });
      }
      if (this.filters.alphabetical != null) {
        mangas = mangas.sort((a, b) => {
          if (this.filters.alphabetical) {
            return a.title >= b.title ? -1 : 1;
          }
          return a.title <= b.title ? -1 : 1;
        });
      }
      if (this.filters.ByID != null) {
        mangas = mangas.sort((a, b) => {
          if (this.filters.ByID) {
            return a.id >= b.id ? -1 : 1;
          }
          return a.id <= b.id ? -1 : 1;
        });
      }
      return mangas;
    },
    Displ() {
      if (this.filters.Display == null) {
        return 'compact';
      } else if (this.filters.Display) {
        return 'comfort';
      }
      return 'list';
    },
    widt(): string {
      return this.Displ == 'list'
        ? 'width:100%; height: 109px;'
        : `width: calc(100% / ${this.devider}); aspect-ratio: 225/350;transition: width 0.5s ease-out;`;
    },
  },
  watch: {
    '$route.query.tab': async function (val: number | undefined) {
      this.reload(val);
    },
  },
  created: async function () {
    this.calcWidth = debounce(this.calcWidth, 500);
    this.reload(this.$route.query['tab'] as number | undefined);
  },
  mounted: function () {
    this.calcWidth();
    this.$nextTick(() => {
      window.addEventListener('resize', this.calcWidth);
    });
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.calcWidth);
  },
  methods: {
    calcWidth() {
      const grid = <Element>this.$refs['MangaGrid'];
      const ideal = <number>this.$storeGet('MitemW', 300);
      if (grid.clientWidth == undefined) return;
      this.devider = Math.round(grid.clientWidth / ideal);
    },
    calcHeight() {
      const parent = this.$parent?.$el;
      if (parent) {
        let Height = parent.clientHeight;
        Height -= parent.children[0].clientHeight;
        return Height;
      }
      return 0;
    },
    async reload(val: number | undefined) {
      if (val != undefined) {
        this.mangas = [];
        this.mangas = <manga[]>(
          (await this.$api.get(`/api/v1/category/${this.$route.query['tab']}`))
            .data
        );
      }
    },
  },
});
</script>
