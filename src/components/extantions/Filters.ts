import { ref } from 'vue';
import { LocalStorage } from 'quasar';

const langs = ref(<string[]>[
  ...(<string[]>LocalStorage.getItem('ExtLangFilt') || []),
  'all',
  'updates pending',
  'installed'
]);
const currlangs = ref(<string[]>[]);

export default function useInBar() {
  const setlangs = (data: string[]) => {
    LocalStorage.set(
      'ExtLangFilt',
      data.filter((e) => !['all', 'updates pending', 'installed'].includes(e))
    );
    langs.value = [...data];
  };

  const setcurrlangs = (data: string[]) => {
    currlangs.value = data;
  };

  return {
    setcurrlangs,
    currlangs,
    setlangs,
    langs
  };
}
