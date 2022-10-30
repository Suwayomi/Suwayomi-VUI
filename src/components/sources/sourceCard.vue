<template>
  <q-card v-ripple flat class="q-ma-sm">
    <q-item style="height: 100px">
      <div class="row content-center col-grow">
        <q-item-section avatar>
          <q-img
            :src="imgdata"
            loading="lazy"
            spinner-color="white"
            style="height: 100px; aspect-ratio: 225/225; width: fit-content"
            class="rounded-borders items-center justify-center"
            no-spinner
          >
            <q-inner-loading
              :showing="!imgdata"
              color="primary"
              class="bg-transparent"
            >
            </q-inner-loading>
          </q-img>
        </q-item-section>
        <q-item-section class="flex-grow">
          <q-item-label>{{ capitalizeFirstLetter(source.name) }}</q-item-label>
          <q-item-label caption
            >{{ langCodeToName(source.lang) }}
            <span v-if="source.isNsfw" style="color: red">18+</span>
          </q-item-label>
        </q-item-section>
      </div>
      <div class="flex items-center">
        <q-btn
          class="q-ma-sm"
          outline
          color="blue"
          label="latest"
          :to="`/sources/` + source.id + `/latest/`"
        >
        </q-btn>
        <q-btn
          class="q-ma-sm"
          outline
          color="blue"
          label="browse"
          :to="`/sources/` + source.id + `/popular/`"
        >
        </q-btn>
      </div>
    </q-item>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { useQuasar } from 'quasar';
import fetcher from '../global/fetcher';
import { source } from '../global/models';
import { langCodeToName } from 'src/components/extantions/language';
import { getImgBlob } from '../global/usefull';

export default defineComponent({
  name: 'sourceCard',
  props: {
    source: {
      type: Object as PropType<source>,
      required: true
    }
  },
  emits: ['reload'],
  methods: {
    capitalizeFirstLetter(string: string): string {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    langCodeToName,
    getSetImg() {
      getImgBlob(this.source.iconUrl + '?useCache=' + this.useCache).then(
        (value) => {
          this.imgdata = value;
        }
      );
    }
  },
  created: function () {
    this.getSetImg();
  },
  watch: {
    'source.iconUrl'() {
      this.imgdata = '';
      this.getSetImg();
    }
  },
  setup() {
    const $q = useQuasar();
    const useCache = ref(`${$q.localStorage.getItem('useCache')}`);
    const imgdata = ref('');
    return { useCache, imgdata };
  }
});
</script>
