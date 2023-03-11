/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
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
  lastReadAt: number;
  lastFetchedAt: number;
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
  id: number;
}

export interface myMeta {
  vue_Offset: string;
  vue_RM?: string;
  vue_WT?: string;
  vue_Scale?: string;
  vue_Paths?: keyof paths;
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
  props: prefprops;
}

interface prefprops {
  key: string;
  summary: string;
  title: string;
  currentValue: unknown;
  defaultValue: unknown;
  defaultValueType: string;
}

interface propsListPreference extends prefprops {
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

interface propsSwitchPreferenceCompat extends prefprops {
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

interface propsMultiSelectListPreference extends prefprops {
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

interface propsEditTextPreference extends prefprops {
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

interface propsCheckBoxPreference extends prefprops {
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

interface filterResp {
  type: string;
  filter: filter;
}
interface filter {
  name: string;
  state: unknown;
}
interface CheckBox extends filter {
  state: boolean;
}
export interface filterCheckBox extends filterResp {
  type: 'CheckBox';
  filter: CheckBox;
}
export function isfilterCheckBox(pref: filters): pref is filterCheckBox {
  return (<filterCheckBox>pref).type == 'CheckBox';
}
interface filterGroup extends filterResp {
  type: 'Group';
  filter: Group;
}
export function isfilterGroup(pref: filters): pref is filterGroup {
  return (<filterGroup>pref).type == 'Group';
}
interface Group extends filter {
  state: filters[];
}
export interface filterSort extends filterResp {
  type: 'Sort';
  filter: Sort;
}
export function isfilterSort(pref: filters): pref is filterSort {
  return (<filterSort>pref).type == 'Sort';
}
export interface Sort extends filter {
  state: sortstate;
  values: string[];
}
export interface sortstate {
  index: number;
  ascending: boolean;
}
export function isSortState(pref: unknown): pref is sortstate {
  return (<sortstate>pref).index != undefined;
}
export interface filterSelect extends filterResp {
  type: 'Select';
  filter: Select;
}
export function isfilterSelect(pref: filters): pref is filterSelect {
  return (<filterSelect>pref).type == 'Select';
}
interface Select extends filter {
  displayValues: string[];
  state: number;
  values: { title: string; value: string }[];
}
interface TriState extends filter {
  state: number;
}
export interface filterTriState extends filterResp {
  type: 'TriState';
  filter: TriState;
}
export function isfilterTriState(pref: filters): pref is filterTriState {
  return (<filterTriState>pref).type == 'TriState';
}
export interface filterHeader extends filterResp {
  type: 'Header';
}
export function isfilterHeader(pref: filters): pref is filterHeader {
  return (<filterHeader>pref).type == 'Header';
}
export interface filterSeparator extends filterResp {
  type: 'Separator';
}
export function isfilterSeparator(pref: filters): pref is filterSeparator {
  return (<filterSeparator>pref).type == 'Separator';
}
export interface filterText extends filterResp {
  type: 'Text';
  filter: Text;
}
export function isfilterText(pref: filters): pref is filterText {
  return (<filterText>pref).type == 'Text';
}
interface Text extends filter {
  state: string;
}

export type filters =
  | filterCheckBox
  | filterGroup
  | filterSort
  | filterSelect
  | filterTriState
  | filterText
  | filterHeader
  | filterSeparator;

export interface path {
  forward: [number, number][];
  back: [number, number][];
  menu?: [number, number][];
}

export interface paths {
  L: path;
  RAL: path;
  Kindle: path;
  Edge: path;
}
