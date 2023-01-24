<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <div class="">
    <div class="q-gutter-y-md">
      <q-tabs
        v-model="tab"
        inline-label
        :class="$q.dark.isActive ? `bg-dark-page` : `bg-light-page`"
      >
        <q-route-tab
          v-for="tabb in tabs"
          :key="tabb.tabID"
          :name="tabb.tabID"
          :label="tabb.tabname"
          class="col-grow"
          flat
          :to="{ query: { ...$route.query, tab: tabb.tabID } }"
          :class="
            $route.query['tab'] == tabb.tabID.toString() ? `text-primary` : ``
          "
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
      default: () => [],
    },
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    if (route.query['tab'] === undefined) {
      router.replace({ query: { ...route.query, tab: 0 } });
    }
    return {
      tab: ref(new Number(route.query['tab']).valueOf() || 0),
    };
  },
});
</script>
