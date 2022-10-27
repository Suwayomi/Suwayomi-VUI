<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div>
    <div class="row justify-between items-center" ref="chapHead">
      <h4 class="q-ma-md">{{ chapters.length }} chapters</h4>
      <div style="padding-right: 12px">
        <filterr @checkchange="checkchange()"></filterr>
      </div>
    </div>
    <div
      style="overflow-y: auto"
      :style="
        $q.screen.sm || $q.screen.xs
          ? ``
          : `max-height: calc(100vh - ` + calcHeight() + `px)`
      "
      :class="scrollbarTheme"
    >
      <q-intersection
        v-for="item in chaptersfilt"
        :key="item.index"
        style="height: 58px"
      >
        <q-item
          clickable
          v-ripple
          :dark="$q.dark.isActive"
          class="q-ma-sm rounded-borders"
          :class="item.read ? `text-grey` : ``"
          :style="
            `background-color:` +
            ($q.dark.isActive ? `var(--q-dark)` : `var(--q-light)`)
          "
          :to="`/manga/` + item.mangaId + `/chapter/` + item.index"
          :key="item.index"
        >
          <q-item-section v-if="item.bookmarked" side>
            <q-item-label
              ><q-icon color="primary" name="bookmark" size="sm"></q-icon>
            </q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{
              disp == 'source' ? item.name : 'Chapter ' + item.chapterNumber
            }}</q-item-label>
            <q-item-label caption>
              {{ item.scanlator }}
              {{ new Date(item.uploadDate).toLocaleDateString() }}
              {{ item.downloaded ? '• downloaded' : '' }}
            </q-item-label>
          </q-item-section>
          <q-btn @click.prevent round flat icon="more_vert" class="flex-right">
            <q-menu>
              <q-list style="width: fit-content">
                <q-item
                  v-if="!item.downloaded"
                  clickable
                  v-close-popup
                  @click="download(item.index)"
                >
                  <q-item-section>Download</q-item-section>
                </q-item>
                <q-item
                  v-if="item.downloaded"
                  clickable
                  v-close-popup
                  @click="dele(item.index)"
                >
                  <q-item-section>Delete</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  @click="
                    mpatch(item.index, [['bookmarked', `${!item.bookmarked}`]])
                  "
                >
                  <q-item-section>{{
                    !item.bookmarked ? `Bookmark` : `Remove bookmark`
                  }}</q-item-section>
                </q-item>
                <q-item
                  @click="
                    mpatch(item.index, [
                      ['read', `${!item.read}`],
                      ['lastPageRead', '1']
                    ])
                  "
                  clickable
                  v-close-popup
                >
                  <q-item-section>{{
                    !item.read ? `Mark as Read` : `Mark as Unread`
                  }}</q-item-section>
                </q-item>
                <q-item
                  @click="mpatch(item.index, [['markPrevRead', 'true']])"
                  clickable
                  v-close-popup
                >
                  <q-item-section style="white-space: nowrap"
                    >Mark previous as Read</q-item-section
                  >
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-item>
      </q-intersection>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { chapter } from 'src/components/global/models';
import fetcher from 'src/components/global/fetcher';
import filterr from './Filter.vue';
import { chaptersFilter } from './filters';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'mangaChapters',
  created: async function () {
    this.getonline();
  },
  components: { filterr },
  methods: {
    calcHeight() {
      const tmp = <Element | undefined>this.$refs['chapHead'];
      if (tmp == undefined) return 0;
      let elHeight = tmp.getBoundingClientRect().bottom;
      elHeight += parseInt(
        window.getComputedStyle(tmp).getPropertyValue('margin-bottom')
      );
      return elHeight || 0;
    },
    async getonline(TF = 'false', retry = 2) {
      try {
        const resp = await fetcher(
          `/api/v1/manga/${this.$route.params['id']}/chapters?onlineFetch=${TF}`
        );
        this.chapters = <chapter[]>await resp.json();
        this.doFilters();
      } catch (e) {
        retry--;
        if (retry >= 0) {
          console.warn(
            'fetch chapters failed in chapterList Retrying, retries left: ' +
              retry
          );
          this.getonline(TF, retry);
        } else {
          console.error('fetch chapters failed in chapterList');
        }
      }
    },
    async download(index: number) {
      await fetcher(
        `/api/v1/download/${this.$route.params['id']}/chapter/${index}`
      );
    },
    async dele(index: number) {
      await fetcher(
        `/api/v1/manga/${this.$route.params['id']}/chapter/${index}`,
        { method: 'DELETE' }
      );
      this.getonline();
    },
    async mpatch(index: number, FD: [string, string][]) {
      const fd = new FormData();
      FD.forEach((dat) => {
        fd.append(...dat);
      });
      await fetcher(
        `/api/v1/manga/${this.$route.params['id']}/chapter/${index}`,
        { method: 'PATCH', body: fd }
      );
      this.getonline();
    },
    doFilters() {
      this.chaptersfilt = this.chapters;
      this.doUnread(this.chaptersfilt);
      this.doDownloaded(this.chaptersfilt);
      this.doBookmarked(this.chaptersfilt);

      this.doSorts();
    },
    doSorts() {
      this.doSource(this.chaptersfilt);
      this.doFetchDate(this.chaptersfilt);
    },
    doUnread(chapt: chapter[]) {
      if (this.filters.Unread != null) {
        this.chaptersfilt = chapt.filter((ele) =>
          this.filters.Unread ? ele.read : !ele.read
        );
      }
    },
    doDownloaded(chapt: chapter[]) {
      if (this.filters.Downloaded != null) {
        this.chaptersfilt = chapt.filter((ele) =>
          this.filters.Downloaded ? ele.downloaded : !ele.downloaded
        );
      }
    },
    doBookmarked(chapt: chapter[]) {
      if (this.filters.Bookmarked != null) {
        this.chaptersfilt = chapt.filter((ele) =>
          this.filters.Bookmarked ? ele.bookmarked : !ele.bookmarked
        );
      }
    },
    doSource(chapt: chapter[]) {
      if (this.filters.Source != null) {
        this.chaptersfilt = chapt.sort((a, b) =>
          this.filters.Source
            ? a.index > b.index
              ? 1
              : -1
            : a.index < b.index
            ? 1
            : -1
        );
      }
    },
    doFetchDate(chapt: chapter[]) {
      if (this.filters.FetchDate != null) {
        this.chaptersfilt = chapt.sort((a, b) =>
          this.filters.FetchDate
            ? a.fetchedAt > b.fetchedAt
              ? -1
              : 1
            : a.fetchedAt < b.fetchedAt
            ? -1
            : 1
        );
      }
    },
    checkchange() {
      const tmp = chaptersFilter(parseInt(`${this.$route.params['id']}`));
      if (
        this.filters.Unread != tmp.Unread ||
        this.filters.Bookmarked != tmp.Bookmarked ||
        this.filters.Downloaded != tmp.Downloaded
      ) {
        this.filters = tmp;
        this.doFilters();
      }
      if (
        this.filters.Source != tmp.Source ||
        this.filters.FetchDate != tmp.FetchDate
      ) {
        if ((tmp.Source == null) != (tmp.FetchDate == null)) {
          this.filters = tmp;
          this.doSorts();
        }
      }
      if (this.filters.Display != tmp.Display) {
        this.filters = tmp;
        this.disp = tmp.Display;
      }
    }
  },
  computed: {
    scrollbarTheme(): string {
      return this.$q.dark.isActive ? 'darkSB' : 'lightSB';
    }
  },
  setup() {
    const route = useRoute();
    const filters = ref(chaptersFilter(parseInt(`${route.params['id']}`)));
    const chapters = ref(<chapter[]>[]);
    const chaptersfilt = ref(<chapter[]>[]);
    return {
      chapters,
      chaptersfilt,
      filters,
      disp: ref(filters.value.Display),
      mangaid: parseInt(`${route.params['id']}`)
    };
  }
});
</script>
