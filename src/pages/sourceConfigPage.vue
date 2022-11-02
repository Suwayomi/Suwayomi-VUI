<template>
  <q-list separator :dark="$q.dark.isActive ? true : false">
    <whatis
      v-for="(pref, index) in preferences"
      :preference="pref"
      :key="index"
      :position="index"
      @getPrefs="getPrefs"
    ></whatis>
  </q-list>
</template>

<script lang="ts">
import { fetchJSON } from 'src/components/global/fetcher';
import { preferences } from 'src/components/global/models';
import { defineComponent, ref } from 'vue';
import whatis from 'src/components/sourceSearch/config/whatIs.vue';

export default defineComponent({
  name: 'settingsPage',
  components: { whatis },
  methods: {
    getPrefs() {
      fetchJSON(
        `/api/v1/source/${this.$route.params['sourceID']}/preferences`
      ).then((data: preferences[]) => (this.preferences = data));
    }
  },
  watch: {},
  created: function () {
    this.getPrefs();
  },
  setup() {
    return { preferences: ref(<preferences[]>[]) };
  }
});
</script>
