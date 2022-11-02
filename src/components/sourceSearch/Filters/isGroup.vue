<template>
  <q-expansion-item v-if="isfilterGroup(filter)" :label="filter.filter.name">
    <q-list>
      <div v-for="(filt, index) in filter.filter.state" :key="index">
        <whatFilter
          @stateChange="stateChange"
          :filter="filt"
          :position="index"
        ></whatFilter>
      </div>
    </q-list>
  </q-expansion-item>
  <div v-if="!isfilterGroup(filter)">
    <whatFilter @stateChange="stateChange" :filter="filter"></whatFilter>
  </div>
</template>

<script lang="ts">
import { filters, isfilterGroup } from 'src/components/global/models';
import { defineComponent, PropType, ref } from 'vue';
import whatFilter from 'src/components/sourceSearch/Filters/whatFilter.vue';

export default defineComponent({
  name: 'isGroup',
  props: {
    filter: {
      type: Object as PropType<filters>,
      required: true
    },
    position: {
      type: Number as PropType<number>,
      required: true
    }
  },
  emits: ['stateChange'],
  components: { whatFilter },
  methods: {
    stateChange(state: string, pos: number | undefined = undefined) {
      if (pos != undefined) {
        this.status = this.status.filter((ele) => ele.position != pos);
        this.status.push({ position: pos, state: state });
        this.$emit('stateChange', this.status, this.position);
      } else {
        this.$emit('stateChange', state, this.position);
      }
    }
  },
  setup() {
    return {
      isfilterGroup,
      status: ref(<{ position: number; state: string }[]>[])
    };
  }
});
</script>
