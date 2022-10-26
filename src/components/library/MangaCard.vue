<template>
  <q-card v-ripple class="q-ma-sm my-card">
    <router-link :to="`/manga/` + manga.id" class="cursor-pointer">
      <q-inner-loading :showing="!imgdata" color="primary"> </q-inner-loading>
      <q-img
        :src="imgdata"
        loading="lazy"
        spinner-color="white"
        style="max-width: 100%; aspect-ratio: 225/350"
        class="rounded-borders"
        no-spinner
      >
        <div
          class="transparent absolute-top q-mt-xs q-ml-xs"
          style="padding: 0"
        >
          <q-badge
            color="blue"
            v-if="manga.unreadCount"
            style="
              width: min-content;
              padding: 5px;
              border-top-right-radius: 0;
              border-bottom-right-radius: 0;
            "
          >
            {{ manga.unreadCount }}
          </q-badge>
          <q-badge
            color="green"
            v-if="manga.downloadCount"
            style="
              width: min-content;
              padding: 5px;
              border-top-left-radius: 0;
              border-bottom-left-radius: 0;
            "
          >
            {{ manga.downloadCount }}
          </q-badge>
        </div>
        <div
          class="absolute-bottom text-subtitle1 text-center"
          :title="manga.title"
          style="
            padding: 0;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
            height: 56px;
          "
        >
          {{ manga.title }}
        </div>
      </q-img>
    </router-link>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { manga } from 'src/components/global/models';
import { useQuasar } from 'quasar';
import fetcher from '../global/fetcher';

export default defineComponent({
  name: 'MangaCard',
  props: {
    manga: {
      type: Object as PropType<manga>,
      default: () => Object
    }
  },
  created: function () {
    fetcher(this.manga.thumbnailUrl + '?useCache=' + this.useCache)
      .then((resp) => resp.blob())
      .then((blob) => {
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          var base64data = reader.result as string;
          this.imgdata = base64data;
        };
      });
  },
  setup() {
    const $q = useQuasar();
    const useCache = ref(`${$q.localStorage.getItem('useCache')}`);
    const imgdata = ref('');
    return { useCache, imgdata };
  }
});
</script>

<style scoped>
.my-card div.q-img--menu:hover {
  filter: brightness(0.7);
}
</style>
