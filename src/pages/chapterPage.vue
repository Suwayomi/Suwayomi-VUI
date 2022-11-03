<template>
  <q-page @click="goNextIntersector80">
    <div>
      <q-infinite-scroll
        @load="onLoad"
        :offset="$q.screen.height * 5"
        ref="infiniteScrol"
      >
        <div v-for="(item, index) in items" :key="index" :class="divClass">
          <div style="width: 50%" v-if="vue_Offset && isBook2"></div>
          <displayPage
            :pageNum="
              vue_RM == 'RTL' ? (index % 2 ? index - 1 : index + 1) : index
            "
            :chapterID="item.index"
            v-for="(_page, index) in item.pageCount"
            :key="index"
            :data-pid="index"
            :data-cid="item.index"
            :data-pcount="item.pageCount"
            v-intersection="onIntersection"
            :vue_RM="vue_RM"
            :vue_WT="vue_WT"
            :vue_Scale="vue_Scale"
            :vue_Offset="vue_Offset"
          >
          </displayPage>
          <q-card
            style="height: 50vh"
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
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
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

export default defineComponent({
  name: 'chapterPage',
  components: { displayPage },
  emits: ['setTitle'],
  methods: {
    onLoad(_index: number, done: () => void) {
      this.$fetchJSON(
        `/api/v1/manga/${this.$route.params['mangaID']}/chapter/${this.currchapter}`
      ).then((data: chapter) => {
        this.items.push(data);
        if (
          this.currchapter != parseInt(`${this.$route.params['chapterID']}`)
        ) {
          this.$router.replace(
            `/manga/${this.$route.params['mangaID']}/chapter/${this.currchapter}`
          );
        }
        done();
        this.chapname = data.name;
        this.$emit('setTitle', `${this.vue_title} ${data.name}`);
        if (this.currchapter >= data.chapterCount)
          (this.$refs['infiniteScrol'] as QInfiniteScroll).stop();
        this.currchapter++;
      });
    },
    onIntersection(entry: IntersectionObserverEntry) {
      const element = entry.target as HTMLElement;
      if (entry.isIntersecting) {
        this.pageIntersectEleArr.push(element);
        this.setReadPages(element);
      } else {
        this.pageIntersectEleArr = this.pageIntersectEleArr.filter(
          (ele) =>
            !(
              ele.dataset['pid'] == element.dataset['pid'] &&
              ele.dataset['cid'] == element.dataset['cid']
            )
        );
      }
    },
    setReadPages(ele: HTMLElement) {
      const fd = new FormData();
      fd.append(
        'lastPageRead',
        `${parseInt(ele.dataset['pid'] as string) + 1}`
      );
      this.$fetch(
        `/api/v1/manga/${this.$route.params['mangaID']}/chapter/${ele.dataset['cid']}`,
        {
          method: 'PATCH',
          body: fd
        }
      );
      if (
        parseInt(ele.dataset['pid'] as string) >=
        parseInt(ele.dataset['pcount'] as string) - 1
      ) {
        const fd = new FormData();
        fd.append('read', 'true');
        this.$fetch(
          `/api/v1/manga/${this.$route.params['mangaID']}/chapter/${ele.dataset['cid']}`,
          {
            method: 'PATCH',
            body: fd
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

        if (this.pageIntersectEleArr.length > 1) {
          const element =
            this.pageIntersectEleArr[this.pageIntersectEleArr.length - 1];
          if (element) {
            const vp = window.visualViewport as VisualViewport;
            if (
              element.offsetTop > vp.pageTop + vp.height ||
              element.offsetTop < vp.pageTop
            ) {
              this.pageIntersectEleArr = this.pageIntersectEleArr.filter(
                (ele) =>
                  !(
                    ele.dataset['pid'] == element.dataset['pid'] &&
                    ele.dataset['cid'] == element.dataset['cid']
                  )
              );
              this.goNextIntersector80();
            } else {
              this.pageIntersectEleArr = [element];
              const top = element.offsetTop + 1;
              window.scrollTo({
                top,
                left: 0,
                behavior: 'smooth'
              });
            }
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
        behavior: 'smooth'
      });
    },
    keyHandeler(e: KeyboardEvent) {
      if (e.key == ' ') {
        e.preventDefault();
        this.goNextIntersector80();
      }
    }
  },
  created() {
    window.addEventListener('keydown', this.keyHandeler);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.keyHandeler);
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
    }
  },
  watch: {
    vue_title() {
      this.$emit('setTitle', `${this.chapname} ${this.vue_title}`);
    }
  },
  setup() {
    const pageIntersectEleArr = ref(<HTMLElement[]>[]);
    const items = ref(<chapter[]>[]);
    const route = useRoute();
    const currchapter = ref(<number>parseInt(`${route.params['chapterID']}`));
    const options = chapterMeta(parseInt(`${route.params['mangaID']}`));
    const vue_RM = options.vue_RM;
    const vue_WT = options.vue_WT;
    const vue_Scale = options.vue_Scale;
    const vue_Offset = options.vue_Offset;
    const vue_title = options.vue_title;
    const chapname = ref(<string>'');
    return {
      items,
      currchapter,
      vue_RM,
      vue_WT,
      vue_Scale,
      vue_Offset,
      chapname,
      vue_title,
      pageIntersectEleArr,
      scrolltimeout: ref(true)
    };
  }
});
</script>
