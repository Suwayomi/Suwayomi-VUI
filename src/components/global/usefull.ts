import { LocalStorage } from 'quasar';
import { fetcher } from 'src/boot/fetcher';

export function storeSet(
  key: string,
  data: null | unknown,
  set: unknown = null
): void {
  if (data == set) LocalStorage.remove(key);
  else LocalStorage.set(key, data);
}

export async function getImgBlob(imgUrl: string): Promise<string> {
  const resp = await fetcher(imgUrl);
  const blob = await resp.blob();
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return await new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
  });
}
