import { LocalStorage } from 'quasar';

export function storeSet(key: string, data: null | unknown): void {
  if (data == null) LocalStorage.remove(key);
  else LocalStorage.set(key, data);
}
