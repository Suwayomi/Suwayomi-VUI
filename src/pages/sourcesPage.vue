<template>
  <q-page></q-page>
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
