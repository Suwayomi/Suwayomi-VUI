<template>
  <q-page>
    <div>
      <q-infinite-scroll
        @load="onLoad"
        :offset="$q.screen.height / 2"
        ref="infiniteScroll"
      >
        <div v-for="(item, index) in items" :key="index" class="caption">
          <displayPage
            :pageNum="index"
            :chapterID="item.index"
            v-for="(_page, index) in item.pageCount"
            :key="index"
          >
          </displayPage>
          <q-card style="height: 50vh" class="column text-center">
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
  setup() {
    console.log('hi');
    const route = useRoute();
    const items = ref(<chapter[]>[]);
    const currchapter = ref(<number>parseInt(`${route.params['chapterID']}`));
    return { items, currchapter };
  }
});
</script>
