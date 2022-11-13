<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <q-item>
    <q-toggle v-model="incat" :label="cat.name"></q-toggle>
  </q-item>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { cat } from '../global/models';

export default defineComponent({
  props: {
    sele: {
      type: Boolean as PropType<boolean>,
      required: true
    },
    cat: {
      type: Object as PropType<cat>,
      required: true
    }
  },
  watch: {
    incat() {
      this.$fetch(
        `/api/v1/manga/${this.$route.params['mangaID']}/category/${this.cat.id}`
      );
    }
  },
  setup(props) {
    return {
      incat: ref(props.sele)
    };
  }
});
</script>
