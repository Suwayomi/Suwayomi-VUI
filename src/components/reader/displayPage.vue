<template>
  <div class="MangaInfo column items-center no-wrap">
    <q-img
      style="width: fit-content; max-width: 100%"
      loading="lazy"
      class="q-ma-md"
      img-class="test"
      :src="imgdata"
      fit="scale-down"
    >
    </q-img>
    <q-card
      flat
      style="height: 100vh; background-color: transparent"
      v-if="!imgdata"
    >
      <q-inner-loading
        :showing="!imgdata"
        color="primary"
        class="bg-transparent"
      >
      </q-inner-loading>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { getImgBlob } from '../global/usefull';

export default defineComponent({
  name: 'displayPage',
  props: {
    pageNum: {
      type: Number as PropType<number>,
      required: true
    },
    chapterID: {
      type: Number as PropType<number>,
      required: true
    }
  },
  created: function () {
    this.getImg();
  },
  methods: {
    getImg() {
      getImgBlob(
        `/api/v1/manga/${this.$route.params['mangaID']}/chapter/${
          this.chapterID
        }/page/${this.pageNum}?useCache=${this.$q.localStorage.getItem(
          'useCache'
        )}`
      ).then((value) => {
        this.imgdata = value;
      });
    }
  },
  setup() {
    return { imgdata: ref('') };
  }
});
</script>

<style>
.MangaInfo .test {
  width: fit-content;
  height: fit-content;
  max-width: 100%;
}
.MangaInfo .q-img__container {
  position: unset;
}
.MangaInfo .q-img.q-img--menu :first-child {
  padding: 0 !important;
}
</style>
