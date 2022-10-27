import { LocalStorage } from 'quasar';

export function storeSet(
  key: string,
  data: null | unknown,
  set: unknown = null
): void {
  if (data == set) LocalStorage.remove(key);
  else LocalStorage.set(key, data);
}
