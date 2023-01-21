<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <q-page :style-fn="myTweak">
    <div ref="infiniteScrol">
      <div v-for="({ source, mangas }, index) in searchResults" :key="index">
        <div>
          <div class="text-h6 q-ma-md">{{ source.displayName }}</div>
          <div style="overflow-x: auto">
            <div class="row no-wrap" style="width: max-content">
              <mangaCard
                v-for="manga in mangas"
                :key="manga.id"
                :style="widt"
                :manga="manga"
                :display="Displ"
              />
              <div v-if="!mangas.length" class="text-subtitle1 q-ma-md">
                No Manga
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="queue.pending" class="row justify-center q-my-md">
      <q-spinner-dots color="primary" size="40px" />
    </div>
  </q-page>
</template>

<script lang="ts">
import { manga, source, sourcepage } from 'src/components/global/models';
import { defineComponent, ref } from 'vue';
import PQueue from 'p-queue';
import Filters from 'src/components/extantions/Filters';
import mangaCard from 'src/components/sourceSearch/mangaCard.vue';
import { debounce } from 'quasar';
import Display from 'src/components/library/Filters';

export default defineComponent({
  components: { mangaCard },
  setup() {
    const queue = new PQueue({ concurrency: 5 });
    const controller = ref(new AbortController());
    const searchResults = ref(<{ source: source; mangas: manga[] }[]>[]);
    const sources = ref(<source[]>[]);
    const filters = Filters();
    const langs = ref(filters.langs);
    return {
      searchResults,
      queue,
      controller,
      sources,
      langs,
      display: ref(Display()),
      devider: ref<number>(0),
    };
  },
  computed: {
    Displ() {
      if (this.display.Display == null) {
        return 'compact';
      } else if (this.display.Display) {
        return 'comfort';
      }
      return 'compact';
    },
    widt(): string {
      return `width: calc(100vw / ${this.devider}); aspect-ratio: 225/350;transition: width 0.5s ease-out;height: fit-content;`;
    },
  },
  watch: {
    '$route.query.q'() {
      this.doSearch();
    },
  },
  created: function () {
    this.calcWidth = debounce(this.calcWidth, 500);
    this.$api.get<source[]>('/api/v1/source/list').then(({ data: sources }) => {
      this.sources = sources.filter((ele) => {
        return this.langs.includes(ele.lang);
      });
      this.doSearch();
    });
    this.queue.on(
      'completed',
      (result: { source: source; mangas: manga[] } | undefined) => {
        if (result != undefined) {
          this.searchResults = this.searchResults
            .concat(result)
            .sort((a, b) => {
              if (a.mangas.length == 0) {
                return 1;
              }
              if (b.mangas.length == 0) {
                return -1;
              }
              return 0;
            });
        }
      }
    );
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
    myTweak(offset: number) {
      return {
        height: offset ? `calc(100vh - ${offset}px)` : '100vh',
      };
    },
    calcWidth() {
      const grid = <Element>this.$refs['infiniteScrol'];
      const ideal = <number>this.$q.localStorage.getItem('MitemW');
      if (grid.clientWidth == undefined) return;
      this.devider = Math.round(grid.clientWidth / ideal);
    },
    doSearch() {
      if (this.$route.query['q']) {
        this.queue.clear();
        if (this.queue.pending) {
          this.controller.abort();
          this.controller = new AbortController();
        }
        this.searchResults = [];
        this.sources.forEach((source) => {
          this.queue.add(
            async ({ signal }) => {
              if (signal) {
                const request = this.$api.get<sourcepage>(
                  `/api/v1/source/${source.id}/search?searchTerm=${
                    this.$route.query['q'] || ''
                  }&pageNum=1`,
                  {
                    signal,
                  }
                );

                try {
                  return {
                    source: source,
                    mangas: (await request).data.mangaList,
                  };
                } catch (error) {
                  if (!(error instanceof DOMException)) {
                    return { source: source, mangas: [] };
                  } else {
                    console.error(error);
                  }
                }
              }
              return { source: source, mangas: [] };
            },
            {
              signal: this.controller.signal,
            }
          );
        });
      }
    },
  },
});
</script>
