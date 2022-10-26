import { LocalStorage } from 'quasar';

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

export default function fetcher(
  url: RequestInfo | URL,
  options: RequestInit | undefined = undefined
) {
  return fetch(
    (LocalStorage.getItem('baseUrl') as string) + url,
    authOptions(options)
  );
}
