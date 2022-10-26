<template>
  <div class="flex" ref="MangaGrid">
    <q-intersection
      v-for="manga in mangas"
      :key="manga.id"
      :style="
        `width: calc(100% / ` +
        devider +
        `); aspect-ratio: 225/350;transition: width 0.5s;`
      "
      transition="fade"
      :threshold="0"
      ssr-prerender
    >
      <MangaCard :manga="manga"></MangaCard>
    </q-intersection>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { manga } from 'src/components/global/models';
import MangaCard from './MangaCard.vue';

export default defineComponent({
  name: 'MangaGrid',
  components: { MangaCard },
  props: {
    mangas: {
      type: Array as PropType<manga[]>,
      default: () => []
    }
  },
  methods: {
    calcWidth() {
      const grid = this.$refs['MangaGrid'] as { clientWidth: number };
      const ideal = <number>this.$q.localStorage.getItem('MitemW');
      this.devider = Math.round(grid.clientWidth / ideal);
    },
    calcHeight() {
      const parent = this.$parent?.$el;
      if (parent) {
        let Height = parent.clientHeight;
        Height -= parent.children[0].clientHeight;
        return Height;
      }
      return 0;
    }
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
  watch: {
    '$refs.MangaGrid.clientWidth'() {
      this.calcWidth();
    }
  },
  setup() {
    const devider = ref<number>(0);
    return { devider };
  }
});
</script>
