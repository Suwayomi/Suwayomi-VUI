import { LocalStorage, Dark } from 'quasar';
if (LocalStorage.isEmpty()) {
  LocalStorage.set('lbByid', true);
  LocalStorage.set('baseUrl', '');
  LocalStorage.set('useCache', true);
  LocalStorage.set('MitemW', 300);
  LocalStorage.set('dark', true);
  LocalStorage.set('ExtLangFilt', ['en']);
  Dark.set(true);
}
