export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface tab {
  tabname: string;
  tabID: number;
}

export interface cat {
  id: number;
  order: number;
  name: string;
  default: boolean;
}

export interface source {
  id: string;
  name: string;
  lang: string;
  iconUrl: string;
  supportsLatest: boolean;
  isConfigurable: boolean;
  isNsfw: boolean;
  displayName: string;
}

export interface manga {
  id: number;
  sourceId: string;
  url: string;
  title: string;
  thumbnailUrl: string;
  initialized: boolean;
  artist: string;
  author: string;
  description: string;
  genre: string[];
  status: string;
  inLibrary: boolean;
  inLibraryAt: number;
  source: source | null;
  meta: myMeta;
  realUrl: string;
  freshData: boolean;
  unreadCount: number;
  downloadCount: number;
  chapterCount: number;
}

export interface sourcepage {
  hasNextPage: boolean;
  mangaList: manga[];
}

export interface chapter {
  url: string;
  name: string;
  uploadDate: number;
  chapterNumber: number;
  scanlator: string;
  mangaId: number;
  read: boolean;
  bookmarked: boolean;
  lastPageRead: number;
  lastReadAt: number;
  index: number;
  fetchedAt: number;
  downloaded: boolean;
  pageCount: number;
  chapterCount: number;
  meta: myMeta;
}

export interface myMeta {
  vue_Offset: string;
  vue_RM?: string;
  vue_WT?: string;
  vue_Scale?: string;
}

export interface dlsock {
  status: string;
  queue: download[];
}
export function isdlsock(msg: dlsock | unknown): msg is dlsock {
  const tmp = (<dlsock>msg).queue;
  let itis = true;
  if (Array.isArray(tmp)) {
    if (tmp.length) {
      itis = isdownload(tmp[0]);
    }
  } else {
    return false;
  }
  return (<dlsock>msg).status !== undefined && itis;
}

export interface download {
  chapterIndex: number;
  mangaId: number;
  chapter: chapter;
  manga: manga;
  state: string;
  progress: number;
  tries: number;
}

function isdownload(msg: download | unknown): msg is download {
  return (
    (<download>msg).chapterIndex !== undefined &&
    (<download>msg).mangaId !== undefined
  );
}

export interface extention {
  apkName: string;
  hasUpdate: boolean;
  iconUrl: string;
  installed: boolean;
  isNsfw: boolean;
  lang: string;
  name: string;
  obsolete: boolean;
  pkgName: string;
  versionCode: number;
  versionName: string;
}

export interface groupedExtention {
  [key: string]: extention[];
}

export function isArrExtention(
  msg: extention[] | undefined
): msg is extention[] {
  return <extention[]>msg !== undefined;
}

export interface source {
  id: string;
  name: string;
  lang: string;
  iconUrl: string;
  supportsLatest: boolean;
  isConfigurable: boolean;
  isNsfw: boolean;
  displayName: string;
}

interface preference {
  type: string;
  props: props;
}

interface props {
  key: string;
  summary: string;
  title: string;
  currentValue: unknown;
  defaultValue: unknown;
  defaultValueType: string;
}

interface propsListPreference extends props {
  defaultValueType: 'String';
  currentValue: string;
  defaultValue: string;
  entries: string[];
  entryValues: string[];
}

export interface ListPreference extends preference {
  type: 'ListPreference';
  props: propsListPreference;
}

export function isListPreference(pref: preferences): pref is ListPreference {
  return (<ListPreference>pref).type == 'ListPreference';
}

interface propsSwitchPreferenceCompat extends props {
  defaultValueType: 'Boolean';
  currentValue: boolean;
  defaultValue: boolean;
}

export interface SwitchPreferenceCompat extends preference {
  type: 'SwitchPreferenceCompat';
  props: propsSwitchPreferenceCompat;
}

export function isSwitchPreferenceCompat(
  pref: preferences
): pref is SwitchPreferenceCompat {
  return (<SwitchPreferenceCompat>pref).type == 'SwitchPreferenceCompat';
}

interface propsMultiSelectListPreference extends props {
  defaultValueType: 'Set<String>';
  currentValue: string[];
  defaultValue: string[];
  entries: string[];
  entryValues: string[];
}

export interface MultiSelectListPreference extends preference {
  type: 'MultiSelectListPreference';
  props: propsMultiSelectListPreference;
}

export function isMultiSelectListPreference(
  pref: preferences
): pref is MultiSelectListPreference {
  return (<MultiSelectListPreference>pref).type == 'MultiSelectListPreference';
}

interface propsEditTextPreference extends props {
  defaultValueType: 'String';
  currentValue: string;
  defaultValue: string | null;
}

export interface EditTextPreference extends preference {
  type: 'EditTextPreference';
  props: propsEditTextPreference;
}

export function isEditTextPreference(
  pref: preferences
): pref is EditTextPreference {
  return (<EditTextPreference>pref).type == 'EditTextPreference';
}

interface propsCheckBoxPreference extends props {
  defaultValueType: 'Boolean';
  currentValue: boolean;
  defaultValue: boolean;
}

export interface CheckBoxPreference extends preference {
  type: 'CheckBoxPreference';
  props: propsCheckBoxPreference;
}

export function isCheckBoxPreference(
  pref: preferences
): pref is CheckBoxPreference {
  return (<CheckBoxPreference>pref).type == 'CheckBoxPreference';
}

export type preferences =
  | CheckBoxPreference
  | EditTextPreference
  | MultiSelectListPreference
  | SwitchPreferenceCompat
  | ListPreference;
