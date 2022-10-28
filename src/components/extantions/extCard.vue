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
          </q-img>
        </q-item-section>
        <q-item-section class="flex-grow">
          <q-item-label>{{ capitalizeFirstLetter(exten.name) }}</q-item-label>
          <q-item-label caption
            >{{ capitalizeFirstLetter(exten.lang) }} {{ exten.versionName }}
            <span v-if="exten.isNsfw" style="color: red">18+</span>
          </q-item-label>
        </q-item-section>
      </div>
      <div class="flex items-center">
        <q-btn outline color="blue" @click="HandleExt">
          <q-item-label
            :class="$q.dark.isActive ? `text-white` : `text-dark`"
            >{{ capitalizeFirstLetter(UpUnIn) }}</q-item-label
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
import { extention } from '../global/models';

export default defineComponent({
  name: 'extCard',
  props: {
    exten: {
      type: Object as PropType<extention>,
      required: true
    }
  },
  emits: ['reload'],
  computed: {
    UpUnIn(): string {
      if (this.exten.hasUpdate) return 'Update';
      if (this.exten.installed) return 'Uninstall';
      return 'Install';
    }
  },
  methods: {
    capitalizeFirstLetter(string: string): string {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    HandleExt() {
      if (this.exten.hasUpdate) {
        fetcher(`/api/v1/extension/update/${this.exten.pkgName}`);
      } else if (this.exten.installed) {
        fetcher(`/api/v1/extension/uninstall/${this.exten.pkgName}`);
      } else {
        fetcher(`/api/v1/extension/install/${this.exten.pkgName}`);
      }
      this.$emit('reload');
    }
  },
  created: function () {
    fetcher(this.exten.iconUrl + '?useCache=' + this.useCache)
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
