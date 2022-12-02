<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <div
    class="column items-center justify-center"
    :class="vueScale && !isBook ? `` : `displayPage`"
    :style="imgcontstyle"
  >
    <q-img
      style="max-width: -webkit-fill-available"
      :style="imgstyle"
      loading="lazy"
      :class="vueWT ? (isBook2 ? `q-mx-md` : `q-ma-md`) : ``"
      :src="imgdata"
      :fit="imgfit"
      :img-class="imgClass"
      :img-style="imgimgstyle"
    >
    </q-img>
    <q-card
      v-if="!imgdata"
      flat
      style="height: 100vh; background-color: transparent; width: 100%"
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

export default defineComponent({
  name: 'DisplayPage',
  props: {
    pageNum: {
      type: Number as PropType<number>,
      required: true,
    },
    chapterID: {
      type: Number as PropType<number>,
      required: true,
    },
    vueRM: {
      type: String as PropType<string>,
      default: 'RTL',
    },
    vueWT: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    vueScale: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    vueOffset: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    imdata: {
      type: Promise as PropType<Promise<string>>,
      default: undefined,
    },
  },
  setup() {
    return { imgdata: ref('') };
  },
  computed: {
    isBook(): boolean {
      return ['RTL', 'LTR', 'SinglePage'].includes(this.vueRM);
    },
    isBook2(): boolean {
      return ['RTL', 'LTR'].includes(this.vueRM);
    },
    imgstyle(): string {
      if (this.vueScale) {
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
      if (this.vueScale) {
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
      if (this.vueScale) {
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
      if (this.vueScale) {
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
        maxWidth: '100%',
      };
    },
    imgcontstyle(): string {
      if (this.vueScale) {
        if (this.isBook) {
          if (this.isBook2) {
            let tmp = 1;
            if (this.pageNum % 2) {
              tmp *= -1;
            }
            if (this.vueRM == 'RTL') {
              tmp *= -1;
            }
            if (this.vueOffset) {
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
            ? this.vueRM == 'RTL'
              ? 'end'
              : 'start'
            : this.vueRM == 'RTL'
            ? 'start'
            : 'end';
        return 'width:50%;align-items:' + es;
      }
      return 'max-width:100%';
    },
  },
  watch: {
    pageNum() {
      this.getImg();
    },
  },
  mounted: function () {
    this.getImg();
  },
  methods: {
    getImg(): void {
      this.imdata?.then((value: string) => {
        this.imgdata = value;
      });
    },
  },
});
</script>

<style lang="sass">
.displayPage .test
  width: fit-content
  height: fit-content
  max-width: 100%

.displayPage .q-img__container
  position: unset
  display: flex
  justify-content: center
  height: 100%

.displayPage .q-img.q-img--menu :first-child
  padding: 0 !important
</style>
