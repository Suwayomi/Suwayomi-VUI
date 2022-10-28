<template>
  <q-page></q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'updatesPage',
  setup(_props, { emit }) {
    emit('setTitle', 'Updates');
    return {};
  }
});
</script>
