<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <q-expansion-item v-if="isfilterGroup(filter)" :label="filter.filter.name">
    <q-list>
      <div v-for="(filt, index) in filter.filter.state" :key="index">
        <whatFilter
          :filter="filt"
          :position="index"
          @state-change="stateChange"
        ></whatFilter>
      </div>
    </q-list>
  </q-expansion-item>
  <div v-if="!isfilterGroup(filter)">
    <whatFilter :filter="filter" @state-change="stateChange"></whatFilter>
  </div>
</template>

<script lang="ts">
import { filters, isfilterGroup } from 'src/components/global/models';
import { defineComponent, PropType, ref } from 'vue';
import whatFilter from 'src/components/sourceSearch/Filters/whatFilter.vue';

export default defineComponent({
  name: 'IsGroup',
  components: { whatFilter },
  props: {
    filter: {
      type: Object as PropType<filters>,
      required: true,
    },
    position: {
      type: Number as PropType<number>,
      required: true,
    },
  },
  emits: ['state-change'],
  setup() {
    return {
      isfilterGroup,
      status: ref(<{ position: number; state: string }[]>[]),
    };
  },
  methods: {
    stateChange(state: string, pos: number | undefined = undefined) {
      if (pos != undefined) {
        this.status = this.status.filter((ele) => ele.position != pos);
        this.status.push({ position: pos, state: state });
        this.$emit('state-change', this.status, this.position);
      } else {
        this.$emit('state-change', state, this.position);
      }
    },
  },
});
</script>
