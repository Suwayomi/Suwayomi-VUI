<template>
  <q-item :to="link" class="text-grey-7" active-class="text-primary">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" size="lg" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    link: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: ''
    }
  }
});
</script>

<style scoped>
.text-primary {
  color: var(--q-primary) !important;
}
</style>
