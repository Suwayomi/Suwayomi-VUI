<template>
  <q-page :style-fn="myTweak">
    <sourceGrid> </sourceGrid>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { source } from 'src/components/global/models';
import sourceGrid from 'src/components/sourceSearch/mangaSourceGrid.vue';
import fetcher from 'src/components/global/fetcher';
import { isConfig } from 'src/components/sourceSearch/isConfigurable';

export default defineComponent({
  name: 'ScourceSearchPage',
  components: {
    sourceGrid
  },
  created: async function () {
    try {
      const resp = await fetcher(
        `/api/v1/source/${this.$route.params['sourceID']}`
      );
      const jsn: source = await resp.json();
      this.$emit('setTitle', jsn.displayName);
      this.isConfi.setConfigurable(jsn.isConfigurable);
    } catch (e) {
      console.error(e);
    }
  },
  computed: {
    scrollbarTheme(): string {
      return this.$q.dark.isActive ? 'darkSB' : 'lightSB';
    }
  },
  methods: {
    myTweak(offset: number) {
      return {
        height: offset ? `calc(100vh - ${offset}px)` : '100vh'
      };
    }
  },
  setup(_props, { emit }) {
    emit('setTitle', 'Source Search Page');

    return { isConfi: isConfig() };
  }
});
</script>
