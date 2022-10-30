<template>
  <q-page>
    <div>
      <q-infinite-scroll
        @load="onLoad"
        :offset="$q.screen.height / 2"
        ref="infiniteScroll"
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
            :vue_RM="vue_RM"
            :vue_WT="vue_WT"
            :vue_Scale="vue_Scale"
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
import fetcher from 'src/components/global/fetcher';
import { chapter } from 'src/components/global/models';
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import displayPage from 'src/components/reader/displayPage.vue';
import { chapterMeta } from 'src/components/reader/readerSettings';

export default defineComponent({
  name: 'chapterPage',
  components: { displayPage },
  methods: {
    onLoad(_index: number, done: () => void) {
      fetcher(
        `/api/v1/manga/${this.$route.params['mangaID']}/chapter/${this.currchapter}`
      )
        .then((res) => res.json())
        .then((data: chapter) => {
          this.items.push(data);
          if (
            this.currchapter != parseInt(`${this.$route.params['chapterID']}`)
          ) {
            this.$router.replace(
              `/manga/${this.$route.params['mangaID']}/chapter/${this.currchapter}`
            );
          }
          done();
          if (this.currchapter >= data.chapterCount)
            (this.$refs['infiniteScroll'] as QInfiniteScroll).stop();
          this.currchapter++;
        });
    }
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
  setup() {
    const items = ref(<chapter[]>[]);
    const route = useRoute();
    const currchapter = ref(<number>parseInt(`${route.params['chapterID']}`));
    const options = chapterMeta(parseInt(`${route.params['mangaID']}`));
    const vue_RM = options.vue_RM;
    const vue_WT = options.vue_WT;
    const vue_Scale = options.vue_Scale;
    const vue_Offset = options.vue_Offset;
    return { items, currchapter, vue_RM, vue_WT, vue_Scale, vue_Offset };
  }
});
</script>
