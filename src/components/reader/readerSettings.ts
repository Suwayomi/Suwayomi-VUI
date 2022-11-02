import { ref } from 'vue';
import fetcher, { fetchJSON } from '../global/fetcher';
import { manga } from '../global/models';
import { LocalStorage } from 'quasar';

const vue_RM = ref(<string>'RTL');
const vue_WT = ref(<boolean>false);
const vue_Scale = ref(<boolean>false);
const vue_Offset = ref(<boolean>false);
const vue_title = ref(<string>'');

function tobool(data: string): boolean {
  return data == 'true';
}

export function chapterMeta(mangaID: number) {
  vue_RM.value = (LocalStorage.getItem('vue_RM') || 'RTL') as string;
  vue_WT.value = (LocalStorage.getItem('vue_WT') || false) as boolean;
  vue_Scale.value = (LocalStorage.getItem('vue_Scale') || false) as boolean;
  vue_Offset.value = (LocalStorage.getItem('vue_Offset') || false) as boolean;
  fetchJSON(`/api/v1/manga/${mangaID}`)
    .then((manga: manga): void => {
      vue_RM.value = manga.meta.vue_RM
        ? manga.meta.vue_RM
        : ((LocalStorage.getItem('vue_RM') || 'RTL') as string);
      vue_WT.value = manga.meta.vue_WT
        ? tobool(manga.meta.vue_WT)
        : ((LocalStorage.getItem('vue_WT') || false) as boolean);
      vue_Scale.value = manga.meta.vue_Scale
        ? tobool(manga.meta.vue_Scale)
        : ((LocalStorage.getItem('vue_Scale') || false) as boolean);
      vue_Offset.value = manga.meta.vue_Offset
        ? tobool(manga.meta.vue_Offset)
        : ((LocalStorage.getItem('vue_Offset') || false) as boolean);
      vue_title.value = manga.title
    });

  function setRM(data: string) {
    vue_RM.value = data;
    setFormData('vue_RM', data);
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
    const fd = new FormData();
    fd.append('key', key);
    fd.append('value', data);
    fetcher(`/api/v1/manga/${mangaID}/meta`, {
      method: 'PATCH',
      body: fd
    });
  }

  return {
    vue_RM,
    vue_WT,
    vue_Scale,
    vue_Offset,
    vue_title,
    setRM,
    setWT,
    setScale,
    setOffset
  };
}
