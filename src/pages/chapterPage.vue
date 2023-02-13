<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <q-page :style-fn="myTweak" @click="handleClick">
    <div>
      <q-infinite-scroll
        ref="infiniteScrol"
        :offset="$q.screen.height * 5"
        @load="onLoad"
      >
        <div v-for="(item, indexx) in items" :key="indexx" :class="divClass">
          <div v-if="vue_Offset && isBook2" style="width: 50%"></div>
          <displayPage
            v-for="(_page, index) in item.pageCount"
            :key="index"
            v-intersection="onIntersection"
            :page-num="
              vue_RM == 'RTL' ? (index % 2 ? index - 1 : index + 1) : index
            "
            :chapter-i-d="item.index"
            :data-pid="index"
            :data-cid="item.index"
            :data-pcount="item.pageCount"
            :vue-r-m="vue_RM"
            :vue-w-t="vue_WT"
            :vue-scale="vue_Scale"
            :vue-offset="vue_Offset"
            :imdata="pagee(item.index, index)"
          >
          </displayPage>
          <q-card
            style="height: 100vh; max-height: 500px"
            :style="isBook2 ? `width:100%` : ``"
            class="column text-center q-ml-md"
          >
            <h5 class="col">End of {{ item.name }}</h5>
            <p class="col">
              {{
                item.index >= item.chapterCount
                  ? 'no chapters remaining'
                  : 'keep scrolling for the next chapter'
              }}
            </p>
          </q-card>
        </div>
        <template #loading>
          <div class="row justify-center q-py-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
    </div>
    <div v-if="pathVisable">
      <div
        class="fixed"
        style="background-color: rgba(0, 0, 255, 0.5)"
        :style="clipPathF"
      ></div>
      <div
        class="fixed"
        style="background-color: rgba(255, 0, 0, 0.5)"
        :style="clipPathB"
      ></div>
      <div
        v-if="clipPathM"
        class="fixed"
        style="background-color: rgba(0, 255, 0, 0.5)"
        :style="clipPathM"
      ></div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { QInfiniteScroll } from 'quasar';
import { chapter } from 'src/components/global/models';
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import displayPage from 'src/components/reader/displayPage.vue';
import { chapterMeta } from 'src/components/reader/readerSettings';
import { getImgBlob } from 'src/components/global/usefull';
import { paths } from 'src/components/global/models';

const pathss: paths = {
  L: {
    forward: [
      [100, 100],
      [100, 0],
      [66, 0],
      [66, 66],
      [0, 66],
      [0, 100],
    ],
    back: [
      [33, 33],
      [66, 33],
      [66, 0],
      [0, 0],
      [0, 66],
      [33, 66],
    ],
    menu: [
      [33, 33],
      [66, 33],
      [66, 66],
      [33, 66],
    ],
  },
  RAL: {
    forward: [
      [66, 0],
      [100, 0],
      [100, 100],
      [66, 100],
    ],
    back: [
      [0, 0],
      [33, 0],
      [33, 100],
      [0, 100],
    ],
    menu: [
      [33, 0],
      [66, 0],
      [66, 100],
      [33, 100],
    ],
  },
  Kindle: {
    forward: [
      [33, 33],
      [33, 100],
      [100, 100],
      [100, 33],
    ],
    back: [
      [33, 33],
      [33, 100],
      [0, 100],
      [0, 33],
    ],
    menu: [
      [0, 0],
      [100, 0],
      [100, 33],
      [0, 33],
    ],
  },
  Edge: {
    forward: [
      [100, 0],
      [100, 100],
      [0, 100],
      [0, 0],
      [33, 0],
      [33, 100],
      [66, 100],
      [66, 0],
    ],
    back: [
      [33, 66],
      [66, 66],
      [66, 100],
      [33, 100],
    ],
    menu: [
      [33, 66],
      [66, 66],
      [66, 0],
      [33, 0],
    ],
  },
};

export default defineComponent({
  name: 'ChapterPage',
  components: { displayPage },
  emits: ['set-title', 'open-menu', 'title-data'],
  setup() {
    const pageIntersectEleArr = ref(<HTMLElement[]>[]);
    const items = ref(<chapter[]>[]);
    const route = useRoute();
    const currchapter = ref(<number>parseInt(`${route.params['chapterID']}`));
    const nextChapter = ref(<Promise<chapter> | undefined>undefined);
    const Pages = ref(<(Promise<string> | undefined)[][]>[]);
    const options = chapterMeta(parseInt(`${route.params['mangaID']}`));
    const vue_RM = options.vue_RM;
    const vue_Path = options.vue_Paths;
    const pathVisable = options.pathVisable;
    const vue_WT = options.vue_WT;
    const vue_Scale = options.vue_Scale;
    const vue_Offset = options.vue_Offset;
    const vue_title = options.vue_title;
    const chapname = ref(<string>'');
    const usedpath = options.vue_Paths;
    return {
      items,
      currchapter,
      nextChapter,
      Pages,
      vue_RM,
      vue_Path,
      pathVisable,
      vue_WT,
      vue_Scale,
      vue_Offset,
      chapname,
      vue_title,
      pageIntersectEleArr,
      scrolltimeout: ref(true),
      usedpath,
    };
  },
  computed: {
    isBook(): boolean {
      return ['RTL', 'LTR', 'SinglePage'].includes(this.vue_RM);
    },
    isBook2(): boolean {
      return ['RTL', 'LTR'].includes(this.vue_RM);
    },
    divClass(): string {
      if (this.isBook2) {
        return 'row items-center';
      }
      return '';
    },
    clipPathF(): string {
      const path = pathss[this.usedpath].forward;
      return `clip-path: polygon(${path
        .map((point) => {
          return point
            .map((persent) => {
              return persent == 0 ? persent.toString() : `${persent}%`;
            })
            .join(' ');
        })
        .join(',')});top: 0;
      bottom: 0;
      left: 0;
      right: 0;`;
    },
    clipPathB(): string {
      const path = pathss[this.usedpath].back;
      return `clip-path: polygon(${path
        .map((point) => {
          return point
            .map((persent) => {
              return persent == 0 ? persent.toString() : `${persent}%`;
            })
            .join(' ');
        })
        .join(',')});top: 0;
      bottom: 0;
      left: 0;
      right: 0;`;
    },
    clipPathM(): string {
      const path = pathss[this.usedpath].menu;
      if (path === undefined) return '';
      return `clip-path: polygon(${path
        .map((point) => {
          return point
            .map((persent) => {
              return persent == 0 ? persent.toString() : `${persent}%`;
            })
            .join(' ');
        })
        .join(',')});top: 0;
      bottom: 0;
      left: 0;
      right: 0;`;
    },
  },
  watch: {
    chapname() {
      this.$emit('title-data', [this.chapname, this.vue_title]);
    },
  },
  created() {
    window.addEventListener('keydown', this.keyHandeler);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.keyHandeler);
  },
  methods: {
    async getImg(chapterID: number, pageNum: number): Promise<string> {
      return getImgBlob(
        `/api/v1/manga/${this.$route.params['mangaID']}/chapter/${chapterID}/page/${pageNum}`
      );
    },
    myTweak(offset: number) {
      return {
        height: offset ? `calc(100vh - ${offset}px)` : '100vh',
      };
    },
    onChapter(data: chapter, done: () => void) {
      this.items.push(data);
      if (this.currchapter != parseInt(`${this.$route.params['chapterID']}`)) {
        if (this.$route.name?.toString() == 'chapterpage') {
          this.$router.replace(
            `/manga/${this.$route.params['mangaID']}/chapter/${this.currchapter}`
          );
        }
      }
      done();
      this.chapname = data.name;
      this.$emit('set-title', `${this.vue_title} ${data.name}`);
      if (this.currchapter >= data.chapterCount) {
        (this.$refs['infiniteScrol'] as QInfiniteScroll).stop();
      } else {
        this.currchapter++;
        this.getNextChap();
      }
    },
    onLoad(_index: number, done: () => void) {
      if (this.nextChapter === undefined) {
        this.$api
          .get<chapter>(
            `/api/v1/manga/${this.$route.params['mangaID']}/chapter/${this.currchapter}`
          )
          .then(({ data }) => {
            this.Pages[this.currchapter] = [];
            for (let i = 0; i < data.pageCount; i++) {
              this.Pages[this.currchapter]?.push(this.getImg(data.index, i));
            }
            this.onChapter(data, done);
          });
      } else {
        this.nextChapter.then((data) => {
          this.onChapter(data, done);
        });
      }
    },
    async getNextChap() {
      this.nextChapter = this.$api
        .get<chapter>(
          `/api/v1/manga/${this.$route.params['mangaID']}/chapter/${this.currchapter}`
        )
        .then(({ data }) => data);
      this.nextChapter.then((data) => {
        this.Pages[this.currchapter] = [];
        for (let i = 0; i < data.pageCount; i++) {
          this.Pages[this.currchapter]?.push(this.getImg(data.index, i));
        }
      });
    },
    onIntersection(entry: IntersectionObserverEntry) {
      const element = entry.target as HTMLElement;
      if (entry.isIntersecting) {
        this.setReadPages(element);
        element.dataset['isint'] = 'true';
      } else {
        element.dataset['isint'] = undefined;
      }
    },
    setReadPages(ele: HTMLElement) {
      this.$api.patchForm(
        `/api/v1/manga/${this.$route.params['mangaID']}/chapter/${ele.dataset['cid']}`,
        {
          lastPageRead: `${parseInt(ele.dataset['pid'] as string) + 1}`,
        }
      );
      if (
        parseInt(ele.dataset['pid'] as string) >=
        parseInt(ele.dataset['pcount'] as string) - 1
      ) {
        this.$api.patchForm(
          `/api/v1/manga/${this.$route.params['mangaID']}/chapter/${ele.dataset['cid']}`,
          {
            read: 'true',
          }
        );
      }
    },
    goNextIntersector80() {
      if (this.scrolltimeout) {
        this.scrolltimeout = false;
        setTimeout(() => {
          this.scrolltimeout = true;
        }, 500);

        const vp = window.visualViewport as VisualViewport;
        const top = vp.pageTop;
        const bottom = vp.pageTop + vp.height;
        const intsect = Array.from(
          (this.$refs['infiniteScrol'] as QInfiniteScroll).$el.querySelectorAll(
            '[data-isint=true]'
          )
        ) as HTMLElement[];

        if (intsect.length > 0) {
          const ele = intsect[intsect.length - 1] as HTMLElement;
          if (ele.offsetTop > bottom || ele.offsetTop <= top) {
            ele.dataset['isint'] = undefined;
            this.scrolltimeout = true;
            this.goNextIntersector80();
            return;
          }

          if (ele) {
            intsect.forEach((elemen: HTMLElement) => {
              elemen.dataset['isint'] = elemen == ele ? 'true' : undefined;
            });
            window.scrollTo({
              top: ele.offsetTop,
              left: 0,
              behavior: 'smooth',
            });
          }
        } else {
          this.scroll80();
        }
      }
    },
    scroll80() {
      const vp = window.visualViewport as VisualViewport;
      window.scrollTo({
        top: vp.pageTop + vp.height * 0.8,
        left: 0,
        behavior: 'smooth',
      });
    },
    scrollUp80() {
      if (this.scrolltimeout) {
        this.scrolltimeout = false;
        setTimeout(() => {
          this.scrolltimeout = true;
        }, 500);
        const vp = window.visualViewport as VisualViewport;
        window.scrollTo({
          top: vp.pageTop - vp.height * 0.8,
          left: 0,
          behavior: 'smooth',
        });
      }
    },
    keyHandeler(e: KeyboardEvent) {
      if (e.key == ' ') {
        e.preventDefault();
        this.goNextIntersector80();
      }
    },
    pagee(chapterID: number, pageNum: number): Promise<string> {
      const tmp = this.Pages[chapterID] as
        | (Promise<string> | undefined)[]
        | undefined;
      if (tmp?.length) {
        const tmp2 = tmp[pageNum] as Promise<string> | undefined;
        if (tmp2 != undefined) {
          return tmp2;
        }
      }
      return this.getImg(chapterID, pageNum);
    },
    handleClick(e: MouseEvent) {
      if (
        this.pointInPoly(
          [e.x, e.y],
          this.polyToPOLLY(pathss[this.usedpath].forward)
        )
      ) {
        this.goNextIntersector80();
      } else if (
        this.pointInPoly(
          [e.x, e.y],
          this.polyToPOLLY(pathss[this.usedpath].back)
        )
      ) {
        this.scrollUp80();
      } else if (
        pathss[this.usedpath].menu &&
        this.pointInPoly(
          [e.x, e.y],
          this.polyToPOLLY(pathss[this.usedpath].menu)
        )
      ) {
        this.$emit('open-menu');
      }
    },
    polyToPOLLY(
      polly: [number, number][] | undefined
    ): [number, number][] | undefined {
      if (polly == undefined) return undefined;
      return polly.map((point) => {
        return [
          (point[0] * window.innerWidth) / 100,
          (point[1] * window.innerHeight) / 100,
        ];
      });
    },
    pointInPoly(
      point: [number, number],
      vs: [number, number][] | undefined
    ): boolean {
      // ray-casting algorithm based on
      // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
      if (vs == undefined) return false;
      const x = point[0],
        y = point[1];

      let inside = false;
      for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        const ii = vs[i] as [number, number];
        const jj = vs[j] as [number, number];
        const xi = ii[0],
          yi = ii[1];
        const xj = jj[0],
          yj = jj[1];

        const intersect =
          yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }

      return inside;
    },
  },
});
</script>
