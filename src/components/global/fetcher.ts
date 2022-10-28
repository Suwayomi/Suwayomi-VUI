import { LocalStorage } from 'quasar';
let base = LocalStorage.getItem('baseUrl') as string;

export function authOptions(options: RequestInit | undefined = undefined) {
  const update = { ...options };
  const auth = <{ username: string; password: string } | null>(
    LocalStorage.getItem('auth')
  );
  if (auth != null) {
    update.headers = {
      ...update.headers,
      Authorization: `Basic ${btoa(auth.username + ':' + auth.password)}`
    };
  }
  return update;
}

export function resetBase() {
  base = LocalStorage.getItem('baseUrl') as string;
}

export default function fetcher(
  url: RequestInfo | URL,
  options: RequestInit | undefined = undefined
) {
  const tmp = base + url;
  return fetch(tmp, authOptions(options));
}
