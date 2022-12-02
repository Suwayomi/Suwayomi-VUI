<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <q-page :style-fn="myTweak">
    <q-list v-for="lang in filterList" :key="lang[0]">
      <div v-if="lang[1].length" class="text-h4 q-ml-xl q-my-lg">
        {{ capitalizeFirstLetter(lang[0]) }}
      </div>
      <q-intersection
        v-for="(exten, index) in lang[1]"
        :key="index"
        style="height: 100px; width: 100%"
        class="flex-shrink"
      >
        <extCard
          @reload="reload"
          v-if="!exten.obsolete || exten.installed"
          :exten="exten"
        ></extCard>
      </q-intersection>
    </q-list>
    <q-inner-loading
      style="
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: fit-content;
        height: fit-content;
        background-color: transparent;
      "
      :showing="filterList.length == 3"
      color="primary"
    >
    </q-inner-loading>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import {
  extention,
  groupedExtention,
  isArrExtention
} from 'src/components/global/models';
import extCard from 'src/components/extantions/extCard.vue';
import { langSortCmp } from 'src/components/extantions/language';
import Filters from 'src/components/extantions/Filters';
import { AxiosResponse } from 'axios';

export default defineComponent({
  name: 'sourcesPage',
  components: { extCard },
  created: function () {
    this.reload();
  },
  methods: {
    myTweak(offset: number) {
      return {
        height: offset ? `calc(100vh - ${offset}px)` : '100vh'
      };
    },
    reload() {
      this.$api
        .get('/api/v1/extension/list')
        .then(({ data }: AxiosResponse<extention[]>) => {
          this.list = data;
        });
    },
    groupExtensions(extensions: extention[]) {
      this.allLangs = []; // empty the array
      const sortedExtenions: groupedExtention = {
        ['installed']: [] as extention[],
        'updates pending': [] as extention[]
      };
      extensions.forEach((extension) => {
        const lang = extension.lang;
        if (sortedExtenions[lang] == undefined) {
          sortedExtenions[lang] = [] as extention[];
          if (lang !== 'all') {
            this.allLangs.push(lang);
          }
        }
        if (extension.installed) {
          if (extension.hasUpdate) {
            if (isArrExtention(sortedExtenions['updates pending']))
              sortedExtenions['updates pending'].push(extension);
          } else {
            if (isArrExtention(sortedExtenions['installed']))
              sortedExtenions['installed'].push(extension);
          }
        } else {
          sortedExtenions[lang]?.push(extension);
        }
      });

      this.allLangs.sort(langSortCmp);
      const result: [string, extention[]][] = [
        [
          'updates pending',
          isArrExtention(sortedExtenions['updates pending'])
            ? sortedExtenions['updates pending']
            : []
        ],
        [
          'installed',
          isArrExtention(sortedExtenions['installed'])
            ? sortedExtenions['installed']
            : []
        ],
        [
          'all',
          isArrExtention(sortedExtenions['all']) ? sortedExtenions['all'] : []
        ]
      ];
      this.filters.setcurrlangs(this.allLangs);
      const langExt: [string, extention[]][] = this.allLangs
        .map((lang) => [lang, sortedExtenions[lang]])
        .filter((ele) => ele[1] != undefined) as [string, extention[]][];
      const tmp = result.concat(langExt);
      return tmp;
    },
    capitalizeFirstLetter(string: string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  },
  computed: {
    langGroups(): [string, extention[]][] {
      return this.groupExtensions(this.list);
    },
    filterList(): [string, extention[]][] {
      let list = this.langGroups;
      list = list.map((ele) => {
        let tmp = ele[1];
        if (this.$route.query['q']) {
          tmp = tmp.filter((manga) =>
            manga.name
              .toLowerCase()
              .includes(`${this.$route.query['q']}`.toLowerCase())
          );
        }
        if (!this.langs.includes(ele[0])) tmp = [];
        return [ele[0], tmp];
      });

      return list;
    }
  },
  setup(_props, { emit }) {
    emit('setTitle', 'Extentions');
    const filt = Filters();
    const filters = filt;
    const list = ref(<extention[]>[]);
    const langs = ref(filt.langs);
    return { list, allLangs: <string[]>[], filters, langs };
  }
});
</script>
