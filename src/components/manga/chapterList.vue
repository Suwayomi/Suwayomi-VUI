<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <div ref="conta">
    <div class="row justify-between items-center" ref="chapHead">
      <h4 class="q-ma-md">{{ chapters.length }} chapters</h4>
      <div style="padding-right: 12px">
        <q-btn
          flat
          round
          icon="select_all"
          v-if="selectMode"
          @click="selectall"
        />
        <q-btn
          flat
          round
          :icon="selectMode ? `flip_to_front` : `flip_to_back`"
          @click="selectMode = !selectMode"
        />
        <q-btn round flat icon="more_vert">
          <q-menu anchor="bottom end" self="top right">
            <q-list style="width: fit-content">
              <!-- download -->
              <q-item clickable>
                <q-item-section side>
                  <q-icon name="keyboard_arrow_left" />
                </q-item-section>
                <q-item-section>download</q-item-section>
                <q-menu
                  anchor="top start"
                  self="top end"
                  style="white-space: nowrap"
                >
                  <q-list>
                    <q-item
                      v-close-popup
                      clickable
                      @click="
                        dl(
                          doSrt
                            .filter((ele) => !ele.downloaded)
                            .map((ele) => ele.id)
                        )
                      "
                    >
                      <q-item-section>Download All</q-item-section>
                    </q-item>
                    <q-item
                      v-close-popup
                      clickable
                      @click="
                        dl(
                          doSrt
                            .filter((ele) => !ele.downloaded)
                            .slice(-5)
                            .map((ele) => ele.id)
                        )
                      "
                    >
                      <q-item-section>Download Next 5</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-if="selectMode"
                      @click="dl(selected)"
                      v-close-popup
                    >
                      <q-item-section>Download Selected</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>

              <!-- read -->
              <q-item clickable>
                <q-item-section side>
                  <q-icon name="keyboard_arrow_left" />
                </q-item-section>
                <q-item-section>Read</q-item-section>
                <q-menu
                  anchor="top start"
                  self="top end"
                  style="white-space: nowrap"
                >
                  <q-list>
                    <q-item
                      v-close-popup
                      clickable
                      @click="
                        read(
                          doSrt.filter((ele) => !ele.read).map((ele) => ele.id)
                        )
                      "
                    >
                      <q-item-section>Read All</q-item-section>
                    </q-item>
                    <q-item
                      v-close-popup
                      clickable
                      @click="
                        read(
                          doSrt
                            .filter((ele) => !ele.read)
                            .slice(-5)
                            .map((ele) => ele.id)
                        )
                      "
                    >
                      <q-item-section>Read Next 5</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-if="selectMode"
                      @click="read(selected)"
                      v-close-popup
                    >
                      <q-item-section>Read Selected</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>

              <!-- unread -->
              <q-item clickable>
                <q-item-section side>
                  <q-icon name="keyboard_arrow_left" />
                </q-item-section>
                <q-item-section>Unread</q-item-section>
                <q-menu
                  anchor="top start"
                  self="top end"
                  style="white-space: nowrap"
                >
                  <q-list>
                    <q-item
                      v-close-popup
                      clickable
                      @click="
                        read(
                          doSrt
                            .filter((ele) => !!ele.read)
                            .map((ele) => ele.id),
                          false
                        )
                      "
                    >
                      <q-item-section>Unread All</q-item-section>
                    </q-item>
                    <q-item
                      v-close-popup
                      clickable
                      @click="
                        read(
                          doSrt
                            .filter((ele) => !!ele.read)
                            .slice(0, 5)
                            .map((ele) => ele.id),
                          false
                        )
                      "
                    >
                      <q-item-section>Unread Last 5</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-if="selectMode"
                      @click="read(selected, false)"
                      v-close-popup
                    >
                      <q-item-section>Unread Selected</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>

              <!-- bookmark -->
              <q-item clickable>
                <q-item-section side>
                  <q-icon name="keyboard_arrow_left" />
                </q-item-section>
                <q-item-section>Bookmark</q-item-section>
                <q-menu
                  anchor="top start"
                  self="top end"
                  style="white-space: nowrap"
                >
                  <q-list>
                    <q-item
                      v-close-popup
                      clickable
                      @click="
                        read(
                          doSrt
                            .filter((ele) => !ele.bookmarked)
                            .map((ele) => ele.id),
                          true,
                          'isBookmarked'
                        )
                      "
                    >
                      <q-item-section>Bookmark All</q-item-section>
                    </q-item>
                    <q-item
                      v-close-popup
                      clickable
                      @click="
                        read(
                          doSrt
                            .filter((ele) => !ele.bookmarked)
                            .slice(-5)
                            .map((ele) => ele.id),
                          true,
                          'isBookmarked'
                        )
                      "
                    >
                      <q-item-section>Bookmark Next 5</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-if="selectMode"
                      @click="read(selected, true, 'isBookmarked')"
                      v-close-popup
                    >
                      <q-item-section>Bookmark Selected</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>

              <!-- unbookmark -->
              <q-item clickable>
                <q-item-section side>
                  <q-icon name="keyboard_arrow_left" />
                </q-item-section>
                <q-item-section>Unbookmark</q-item-section>
                <q-menu
                  anchor="top start"
                  self="top end"
                  style="white-space: nowrap"
                >
                  <q-list>
                    <q-item
                      v-close-popup
                      clickable
                      @click="
                        read(
                          doSrt
                            .filter((ele) => !!ele.bookmarked)
                            .map((ele) => ele.id),
                          false,
                          'isBookmarked'
                        )
                      "
                    >
                      <q-item-section>Unbookmark All</q-item-section>
                    </q-item>
                    <q-item
                      v-close-popup
                      clickable
                      @click="
                        read(
                          doSrt
                            .filter((ele) => !!ele.bookmarked)
                            .slice(0, 5)
                            .map((ele) => ele.id),
                          false,
                          'isBookmarked'
                        )
                      "
                    >
                      <q-item-section>Unbookmark Last 5</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-if="selectMode"
                      @click="read(selected, false, 'isBookmarked')"
                      v-close-popup
                    >
                      <q-item-section>Unbookmark Selected</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <filterr></filterr>
      </div>
    </div>
    <q-scroll-area
      class="q-pr-xs"
      :dark="$q.dark.isActive"
      :style="
        $q.screen.sm || $q.screen.xs
          ? `height: 50vh`
          : `height: calc(100vh - ` + calcHeight() + `px)`
      "
      :class="selectMode ? ` selectmode` : ``"
    >
      <q-intersection
        v-for="item in doSrt"
        :key="item.index"
        style="height: 58px"
        class=""
      >
        <q-item
          v-touch-hold.mouse="() => handleHold(item.id)"
          :id="item.id"
          v-ripple
          clickable
          :dark="$q.dark.isActive"
          class="q-ma-sm rounded-borders"
          :class="
            (item.read ? `text-grey` : ``) +
            ` ` +
            (selected.includes(item.id) && selectMode ? `selected` : ``)
          "
          :style="itemstyle"
          :to="
            selectMode
              ? undefined
              : `/manga/` + item.mangaId + `/chapter/` + item.index
          "
          @click="selectMode ? selectthis(item.id) : undefined"
          :key="item.index"
        >
          <q-item-section v-if="item.bookmarked" side>
            <q-item-label
              ><q-icon color="primary" name="bookmark" size="sm"></q-icon>
            </q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{
              filters.Display == 'source'
                ? item.name
                : 'Chapter ' + item.chapterNumber
            }}</q-item-label>
            <q-item-label caption>
              {{ item.scanlator }}
              {{ new Date(item.uploadDate).toLocaleDateString() }}
              {{ item.downloaded ? '• downloaded' : '' }}
              {{
                downloads.find((ele) => ele.chapterIndex == item.index)?.state
                  ? `• ` +
                    downloads.find((ele) => ele.chapterIndex == item.index)
                      ?.state
                  : ``
              }}
              <q-linear-progress
                v-if="
                  downloads.find((ele) => ele.chapterIndex == item.index)
                    ?.state == `Downloading`
                "
                :value="
                  downloads.find((ele) => ele.chapterIndex == item.index)
                    ?.progress
                "
              />
            </q-item-label>
          </q-item-section>
          <q-icon
            v-if="selectMode"
            class="flex-right self-center"
            size="md"
            :color="selected.includes(item.id) ? `blue` : ``"
            :name="
              selected.includes(item.id)
                ? `check_box`
                : `check_box_outline_blank`
            "
            flat
          ></q-icon>
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
    </q-scroll-area>
    <q-page-sticky position="bottom-right" :offset="fabPos" ref="sticky">
      <router-link
        style="text-decoration: none; color: inherit"
        :is="draggingFab ? 'span' : 'router-link'"
        :to="res"
      >
        <q-btn
          fab
          class="Fabconsist"
          label="Resume"
          color="blue"
          icon="drag_indicator"
          v-touch-pan.prevent.mouse="moveFab"
        >
          <q-tooltip> draggable </q-tooltip>
        </q-btn>
      </router-link>
    </q-page-sticky>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import {
  chapter,
  dlsock,
  download,
  isdlsock
} from 'src/components/global/models';
import filterr from './Filter.vue';
import { chaptersFilter } from './filters';
import { useRoute } from 'vue-router';
import useDlSock from '../downloads/useDlSock';
import { QPageSticky } from 'quasar';

export default defineComponent({
  name: 'mangaChapters',
  created: async function () {
    this.$bus.on('updateManga', () => {
      this.getonline('true');
    });
    this.getonline();
  },
  components: { filterr },
  computed: {
    doFilt(): chapter[] {
      let chapts: chapter[] = this.chapters;
      if (this.filters.Unread != null) {
        chapts = chapts.filter((ele) =>
          this.filters.Unread ? !ele.read : ele.read
        );
      }
      if (this.filters.Downloaded != null) {
        chapts = chapts.filter((ele) =>
          this.filters.Downloaded ? ele.downloaded : !ele.downloaded
        );
      }
      if (this.filters.Bookmarked != null) {
        chapts = chapts.filter((ele) =>
          this.filters.Bookmarked ? ele.bookmarked : !ele.bookmarked
        );
      }
      return chapts;
    },
    doSrt(): chapter[] {
      let chapts: chapter[] = this.doFilt;
      if (this.filters.Source != null) {
        chapts = chapts.sort((a, b) =>
          this.filters.Source
            ? a.index > b.index
              ? 1
              : -1
            : a.index < b.index
            ? 1
            : -1
        );
      }
      if (this.filters.FetchDate != null) {
        chapts = chapts.sort((a, b) =>
          this.filters.FetchDate
            ? a.fetchedAt > b.fetchedAt
              ? -1
              : 1
            : a.fetchedAt < b.fetchedAt
            ? -1
            : 1
        );
      }
      return chapts;
    },
    itemstyle(): string {
      return (
        'background-color:' +
        (this.$q.dark.isActive ? 'var(--q-dark)' : 'var(--q-light)')
      );
    },
    res(): string {
      const notRead = this.doSrt.filter((ele) => !ele.read);
      if (!notRead.length) {
        return `/manga/${this.$route.params['mangaID']}/chapter/${1}`;
      } else {
        const notreadchap = <chapter>notRead[notRead.length - 1];
        return `/manga/${notreadchap.mangaId}/chapter/${notreadchap.index}`;
      }
    }
  },
  methods: {
    moveFab(ev: {
      isFirst: boolean;
      isFinal: boolean;
      delta: { x: number; y: number };
    }) {
      // would like to use TouchPan type but it doesnt seem to be correct(or not the correct type idk)
      this.draggingFab = ev.isFirst !== true && ev.isFinal !== true;
      let x = this.fabPos[0] - ev.delta.x;
      let y = this.fabPos[1] - ev.delta.y;

      const conta = (
        (this.$refs['conta'] as HTMLElement).parentElement as HTMLElement
      ).getBoundingClientRect();
      const stick = (
        this.$refs['sticky'] as QPageSticky
      ).$el.getBoundingClientRect();

      const maxy = conta.height;
      const sticky = stick.height;
      if (y > maxy - sticky) y = maxy - sticky;
      if (y < 0) y = 0;

      const maxx = conta.width;
      const stickx = stick.width;
      if (x > maxx - stickx) x = maxx - stickx;
      if (x < 0) x = 0;

      this.fabPos = [x, y];
    },
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
        this.chapters = <chapter[]>(
          await this.$fetchJSON(
            `/api/v1/manga/${this.$route.params['mangaID']}/chapters?onlineFetch=${TF}`
          )
        );
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
      await this.$fetch(
        `/api/v1/download/${this.$route.params['mangaID']}/chapter/${index}`
      );
    },
    async dele(index: number) {
      await this.$fetch(
        `/api/v1/manga/${this.$route.params['mangaID']}/chapter/${index}`,
        { method: 'DELETE' }
      );
      this.getonline();
    },
    async mpatch(index: number, FD: [string, string][]) {
      const fd = new FormData();
      FD.forEach((dat) => {
        fd.append(...dat);
      });
      await this.$fetch(
        `/api/v1/manga/${this.$route.params['mangaID']}/chapter/${index}`,
        { method: 'PATCH', body: fd }
      );
      this.getonline();
    },
    handleHold(id: number) {
      this.selectMode = true;
      this.selectthis(id);
    },
    selectthis(id: number) {
      if (this.selected.includes(id)) {
        this.selected = this.selected.filter((e) => e !== id);
      } else {
        this.selected.push(id);
      }
    },
    selectall() {
      if (!this.selected.length) {
        this.selected = this.doSrt.map((ele) => ele.id);
      } else {
        this.selected = [];
      }
    },
    dl(list: number[]) {
      const fd = { chapterIds: list };
      this.$fetch('/api/v1/download/batch', {
        method: 'POST',
        body: JSON.stringify(fd)
      });
    },
    read(list: number[], tf = true, rb: 'isRead' | 'isBookmarked' = 'isRead') {
      const fd = { chapterIds: list, change: { [rb]: tf } };
      this.$fetch(
        `/api/v1/manga/${this.$route.params['mangaID']}/chapter/batch`,
        {
          method: 'POST',
          body: JSON.stringify(fd)
        }
      ).then(() => this.getonline());
    }
  },
  watch: {
    'Emitter.eventsFromServer'(val) {
      const tmp = <dlsock>JSON.parse(val);
      if (isdlsock(tmp)) {
        const tmpp = tmp.queue.filter(
          (ele) => ele.mangaId == parseInt(`${this.$route.params['mangaID']}`)
        );
        if (this.downloadsnum != tmpp.length) {
          this.getonline();
        }
        this.downloadsnum = tmpp.length;
        this.downloads = tmpp;
      }
    }
  },
  setup() {
    const route = useRoute();
    const filters = ref(chaptersFilter(parseInt(`${route.params['mangaID']}`)));
    const chapters = ref(<chapter[]>[]);
    const chaptersfilt = ref(<chapter[]>[]);
    const Emitt = useDlSock();
    const Emitter = ref(Emitt);

    const downloads = ref(<download[]>[]);
    const downloadsnum = ref(0);
    const tmp = Emitt.eventsFromServer.value
      ? JSON.parse(Emitt.eventsFromServer.value)
      : [];
    if (isdlsock(tmp)) {
      const tmpp = tmp.queue.filter(
        (ele) => ele.mangaId == parseInt(`${route.params['mangaID']}`)
      );
      downloadsnum.value = tmpp.length;
      downloads.value = tmpp;
    }
    if (Emitter.value.isConnected) {
      Emitt.sendMsg('STATUS');
    }

    const fabPos = ref(<[number, number]>[18, 18]);
    const draggingFab = ref<boolean>(false);

    return {
      chapters,
      chaptersfilt,
      filters,
      Emitter,
      downloadsnum,
      downloads,
      selectMode: ref(false),
      selected: ref(<number[]>[]),
      fabPos,
      draggingFab
    };
  }
});
</script>

<style scoped>
.selected {
  opacity: 1 !important;
}
.selectmode .q-item {
  opacity: 0.5;
}
</style>

<style>
.Fabconsist .q-btn__content {
  flex-wrap: nowrap;
}
</style>
