<!--
/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
-->

<template>
  <q-page :style-fn="myTweak">
    <sourceGrid> </sourceGrid>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { source } from 'src/components/global/models';
import sourceGrid from 'src/components/sourceSearch/sourceMangaGrid.vue';
import { isConfig } from 'src/components/sourceSearch/isConfigurable';

export default defineComponent({
  name: 'ScourceSearchPage',
  components: {
    sourceGrid
  },
  created: async function () {
    try {
      const jsn: source = await this.$fetchJSON(
        `/api/v1/source/${this.$route.params['sourceID']}`
      );
      this.$emit('setTitle', jsn.displayName);
      this.isConfi.setConfigurable(jsn.isConfigurable);
    } catch (e) {
      console.error(e);
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
