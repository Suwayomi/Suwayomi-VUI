<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <q-item v-if="isfilterCheckBox(filter)">
    <q-item-section>
      <q-item-label>{{ filter.filter.name }}</q-item-label>
    </q-item-section>
    <q-checkbox color="blue" v-model="val" />
  </q-item>
  <q-item v-if="isfilterSelect(filter)">
    <q-select
      v-model="val"
      style="width: 100%"
      :options="
        filter.filter.displayValues.map((ele, inde) => {
          return {
            label: ele,
            value: inde
          };
        })
      "
      emit-value
      map-options
      :label="filter.filter.name"
    />
  </q-item>
  <q-item v-if="isfilterTriState(filter)">
    <q-checkbox
      style="width: 100%"
      toggle-indeterminate
      v-model="val"
      :label="filter.filter.name"
      checked-icon="check_box"
      unchecked-icon="r_disabled_by_default"
      indeterminate-icon="check_box_outline_blank"
      keep-color
      size="lg"
      color="blue"
      :indeterminate-value="0"
      :true-value="1"
      :false-value="2"
    />
  </q-item>
  <q-item v-if="isfilterHeader(filter)">
    <q-item-section>
      <q-item-label>{{ filter.filter.name }}</q-item-label>
    </q-item-section>
  </q-item>
  <q-item v-if="isfilterSeparator(filter)">
    <q-separator> </q-separator>
  </q-item>
  <q-item v-if="isfilterText(filter) && typeof val == 'string'">
    <q-input
      style="width: 100%"
      outlined
      :label="filter.filter.name"
      v-model="val"
    ></q-input>
  </q-item>
  <q-expansion-item
    :label="filter.filter.name"
    style="width: 100%"
    v-if="isfilterSort(filter) && isSortState(val)"
  >
    <q-item v-for="(sort, index) in filter.filter.values" :key="index">
      <q-item-section thumbnail class="q-px-md">
        <q-icon
          :name="
            val.index == index
              ? val.ascending
                ? `arrow_downward`
                : `arrow_upward`
              : undefined
          "
        />
      </q-item-section>
      <q-item-section>
        <q-btn
          flat
          class="q-pl-none"
          style="width: 100%"
          align="left"
          :label="sort"
          @click="doSort(index)"
        >
        </q-btn>
      </q-item-section>
    </q-item>
  </q-expansion-item>
</template>

<script lang="ts">
import {
  filters,
  isfilterCheckBox,
  isfilterSort,
  isfilterSelect,
  isfilterTriState,
  isfilterHeader,
  isfilterSeparator,
  isfilterText,
  isSortState
} from 'src/components/global/models';
import { defineComponent, PropType, ref } from 'vue';

export default defineComponent({
  name: 'isGroup',
  props: {
    filter: {
      type: Object as PropType<filters>,
      required: true
    },
    position: {
      type: Number as PropType<number | undefined>,
      default: () => undefined
    }
  },
  methods: {
    doSort(index: number) {
      if (isSortState(this.val)) {
        if (index == this.val.index) {
          this.val.ascending = !this.val.ascending;
        } else {
          this.val.index = index;
          this.val.ascending = true;
        }
      }
    }
  },
  watch: {
    val() {
      if (typeof this.val == 'object') {
        this.$emit('stateChange', JSON.stringify(this.val), this.position);
      } else if (
        typeof this.val == 'string' ||
        typeof this.val == 'number' ||
        typeof this.val == 'boolean'
      ) {
        this.$emit('stateChange', this.val.toString(), this.position);
      }
    }
  },
  emits: ['stateChange'],
  setup(props) {
    let val: unknown;
    if (isfilterCheckBox(props.filter)) {
      val = ref(<boolean>props.filter.filter.state);
    } else if (isfilterSort(props.filter)) {
      //gonna have to do some jank with this one
      val = ref(
        <{ index: number; ascending: boolean }>props.filter.filter.state
      );
    } else if (isfilterSelect(props.filter)) {
      val = ref(props.filter.filter.state);
    } else if (isfilterTriState(props.filter)) {
      val = ref(<number>props.filter.filter.state);
    } else if (isfilterHeader(props.filter)) {
      val = ref();
    } else if (isfilterSeparator(props.filter)) {
      val = ref();
    } else if (isfilterText(props.filter)) {
      val = ref(<string>props.filter.filter.state || '');
    }
    return {
      val,
      isfilterCheckBox,
      isfilterSort,
      isfilterSelect,
      isfilterTriState,
      isfilterHeader,
      isfilterSeparator,
      isfilterText,
      isSortState
    };
  }
});
</script>
