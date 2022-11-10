<template>
  <ETB></ETB>
  <q-btn flat round icon="travel_explore" to="/sources/Global/"></q-btn>
</template>

<script lang="ts">
import ETB from 'src/components/extantions/TopBar.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ExtTopBar',
  components: { ETB },
  setup() {
    return {};
  }
});
</script>
