import { ref } from 'vue';
import { LocalStorage } from 'quasar';
import { storeSet } from '../global/usefull';

const unread = ref(<Boon>LocalStorage.getItem('lbUnread'));
const downloaded = ref(<Boon>LocalStorage.getItem('lbDownloaded'));
const leftToRead = ref(<Boon>LocalStorage.getItem('lbLeftToRead'));
const alphabetical = ref(<Boon>LocalStorage.getItem('lbAlphabetical'));
const ByID = ref(<Boon>LocalStorage.getItem('lbByid'));

type Boon = boolean | null;

export default function useInBar() {
  const setUnread = (data: Boon) => {
    storeSet('lbUnread', data);
    unread.value = data;
  };
  const setDownloaded = (data: Boon): void => {
    storeSet('lbDownloaded', data);
    downloaded.value = data;
  };
  const setLeftToRead = (data: Boon) => {
    if (data != null) {
      storeSet('lbLeftToRead', data);
      storeSet('lbAlphabetical', null);
      storeSet('lbByid', null);
    }
    leftToRead.value = data;
  };
  const setAlphabetical = (data: Boon | null) => {
    if (data != null) {
      storeSet('lbLeftToRead', null);
      storeSet('lbAlphabetical', data);
      storeSet('lbByid', null);
    }
    alphabetical.value = data;
  };
  const setByID = (data: Boon | null) => {
    if (data != null) {
      storeSet('lbLeftToRead', null);
      storeSet('lbAlphabetical', null);
      storeSet('lbByid', data);
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
