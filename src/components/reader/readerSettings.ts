import { ref } from 'vue';
import fetcher from '../global/fetcher';
import { manga } from '../global/models';
import { LocalStorage } from 'quasar';

const vue_RM = ref(<string>'');
const vue_WT = ref(<boolean>false);
const vue_Scale = ref(<boolean>false);

function tobool(data: string): boolean {
  return data == 'true';
}

export async function chapterMeta(mangaID: number) {
  const resp = await fetcher(`/api/v1/manga/${mangaID}`);
  const manga = <manga>await resp.json();
  vue_RM.value = manga.meta.vue_RM
    ? manga.meta.vue_RM
    : ((LocalStorage.getItem('vue_RM') || 'RTL') as string);
  vue_WT.value = manga.meta.vue_WT
    ? tobool(manga.meta.vue_WT)
    : ((LocalStorage.getItem('vue_WT') || false) as boolean);
  vue_Scale.value = manga.meta.vue_Scale
    ? tobool(manga.meta.vue_Scale)
    : ((LocalStorage.getItem('vue_Scale') || false) as boolean);

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

  function setFormData(key: string, data: string) {
    const fd = new FormData();
    fd.append('key', key);
    fd.append('value', data);
    fetcher(`/api/v1/manga/${mangaID}/meta`, {
      method: 'PAtCH',
      body: fd
    });
  }

  return {
    vue_RM,
    vue_WT,
    vue_Scale,
    setRM,
    setWT,
    setScale
  };
}
