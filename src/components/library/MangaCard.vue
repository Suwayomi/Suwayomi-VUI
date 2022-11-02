<template>
  <q-card
    v-ripple
    flat
    class="my-card"
    :class="!($q.screen.sm || $q.screen.xs) ? `q-ma-sm` : `q-ma-xs`"
    :style="Display == `list` ? `` : `background: transparent`"
  >
    <router-link
      :to="`/manga/` + manga.id"
      class="cursor-pointer"
      style="text-decoration: none"
      :class="$q.dark.isActive ? `text-white` : `text-dark`"
    >
      <q-img
        v-if="Display != `list`"
        :src="imgdata"
        loading="lazy"
        spinner-color="white"
        style="max-width: 100%; aspect-ratio: 225/350"
        class="rounded-borders"
        no-spinner
      >
        <q-inner-loading :showing="!imgdata" color="primary"> </q-inner-loading>
        <div
          class="transparent absolute-top q-mt-xs q-ml-xs"
          style="padding: 0"
        >
          <q-badge
            color="blue"
            v-if="manga.unreadCount"
            style="width: min-content; padding: 5px"
            :style="
              manga.downloadCount
                ? `border-top-right-radius: 0;border-bottom-right-radius: 0;`
                : ``
            "
          >
            {{ manga.unreadCount }}
          </q-badge>
          <q-badge
            color="green"
            v-if="manga.downloadCount"
            style="width: min-content; padding: 5px"
            :style="
              manga.unreadCount
                ? `border-top-left-radius: 0;border-bottom-left-radius: 0;`
                : ``
            "
          >
            {{ manga.downloadCount }}
          </q-badge>
        </div>
        <div
          class="absolute-bottom text-subtitle1 text-center"
          v-if="Display == `compact`"
          :title="manga.title"
          style="
            padding: 0;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
            height: 3.5rem;
          "
        >
          {{ manga.title }}
        </div>
      </q-img>
      <!-- list display mode -->
      <div class="row items-center col-grow no-wrap">
        <q-img
          v-if="Display == `list`"
          :src="imgdata"
          loading="lazy"
          spinner-color="white"
          style="height: 93px; aspect-ratio: 225/350; width: fit-content"
          class="rounded-borders items-center justify-center col-1"
          no-spinner
        >
          <q-inner-loading :showing="!imgdata" color="primary">
          </q-inner-loading>
        </q-img>
        <div
          :class="listdivClass"
          v-if="Display != `compact`"
          :title="manga.title"
          style="
            padding: 0;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
            overflow: hidden;
            width: 100%;
          "
          :style="Display == `list` ? `` : `height: 5.25rem;`"
        >
          {{ manga.title }}
        </div>
        <div
          class="justify-end flex items-end col-grow"
          :class="!($q.screen.sm || $q.screen.xs) ? `q-mr-lg` : `q-mr-xs`"
        >
          <q-badge
            color="blue"
            v-if="manga.unreadCount && Display == `list`"
            style="width: min-content; padding: 5px"
            :style="
              manga.downloadCount
                ? `border-top-right-radius: 0;border-bottom-right-radius: 0;`
                : ``
            "
          >
            {{ manga.unreadCount }}
          </q-badge>
          <q-badge
            color="green"
            v-if="manga.downloadCount && Display == `list`"
            style="width: min-content; padding: 5px"
            :style="
              manga.unreadCount
                ? `border-top-left-radius: 0;border-bottom-left-radius: 0;`
                : ``
            "
          >
            {{ manga.downloadCount }}
          </q-badge>
        </div>
      </div>
    </router-link>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { manga } from 'src/components/global/models';
import { useQuasar } from 'quasar';
import { getImgBlob } from '../global/usefull';

export default defineComponent({
  name: 'MangaCard',
  props: {
    manga: {
      type: Object as PropType<manga>,
      default: () => Object
    },
    Display: {
      type: String as PropType<'compact' | 'comfort' | 'list'>,
      default: 'compact'
    }
  },
  computed: {
    listdivClass(): string {
      return this.Display == 'list'
        ? 'text-left q-ml-md text-h5 col-shrink'
        : 'text-center text-subtitle1';
    }
  },
  mounted: function () {
    getImgBlob(this.manga.thumbnailUrl + '?useCache=' + this.useCache).then(
      (value) => {
        this.imgdata = value;
      }
    );
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
