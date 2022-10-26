import { ref } from 'vue';
import { LocalStorage } from 'quasar';

const unread = ref(<boolean | null>LocalStorage.getItem('lbUnread'));
const downloaded = ref(<boolean | null>LocalStorage.getItem('lbDownloaded'));
const leftToRead = ref(<boolean | null>LocalStorage.getItem('lbLeftToRead'));
const alphabetical = ref(
  <boolean | null>LocalStorage.getItem('lbAlphabetical')
);
const ByID = ref(<boolean | null>LocalStorage.getItem('lbByid'));

export default function useInBar() {
  const setUnread = (data: boolean | null) => {
    LocalStorage.set('lbUnread', data);
    unread.value = data;
  };
  const setDownloaded = (data: boolean | null) => {
    LocalStorage.set('lbDownloaded', data);
    downloaded.value = data;
  };
  const setLeftToRead = (data: boolean | null) => {
    if (data != null) {
      LocalStorage.set('lbLeftToRead', data);
      LocalStorage.set('lbAlphabetical', null);
      LocalStorage.set('lbByid', null);
    }
    leftToRead.value = data;
  };
  const setAlphabetical = (data: boolean | null) => {
    if (data != null) {
      LocalStorage.set('lbLeftToRead', null);
      LocalStorage.set('lbAlphabetical', data);
      LocalStorage.set('lbByid', null);
    }
    alphabetical.value = data;
  };
  const setByID = (data: boolean | null) => {
    if (data != null) {
      LocalStorage.set('lbLeftToRead', null);
      LocalStorage.set('lbAlphabetical', null);
      LocalStorage.set('lbByid', data);
    }
    ByID.value = data;
  };

  return {
    setUnread,
    setDownloaded,
    setLeftToRead,
    setAlphabetical,
    setByID,
    unread,
    downloaded,
    leftToRead,
    alphabetical,
    ByID
  };
}
