<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <div
    class="column items-center justify-center"
    :class="vue_Scale && !isBook ? `` : `MangaInfo`"
    :style="imgcontstyle"
  >
    <q-img
      style="max-width: -webkit-fill-available"
      :style="imgstyle"
      loading="lazy"
      :class="vue_WT ? (isBook2 ? `q-mx-md` : `q-ma-md`) : ``"
      :src="imgdata"
      :fit="imgfit"
      :imgClass="imgClass"
      :imgStyle="imgimgstyle"
    >
    </q-img>
    <q-card
      flat
      style="height: 100vh; background-color: transparent; width: 100%"
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
    },
    vue_RM: {
      type: String as PropType<string>,
      default: 'RTL'
    },
    vue_WT: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    vue_Scale: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    vue_Offset: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  },
  mounted: function () {
    this.getImg();
  },
  computed: {
    isBook(): boolean {
      return ['RTL', 'LTR', 'SinglePage'].includes(this.vue_RM);
    },
    isBook2(): boolean {
      return ['RTL', 'LTR'].includes(this.vue_RM);
    },
    imgstyle(): string {
      if (this.vue_Scale) {
        if (this.isBook) {
          if (this.isBook2) {
            return 'width: fit-content;';
          }
          return 'width: fit-content;';
        }
        return 'width:100%;height:fit-content;';
      }
      return 'width: fit-content;max-width:100%';
    },
    imgClass(): string {
      if (this.vue_Scale) {
        if (this.isBook) {
          if (this.isBook2) {
            return 'test';
          }
          return 'test';
        }
        return '';
      }
      return 'test';
    },
    imgfit(): 'fill' | 'cover' | 'contain' | 'none' | 'scale-down' | undefined {
      if (this.vue_Scale) {
        if (this.isBook) {
          if (this.isBook2) {
            return 'scale-down';
          }
          return 'scale-down';
        }
        return 'fill';
      }
      return 'scale-down';
    },
    imgimgstyle(): Partial<CSSStyleDeclaration> {
      if (this.vue_Scale) {
        if (this.isBook) {
          if (this.isBook2) {
            return { height: '100%', width: 'fit-content' };
          }
          return { height: '100%', width: 'fit-content' };
        }
        return { width: '100%', height: 'fit-content' };
      }
      return {
        width: 'fit-content',
        maxWidth: '100%'
      };
    },
    imgcontstyle(): string {
      if (this.vue_Scale) {
        if (this.isBook) {
          if (this.isBook2) {
            let tmp = 1;
            if (this.pageNum % 2) {
              tmp *= -1;
            }
            if (this.vue_RM == 'RTL') {
              tmp *= -1;
            }
            if (this.vue_Offset) {
              tmp *= -1;
            }
            return (
              'width:50%;height:100vh;align-items:' +
              (tmp == -1 ? 'start' : 'end')
            );
          }
          return 'max-width:100%;height:100vh';
        }
        return 'width:100%;height:fit-content;';
      }
      if (this.isBook2) {
        const es =
          this.pageNum % 2
            ? this.vue_RM == 'RTL'
              ? 'end'
              : 'start'
            : this.vue_RM == 'RTL'
            ? 'start'
            : 'end';
        return 'width:50%;align-items:' + es;
      }
      return 'max-width:100%';
    }
  },
  watch: {
    pageNum() {
      this.getImg();
    }
  },
  methods: {
    getImg(): void {
      getImgBlob(
        `/api/v1/manga/${this.$route.params['mangaID']}/chapter/${
          this.chapterID
        }/page/${this.pageNum}?useCache=${this.$q.localStorage.getItem(
          'useCache'
        )}`
      ).then((value: string) => {
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
  display: flex;
  justify-content: center;
  height: 100%;
}
.MangaInfo .q-img.q-img--menu :first-child {
  padding: 0 !important;
}
</style>
