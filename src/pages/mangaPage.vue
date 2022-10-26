<template>
  <q-page class="row nowrap" :style-fn="myTweak">
    <mangaInfo @inlib="getonline" :manga="manga" v-if="manga" class="col-6">
    </mangaInfo>
    <mangaChapters :offset="offset" class="col-6"></mangaChapters>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { manga } from 'src/components/global/models';
import mangaInfo from 'src/components/manga/mangaInfo.vue';
import mangaChapters from 'src/components/manga/chapterList.vue';
import fetcher from 'src/components/global/fetcher';

export default defineComponent({
  name: 'mangaPage',
  components: { mangaInfo, mangaChapters },
  created: async function () {
    await this.getonline();
    this.$emit('setTitle', this.manga?.title || 'manga');
    await this.getonline('true');
  },
  methods: {
    async getonline(TF = 'false', retry = 3) {
      try {
        const resp = await fetcher(
          `/api/v1/manga/${this.$route.params['id']}/?onlineFetch=${TF}`
        );
        this.manga = <manga>await resp.json();
      } catch (error) {
        if (retry >= 1) await this.getonline(TF, retry - 1);
      }
    },
    myTweak(offset: number) {
      this.offset = offset;
      return {
        minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh'
      };
    }
  },
  setup() {
    const manga = ref();
    return { manga, offset: ref(<number>Number()) };
  }
});
</script>
