<!--
 Copyright (c) Contributors to the Suwayomi project

 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
-->

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
import { preferences } from 'src/components/global/models';
import { defineComponent, ref } from 'vue';
import whatis from 'src/components/sourceSearch/config/whatIs.vue';

export default defineComponent({
  name: 'settingsPage',
  components: { whatis },
  methods: {
    getPrefs() {
      this.$fetchJSON(
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
