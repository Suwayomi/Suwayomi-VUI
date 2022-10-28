<template>
  <q-page>
    <q-inner-loading
      style="
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: fit-content;
        height: fit-content;
        background-color: transparent;
      "
      :showing="true"
      color="primary"
    >
    </q-inner-loading>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'sourcesPage',
  setup(_props, { emit }) {
    emit('setTitle', 'Sources');
    return {};
  }
});
</script>
