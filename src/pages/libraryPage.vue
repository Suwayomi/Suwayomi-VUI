<template>
  <q-page :style-fn="myTweak">
    <div ref="MLspinner">
      <TabPanel active :tabs="tabs"></TabPanel>
    </div>
    <MangaGrid
      v-if="!failedFetch"
      :mangas="fltmangas"
      style="overflow-y: auto"
      :class="scrollbarTheme"
    >
    </MangaGrid>
    <q-dialog v-model="failedFetch" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class=""
          ><q-item>
            <q-item-section>
              <q-item-label class="text-h6 text-negative"
                >Getting categories failed.
              </q-item-label>
              <q-item-label class="text-info q-pt-lg">
                <div>Have you set your server address?</div>
                <div>Is the server running?</div>
                <div class="q-pt-sm">
                  Pressing Ok will take you to the settings page
                </div>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="ok" v-close-popup to="/settings" />
        </q-card-actions>
      </q-card>
    </q-dialog>

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
      :showing="!fltmangas.length"
      color="primary"
    >
    </q-inner-loading>
  </q-page>
</template>

<script lang="ts">
import { tab } from 'src/components/global/models';
import TabPanel from 'src/components/library/TabPanel.vue';
import { defineComponent, ref } from 'vue';
import { cat, manga } from 'src/components/global/models';
import MangaGrid from 'src/components/library/MangaGrid.vue';
import fetcher from 'src/components/global/fetcher';
import useInBar from 'src/components/global/inBar';
import libraryTopBar from 'src/components/library/TopBar.vue';
import Filters from 'src/components/library/Filters';

export default defineComponent({
  name: 'libraryPage',
  components: { TabPanel, MangaGrid },
  created: async function () {
    const Bar = useInBar();
    Bar.setInBar(libraryTopBar);
    try {
      const resp = await fetcher('/api/v1/category');
      const jsn: cat[] = await resp.json();
      this.tabs = jsn.map((cat) => {
        return {
          tabname: cat.name,
          tabID: cat.id
        };
      });
      this.getManga();
      this.$watch(
        () => [
          this.$route.query['q'],
          this.filters.unread,
          this.filters.downloaded
        ],
        () => {
          this.goAgain();
        }
      );
      this.$watch(
        () => [
          this.filters.leftToRead,
          this.filters.alphabetical,
          this.filters.ByID
        ],
        (vals: (boolean | 'null' | null)[]) => {
          if (vals.filter((ele) => ele === 'null').length == 2) {
            this.goAgain(false);
          }
        }
      );
    } catch (e) {
      this.failedFetch = true;
    }
  },
  watch: {
    '$route.query.tab'() {
      this.doFilters([]);
      this.getManga();
    }
  },
  methods: {
    goAgain(doFilter = true) {
      if (doFilter) {
        this.doFilters(this.mangas);
      } else {
        this.doSorts(this.fltmangas);
      }
    },
    async getManga() {
      if (this.$route.query['tab'] != undefined) {
        const resp = await fetcher(
          `/api/v1/category/${this.$route.query['tab']}`
        );
        let mangas = <manga[]>await resp.json();
        this.mangas = mangas;
        this.doFilters(this.mangas);
      }
    },
    doFilters(mangas: manga[]) {
      mangas = this.filterTxt(mangas);
      mangas = this.filterUR(mangas);
      mangas = this.filterDL(mangas);

      this.doSorts(mangas);
    },
    doSorts(mangas: manga[]) {
      mangas = this.sortL2R(mangas);
      mangas = this.sortAlph(mangas);
      mangas = this.sortByID(mangas);
      this.fltmangas = mangas;
    },
    sortL2R(mangas: manga[]) {
      if (this.filters.leftToRead != 'null') {
        mangas = mangas.sort((a, b) => {
          if (this.filters.leftToRead) {
            return a.unreadCount > b.unreadCount ? -1 : 1;
          }
          return a.unreadCount < b.unreadCount ? -1 : 1;
        });
      }
      return mangas;
    },
    sortAlph(mangas: manga[]) {
      if (this.filters.alphabetical != 'null') {
        mangas = mangas.sort((a, b) => {
          if (this.filters.alphabetical) {
            return a.title > b.title ? -1 : 1;
          }
          return a.title < b.title ? -1 : 1;
        });
      }
      return mangas;
    },
    sortByID(mangas: manga[]) {
      if (this.filters.ByID != 'null') {
        mangas = mangas.sort((a, b) => {
          if (this.filters.ByID) {
            return a.id > b.id ? -1 : 1;
          }
          return a.id < b.id ? -1 : 1;
        });
      }
      return mangas;
    },
    filterTxt(mangas: manga[]) {
      return mangas.filter((manga) =>
        manga.title
          .toLowerCase()
          .includes(`${this.$route.query['q'] || ''}`.toLowerCase())
      );
    },
    filterUR(mangas: manga[]) {
      if (this.filters.unread != null) {
        mangas = mangas.filter((manga) =>
          this.filters.unread ? !!manga.unreadCount : !manga.unreadCount
        );
      }
      return mangas;
    },
    filterDL(mangas: manga[]) {
      if (this.filters.downloaded != null) {
        mangas = mangas.filter((manga) =>
          this.filters.downloaded ? !!manga.downloadCount : !manga.downloadCount
        );
      }
      return mangas;
    },
    myTweak(offset: number) {
      return {
        height: offset ? `calc(100vh - ${offset}px)` : '100vh'
      };
    }
  },
  computed: {
    scrollbarTheme(): string {
      return this.$q.dark.isActive ? 'darkSB' : 'lightSB';
    }
  },
  setup(_props, { emit }) {
    const filters = ref(Filters());
    emit('setTitle', 'Library');
    const tabs = ref<tab[]>([]);
    const mangas = ref<manga[]>([]);
    const fltmangas = ref<manga[]>([]);
    const failedFetch = ref(false);
    return {
      tabs,
      mangas,
      fltmangas,
      filters,
      failedFetch
    };
  }
});
</script>
