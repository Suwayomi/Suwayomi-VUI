<template>
  <q-infinite-scroll
    @load="onLoad"
    :offset="$q.screen.height / 2"
    ref="infiniteScrol"
  >
    <div class="flex">
      <q-intersection v-for="manga in items" :key="manga.id" :style="widt">
        <MangaCard :Display="Displ" :manga="manga"></MangaCard>
      </q-intersection>
    </div>
    <template v-slot:loading>
      <div class="row justify-center q-my-md">
        <q-spinner-dots color="primary" size="40px" />
      </div>
    </template>
  </q-infinite-scroll>
  <q-page-sticky position="bottom-right" :offset="[18, 18]">
    <q-btn
      fab
      class="text-black"
      icon="filter_list"
      color="blue"
      label="FILTER"
      @click="filterDial = true"
    />
  </q-page-sticky>
  <q-dialog v-model="filterDial">
    <q-card style="width: 500px">
      <q-card-actions align="between">
        <q-btn
          flat
          label="Reset"
          color="blue"
          v-close-popup
          @click="getFilts(true)"
        />
        <q-btn
          color="blue"
          class="text-black"
          label="Submit"
          v-close-popup
          @click="submitFilters"
        />
      </q-card-actions>
      <q-list>
        <isGroup
          @stateChange="stateChange"
          v-for="(filt, index) in filters"
          :filter="filt"
          :position="index"
          :key="index"
        >
        </isGroup>
      </q-list>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { manga, sourcepage } from 'src/components/global/models';
import MangaCard from 'src/components/sourceSearch/mangaCard.vue';
import fetcher, { fetchJSON } from 'src/components/global/fetcher';
import { debounce, QInfiniteScroll } from 'quasar';
import Display from 'src/components/library/Filters';
import isGroup from 'src/components/sourceSearch/Filters/isGroup.vue';

interface posState {
  position: number;
  state: string;
}

export default defineComponent({
  name: 'mangaSourceGrid',
  components: { MangaCard, isGroup },
  computed: {
    Displ() {
      if (this.display.Display == null) {
        return 'compact';
      } else if (this.display.Display) {
        return 'comfort';
      }
      return 'list';
    },
    widt(): string {
      return this.Displ == 'list'
        ? 'width:100%; height: 109px;'
        : `width: calc(100% / ${this.devider}); aspect-ratio: 225/350;transition: width 0.5s ease-out;`;
    }
  },
  methods: {
    calcWidth() {
      const grid = <QInfiniteScroll>this.$refs['infiniteScrol'];
      const ideal = <number>this.$q.localStorage.getItem('MitemW');
      if (grid.$el.clientWidth == undefined) return;
      this.devider = Math.round(grid.$el.clientWidth / ideal);
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
    async reload(num = 1) {
      if (this.Smitted || this.$route.params['q']) {
        return <sourcepage>(
          await fetchJSON(
            `/api/v1/source/${
              this.$route.params['sourceID']
            }/search?searchTerm=${this.$route.params['q'] || ''}&pageNum=${num}`
          )
        );
      } else {
        return <sourcepage>(
          await fetchJSON(
            `/api/v1/source/${this.$route.params['sourceID']}/popular/${num}`
          )
        );
      }
    },
    onLoad(
      index: number,
      done: () => void = () => {
        return;
      }
    ) {
      this.reload(index).then((data: sourcepage) => {
        this.items.push(...data.mangaList);
        done();
        if (!data.hasNextPage)
          (this.$refs['infiniteScrol'] as QInfiniteScroll).stop();
      });
    },
    resetScroll() {
      this.items = [];
      (this.$refs['infiniteScrol'] as QInfiniteScroll).reset();
      (this.$refs['infiniteScrol'] as QInfiniteScroll).poll();
    },
    getFilts(reset = false) {
      fetchJSON(
        `/api/v1/source/${this.$route.params['sourceID']}/filters${
          reset ? '?reset=true' : ''
        }`
      ).then((data) => {
        this.filters = data;
        this.resetScroll();
      });
    },
    stateChange(state: string | posState[], pos: number) {
      this.stateChanges = this.stateChanges.filter(
        (ele) => ele.position != pos
      );
      if (typeof state != 'string') {
        state.forEach((ele) => {
          this.stateChanges.push({ position: pos, state: JSON.stringify(ele) });
        });
      } else {
        this.stateChanges.push({ position: pos, state: state });
      }
    },
    async submitFilters() {
      await fetcher(
        `/api/v1/source/${this.$route.params['sourceID']}/filters`,
        {
          method: 'POST',
          body: JSON.stringify(this.stateChanges)
        }
      );
      this.Smitted = true;
      this.stateChanges = [];
      this.resetScroll();
      this.getFilts();
    }
  },
  created: async function () {
    this.calcWidth = debounce(this.calcWidth, 500);
  },
  mounted: function () {
    this.calcWidth();
    this.$nextTick(() => {
      window.addEventListener('resize', this.calcWidth);
    });
    this.getFilts();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.calcWidth);
  },
  setup() {
    return {
      devider: ref<number>(0),
      mangas: ref(<manga[]>[]),
      clwidth: ref<number>(0),
      display: ref(Display()),
      filters: ref(<unknown>[]),
      items: ref(<manga[]>[]),
      filterDial: ref(false),
      stateChanges: ref(<{ position: number; state: string }[]>[]),
      Smitted: ref(false)
    };
  }
});
</script>
