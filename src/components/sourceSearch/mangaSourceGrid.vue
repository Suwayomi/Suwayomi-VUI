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
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { manga, sourcepage } from 'src/components/global/models';
import MangaCard from 'src/components/sourceSearch/mangaCard.vue';
import { fetchJSON } from 'src/components/global/fetcher';
import { debounce, QInfiniteScroll } from 'quasar';
import Filters from 'src/components/library/Filters';

export default defineComponent({
  name: 'mangaSourceGrid',
  components: { MangaCard },
  computed: {
    Displ() {
      if (this.filters.Display == null) {
        return 'compact';
      } else if (this.filters.Display) {
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
      return <sourcepage>(
        await fetchJSON(
          `/api/v1/source/${this.$route.params['sourceID']}/popular/${num}`
        )
      );
    },
    onLoad(_index: number, done: () => void) {
      this.reload(this.currpage).then((data: sourcepage) => {
        console.log(data);
        this.items.push(...data.mangaList);
        done();
        if (!data.hasNextPage)
          (this.$refs['infiniteScrol'] as QInfiniteScroll).stop();
        this.currpage++;
      });
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
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.calcWidth);
  },
  setup() {
    const filters = ref(Filters());
    const devider = ref<number>(0);
    const clwidth = ref<number>(0);
    const mangas = ref(<manga[]>[]);
    return {
      devider,
      mangas,
      clwidth,
      filters,
      currpage: ref(1),
      items: ref(<manga[]>[])
    };
  }
});
</script>
