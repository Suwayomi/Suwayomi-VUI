<template>
  <div class="">
    <div class="q-gutter-y-md">
      <q-tabs
        v-model="tab"
        inline-label
        :style="
          `background-color:` +
          ($q.dark.isActive ? `var(--q-primaryD)` : `var(--q-primary)`)
        "
      >
        <q-route-tab
          v-for="tabb in tabs"
          :key="tabb.tabID"
          :name="tabb.tabID"
          :label="tabb.tabname"
          class="col-grow"
          :to="{ query: { ...$route.query, tab: tabb.tabID } }"
        />
      </q-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { tab } from '../global/models';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  name: 'TabPanel',
  props: {
    tabs: {
      type: Array as PropType<tab[]>,
      default: () => []
    }
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    if (route.query['tab'] === undefined) {
      router.push({ query: { ...route.query, tab: 0 } });
    }
    return {
      tab: ref(new Number(route.query['tab']).valueOf() || 0)
    };
  }
});
</script>
