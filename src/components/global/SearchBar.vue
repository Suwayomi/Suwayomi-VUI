<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <q-input
    dense
    standout
    v-model="text"
    debounce="500"
    input-class="text-right"
    class="q-ml-xs col-shrink"
    @keyup.enter="searchEnt()"
  >
    <template v-slot:append>
      <q-icon v-if="text === ''" name="search" />
      <q-icon
        v-else
        name="clear"
        class="cursor-pointer"
        @click="
          text = '';
          searchEnt();
        "
      />
    </template>
  </q-input>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'SearchBar',
  methods: {
    searchNoEnt() {
      if (!this.Searchenter) {
        this.$router.push({ query: { ...this.$route.query, q: this.text } });
      }
    },
    searchEnt() {
      this.$router.push({ query: { ...this.$route.query, q: this.text } });
    }
  },
  setup() {
    const Route = useRoute();
    return {
      text: ref(`${Route.query['q'] || ''}`),
      Searchenter: ref(false)
    };
  }
});
</script>
