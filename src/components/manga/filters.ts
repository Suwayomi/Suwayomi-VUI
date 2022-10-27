import { LocalStorage } from 'quasar';

type bnn = boolean | null;

type disp = 'source' | 'chapter';

export function chaptersFilter(mangaID: number) {
  let Unread = <bnn>LocalStorage.getItem(`${mangaID}ChUnread`);
  let Downloaded = <bnn>LocalStorage.getItem(`${mangaID}ChDownloaded`);
  let Bookmarked = <bnn>LocalStorage.getItem(`${mangaID}ChBookmarked`);
  let Source = <bnn>LocalStorage.getItem(`${mangaID}ChSource`);
  let FetchDate = <bnn>LocalStorage.getItem(`${mangaID}ChFetchDate`);
  let Display = <disp>LocalStorage.getItem(`${mangaID}ChDisplay`);
  const setUnread = function (value: bnn) {
    if (value == null) LocalStorage.remove(`${mangaID}ChUnread`);
    else LocalStorage.set(`${mangaID}ChUnread`, value);
    Unread = value;
  };
  const setDownloaded = function (value: bnn) {
    if (value == null) LocalStorage.remove(`${mangaID}ChDownloaded`);
    else LocalStorage.set(`${mangaID}ChDownloaded`, value);
    Downloaded = value;
  };
  const setBookmarked = function (value: bnn) {
    if (value == null) LocalStorage.remove(`${mangaID}ChBookmarked`);
    else LocalStorage.set(`${mangaID}ChBookmarked`, value);
    Bookmarked = value;
  };
  const setSource = function (value: bnn) {
    if (value != null) {
      LocalStorage.set(`${mangaID}ChSource`, value);
      // LocalStorage.set(`${mangaID}ChFetchDate`, null);
      LocalStorage.remove(`${mangaID}ChFetchDate`);
    }
    Source = value;
  };
  const setFetchDate = function (value: bnn) {
    if (value != null) {
      // LocalStorage.set(`${mangaID}ChSource`, null);
      LocalStorage.set(`${mangaID}ChFetchDate`, value);
      LocalStorage.remove(`${mangaID}ChSource`);
    }
    FetchDate = value;
  };
  const setDisplay = function (value: 'source' | 'chapter') {
    if (value == 'source') LocalStorage.remove(`${mangaID}ChDisplay`);
    else LocalStorage.set(`${mangaID}ChDisplay`, value);
    Display = value;
  };

  // needs a default if no sort is set
  if (Source == null && FetchDate == null) Source = false;
  if (Display == null) Display = 'source';

  return {
    Unread,
    Downloaded,
    Bookmarked,
    Source,
    FetchDate,
    Display,
    setUnread,
    setDownloaded,
    setBookmarked,
    setSource,
    setFetchDate,
    setDisplay
  };
}
