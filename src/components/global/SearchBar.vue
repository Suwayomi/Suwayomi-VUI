<template>
  <q-input
    dense
    standout
    v-model="text"
    debounce="500"
    input-class="text-right"
    class="q-ml-md"
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
