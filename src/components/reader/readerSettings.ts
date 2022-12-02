/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ref } from 'vue';
import { manga } from '../global/models';
import { LocalStorage } from 'quasar';
import { paths } from 'src/components/global/models';
import { api } from 'src/boot/axios';
import { AxiosResponse } from 'axios';

const vue_RM = ref(<string>'RTL');
const vue_Paths = ref(<keyof paths>'RTL');
const vue_WT = ref(<boolean>false);
const vue_Scale = ref(<boolean>false);
const vue_Offset = ref(<boolean>false);
const vue_title = ref(<string>'');
const pathVisable = ref(<boolean>false);

function tobool(data: string): boolean {
  return data == 'true';
}

export function chapterMeta(mangaID: number) {
  vue_RM.value = (LocalStorage.getItem('vue_RM') || 'RTL') as string;
  vue_Paths.value = (LocalStorage.getItem('vue_Paths') || 'L') as keyof paths;
  vue_WT.value = (LocalStorage.getItem('vue_WT') || false) as boolean;
  vue_Scale.value = (LocalStorage.getItem('vue_Scale') || false) as boolean;
  vue_Offset.value = (LocalStorage.getItem('vue_Offset') || false) as boolean;
  api
    .get(`/api/v1/manga/${mangaID}`)
    .then(({ data: manga }: AxiosResponse<manga>): void => {
      vue_RM.value = manga.meta.vue_RM
        ? manga.meta.vue_RM
        : ((LocalStorage.getItem('vue_RM') || 'RTL') as string);
      vue_Paths.value = manga.meta.vue_Paths
        ? manga.meta.vue_Paths
        : ((LocalStorage.getItem('vue_Paths') || 'L') as keyof paths);
      vue_WT.value = manga.meta.vue_WT
        ? tobool(manga.meta.vue_WT)
        : ((LocalStorage.getItem('vue_WT') || false) as boolean);
      vue_Scale.value = manga.meta.vue_Scale
        ? tobool(manga.meta.vue_Scale)
        : ((LocalStorage.getItem('vue_Scale') || false) as boolean);
      vue_Offset.value = manga.meta.vue_Offset
        ? tobool(manga.meta.vue_Offset)
        : ((LocalStorage.getItem('vue_Offset') || false) as boolean);
      vue_title.value = manga.title;
    });

  function setRM(data: string) {
    vue_RM.value = data;
    setFormData('vue_RM', data);
  }
  function setPaths(data: keyof paths) {
    vue_Paths.value = data;
    setFormData('vue_Paths', data);
  }
  function setWT(data: boolean) {
    vue_WT.value = data;
    setFormData('vue_WT', `${data}`);
  }
  function setScale(data: boolean) {
    vue_Scale.value = data;
    setFormData('vue_Scale', `${data}`);
  }
  function setOffset(data: boolean) {
    vue_Offset.value = data;
    setFormData('vue_Offset', `${data}`);
  }

  function setFormData(key: string, data: string) {
    api.patchForm(`/api/v1/manga/${mangaID}/meta`, {
      key: key,
      value: data,
    });
  }

  function toggPath() {
    pathVisable.value = !pathVisable.value;
  }

  return {
    vue_RM,
    vue_Paths,
    pathVisable,
    vue_WT,
    vue_Scale,
    vue_Offset,
    vue_title,
    setRM,
    setPaths,
    toggPath,
    setWT,
    setScale,
    setOffset,
  };
}
