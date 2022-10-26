<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div>
    <h4 class="q-ma-md" ref="chapHead">{{ chapters.length }} chapters</h4>
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
        v-for="item in chapters"
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
            <q-item-label>{{ item.name }}</q-item-label>
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

export default defineComponent({
  name: 'mangaChapters',
  created: async function () {
    this.getonline();
  },
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
    }
  },
  computed: {
    scrollbarTheme(): string {
      return this.$q.dark.isActive ? 'darkSB' : 'lightSB';
    }
  },
  setup() {
    const chapters = ref(<chapter[]>[]);
    return { chapters };
  }
});
</script>
