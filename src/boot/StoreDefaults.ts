import { LocalStorage, Dark } from 'quasar';
if (LocalStorage.isEmpty()) {
  LocalStorage.set('lbUnread', null);
  LocalStorage.set('lbDownloaded', null);
  LocalStorage.set('lbLeftToRead', null);
  LocalStorage.set('lbAlphabetical', null);
  LocalStorage.set('lbByid', true);
  LocalStorage.set('baseUrl', '');
  LocalStorage.set('useCache', true);
  LocalStorage.set('auth', null);
  LocalStorage.set('MitemW', 300);
  LocalStorage.set('dark', true);
  Dark.set(true);
  // LocalStorage.set('', '');
  // LocalStorage.set('', '');
  // LocalStorage.set('', '');
  // LocalStorage.set('', '');
  // LocalStorage.set('', '');
}
