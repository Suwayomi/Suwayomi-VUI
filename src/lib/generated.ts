import client from "./apollo";
import type {
        ApolloQueryResult, ObservableQuery, WatchQueryOptions, QueryOptions, MutationOptions, SubscriptionOptions
      } from "@apollo/client";
import { readable } from "svelte/store";
import type { Readable } from "svelte/store";
import gql from "graphql-tag"
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A location in a connection that can be used for resuming pagination. */
  Cursor: { input: any; output: any; }
  /** A 64-bit signed integer as a String */
  LongString: { input: any; output: any; }
  /** A file part in a multipart request */
  Upload: { input: any; output: any; }
};

export type AboutPayload = {
  __typename?: 'AboutPayload';
  buildTime: Scalars['LongString']['output'];
  buildType: Scalars['String']['output'];
  discord: Scalars['String']['output'];
  github: Scalars['String']['output'];
  name: Scalars['String']['output'];
  revision: Scalars['String']['output'];
  version: Scalars['String']['output'];
};

export enum BackupRestoreState {
  Failure = 'FAILURE',
  Idle = 'IDLE',
  RestoringCategories = 'RESTORING_CATEGORIES',
  RestoringManga = 'RESTORING_MANGA',
  Success = 'SUCCESS'
}

export type BackupRestoreStatus = {
  __typename?: 'BackupRestoreStatus';
  mangaProgress: Scalars['Int']['output'];
  state: BackupRestoreState;
  totalManga: Scalars['Int']['output'];
};

export type BooleanFilterInput = {
  distinctFrom?: InputMaybe<Scalars['Boolean']['input']>;
  equalTo?: InputMaybe<Scalars['Boolean']['input']>;
  greaterThan?: InputMaybe<Scalars['Boolean']['input']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['Boolean']['input']>;
  in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lessThan?: InputMaybe<Scalars['Boolean']['input']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['Boolean']['input']>;
  notDistinctFrom?: InputMaybe<Scalars['Boolean']['input']>;
  notEqualTo?: InputMaybe<Scalars['Boolean']['input']>;
  notIn?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

export type CategoryConditionInput = {
  default?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
};

export type CategoryEdge = Edge & {
  __typename?: 'CategoryEdge';
  cursor: Scalars['Cursor']['output'];
  node: CategoryType;
};

export type CategoryFilterInput = {
  and?: InputMaybe<Array<CategoryFilterInput>>;
  default?: InputMaybe<BooleanFilterInput>;
  id?: InputMaybe<IntFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<CategoryFilterInput>;
  or?: InputMaybe<Array<CategoryFilterInput>>;
  order?: InputMaybe<IntFilterInput>;
};

export type CategoryMetaType = MetaType & {
  __typename?: 'CategoryMetaType';
  category: CategoryType;
  categoryId: Scalars['Int']['output'];
  key: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type CategoryMetaTypeInput = {
  categoryId: Scalars['Int']['input'];
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type CategoryNodeList = NodeList & {
  __typename?: 'CategoryNodeList';
  edges: Array<CategoryEdge>;
  nodes: Array<CategoryType>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export enum CategoryOrderBy {
  Id = 'ID',
  Name = 'NAME',
  Order = 'ORDER'
}

export type CategoryType = {
  __typename?: 'CategoryType';
  default: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  includeInUpdate: IncludeInUpdate;
  mangas: MangaNodeList;
  meta: Array<CategoryMetaType>;
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
};

export type ChapterConditionInput = {
  chapterNumber?: InputMaybe<Scalars['Float']['input']>;
  fetchedAt?: InputMaybe<Scalars['LongString']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  isBookmarked?: InputMaybe<Scalars['Boolean']['input']>;
  isDownloaded?: InputMaybe<Scalars['Boolean']['input']>;
  isRead?: InputMaybe<Scalars['Boolean']['input']>;
  lastPageRead?: InputMaybe<Scalars['Int']['input']>;
  lastReadAt?: InputMaybe<Scalars['LongString']['input']>;
  mangaId?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  pageCount?: InputMaybe<Scalars['Int']['input']>;
  realUrl?: InputMaybe<Scalars['String']['input']>;
  scanlator?: InputMaybe<Scalars['String']['input']>;
  sourceOrder?: InputMaybe<Scalars['Int']['input']>;
  uploadDate?: InputMaybe<Scalars['LongString']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type ChapterEdge = Edge & {
  __typename?: 'ChapterEdge';
  cursor: Scalars['Cursor']['output'];
  node: ChapterType;
};

export type ChapterFilterInput = {
  and?: InputMaybe<Array<ChapterFilterInput>>;
  chapterNumber?: InputMaybe<FloatFilterInput>;
  fetchedAt?: InputMaybe<LongFilterInput>;
  id?: InputMaybe<IntFilterInput>;
  inLibrary?: InputMaybe<BooleanFilterInput>;
  isBookmarked?: InputMaybe<BooleanFilterInput>;
  isDownloaded?: InputMaybe<BooleanFilterInput>;
  isRead?: InputMaybe<BooleanFilterInput>;
  lastPageRead?: InputMaybe<IntFilterInput>;
  lastReadAt?: InputMaybe<LongFilterInput>;
  mangaId?: InputMaybe<IntFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ChapterFilterInput>;
  or?: InputMaybe<Array<ChapterFilterInput>>;
  pageCount?: InputMaybe<IntFilterInput>;
  realUrl?: InputMaybe<StringFilterInput>;
  scanlator?: InputMaybe<StringFilterInput>;
  sourceOrder?: InputMaybe<IntFilterInput>;
  uploadDate?: InputMaybe<LongFilterInput>;
  url?: InputMaybe<StringFilterInput>;
};

export type ChapterMetaType = MetaType & {
  __typename?: 'ChapterMetaType';
  chapter: ChapterType;
  chapterId: Scalars['Int']['output'];
  key: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type ChapterMetaTypeInput = {
  chapterId: Scalars['Int']['input'];
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type ChapterNodeList = NodeList & {
  __typename?: 'ChapterNodeList';
  edges: Array<ChapterEdge>;
  nodes: Array<ChapterType>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export enum ChapterOrderBy {
  ChapterNumber = 'CHAPTER_NUMBER',
  FetchedAt = 'FETCHED_AT',
  Id = 'ID',
  LastReadAt = 'LAST_READ_AT',
  Name = 'NAME',
  SourceOrder = 'SOURCE_ORDER',
  UploadDate = 'UPLOAD_DATE'
}

export type ChapterType = {
  __typename?: 'ChapterType';
  chapterNumber: Scalars['Float']['output'];
  fetchedAt: Scalars['LongString']['output'];
  id: Scalars['Int']['output'];
  isBookmarked: Scalars['Boolean']['output'];
  isDownloaded: Scalars['Boolean']['output'];
  isRead: Scalars['Boolean']['output'];
  lastPageRead: Scalars['Int']['output'];
  lastReadAt: Scalars['LongString']['output'];
  manga: MangaType;
  mangaId: Scalars['Int']['output'];
  meta: Array<ChapterMetaType>;
  name: Scalars['String']['output'];
  pageCount: Scalars['Int']['output'];
  realUrl?: Maybe<Scalars['String']['output']>;
  scanlator?: Maybe<Scalars['String']['output']>;
  sourceOrder: Scalars['Int']['output'];
  uploadDate: Scalars['LongString']['output'];
  url: Scalars['String']['output'];
};

export type CheckBoxFilter = {
  __typename?: 'CheckBoxFilter';
  default: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type CheckBoxPreference = {
  __typename?: 'CheckBoxPreference';
  currentValue?: Maybe<Scalars['Boolean']['output']>;
  default: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  summary?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  visible: Scalars['Boolean']['output'];
};

export type CheckForServerUpdatesPayload = {
  __typename?: 'CheckForServerUpdatesPayload';
  channel: Scalars['String']['output'];
  tag: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type ClearDownloaderInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type ClearDownloaderPayload = {
  __typename?: 'ClearDownloaderPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  downloadStatus: DownloadStatus;
};

export type CreateBackupInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  includeCategories?: InputMaybe<Scalars['Boolean']['input']>;
  includeChapters?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CreateBackupPayload = {
  __typename?: 'CreateBackupPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  url: Scalars['String']['output'];
};

export type CreateCategoryInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  default?: InputMaybe<Scalars['Boolean']['input']>;
  includeInUpdate?: InputMaybe<IncludeInUpdate>;
  name: Scalars['String']['input'];
  order?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateCategoryPayload = {
  __typename?: 'CreateCategoryPayload';
  category: CategoryType;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type DeleteCategoryInput = {
  categoryId: Scalars['Int']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type DeleteCategoryMetaInput = {
  categoryId: Scalars['Int']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  key: Scalars['String']['input'];
};

export type DeleteCategoryMetaPayload = {
  __typename?: 'DeleteCategoryMetaPayload';
  category: CategoryType;
  clientMutationId?: Maybe<Scalars['String']['output']>;
  meta?: Maybe<CategoryMetaType>;
};

export type DeleteCategoryPayload = {
  __typename?: 'DeleteCategoryPayload';
  category?: Maybe<CategoryType>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
  mangas: Array<MangaType>;
};

export type DeleteChapterMetaInput = {
  chapterId: Scalars['Int']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  key: Scalars['String']['input'];
};

export type DeleteChapterMetaPayload = {
  __typename?: 'DeleteChapterMetaPayload';
  chapter: ChapterType;
  clientMutationId?: Maybe<Scalars['String']['output']>;
  meta?: Maybe<ChapterMetaType>;
};

export type DeleteDownloadedChapterInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
};

export type DeleteDownloadedChapterPayload = {
  __typename?: 'DeleteDownloadedChapterPayload';
  chapters: ChapterType;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type DeleteDownloadedChaptersInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  ids: Array<Scalars['Int']['input']>;
};

export type DeleteDownloadedChaptersPayload = {
  __typename?: 'DeleteDownloadedChaptersPayload';
  chapters: Array<ChapterType>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type DeleteGlobalMetaInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  key: Scalars['String']['input'];
};

export type DeleteGlobalMetaPayload = {
  __typename?: 'DeleteGlobalMetaPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  meta?: Maybe<GlobalMetaType>;
};

export type DeleteMangaMetaInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  key: Scalars['String']['input'];
  mangaId: Scalars['Int']['input'];
};

export type DeleteMangaMetaPayload = {
  __typename?: 'DeleteMangaMetaPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  manga: MangaType;
  meta?: Maybe<MangaMetaType>;
};

export type DequeueChapterDownloadInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
};

export type DequeueChapterDownloadPayload = {
  __typename?: 'DequeueChapterDownloadPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  downloadStatus: DownloadStatus;
};

export type DequeueChapterDownloadsInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  ids: Array<Scalars['Int']['input']>;
};

export type DequeueChapterDownloadsPayload = {
  __typename?: 'DequeueChapterDownloadsPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  downloadStatus: DownloadStatus;
};

export type DownloadAheadInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  latestReadChapterIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  mangaIds: Array<Scalars['Int']['input']>;
};

export type DownloadAheadPayload = {
  __typename?: 'DownloadAheadPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type DownloadEdge = Edge & {
  __typename?: 'DownloadEdge';
  cursor: Scalars['Cursor']['output'];
  node: DownloadType;
};

export type DownloadNodeList = NodeList & {
  __typename?: 'DownloadNodeList';
  edges: Array<DownloadEdge>;
  nodes: Array<DownloadType>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export enum DownloadState {
  Downloading = 'DOWNLOADING',
  Error = 'ERROR',
  Finished = 'FINISHED',
  Queued = 'QUEUED'
}

export type DownloadStatus = {
  __typename?: 'DownloadStatus';
  queue: Array<DownloadType>;
  state: DownloaderState;
};

export type DownloadType = {
  __typename?: 'DownloadType';
  chapter: ChapterType;
  manga: MangaType;
  progress: Scalars['Float']['output'];
  state: DownloadState;
  tries: Scalars['Int']['output'];
};

export enum DownloaderState {
  Started = 'STARTED',
  Stopped = 'STOPPED'
}

export type Edge = {
  /** A cursor for use in pagination. */
  cursor: Scalars['Cursor']['output'];
  /** The [T] at the end of the edge. */
  node: Node;
};

export type EditTextPreference = {
  __typename?: 'EditTextPreference';
  currentValue?: Maybe<Scalars['String']['output']>;
  default?: Maybe<Scalars['String']['output']>;
  dialogMessage?: Maybe<Scalars['String']['output']>;
  dialogTitle?: Maybe<Scalars['String']['output']>;
  key: Scalars['String']['output'];
  summary?: Maybe<Scalars['String']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  visible: Scalars['Boolean']['output'];
};

export type EnqueueChapterDownloadInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
};

export type EnqueueChapterDownloadPayload = {
  __typename?: 'EnqueueChapterDownloadPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  downloadStatus: DownloadStatus;
};

export type EnqueueChapterDownloadsInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  ids: Array<Scalars['Int']['input']>;
};

export type EnqueueChapterDownloadsPayload = {
  __typename?: 'EnqueueChapterDownloadsPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  downloadStatus: DownloadStatus;
};

export type ExtensionConditionInput = {
  apkName?: InputMaybe<Scalars['String']['input']>;
  hasUpdate?: InputMaybe<Scalars['Boolean']['input']>;
  iconUrl?: InputMaybe<Scalars['String']['input']>;
  isInstalled?: InputMaybe<Scalars['Boolean']['input']>;
  isNsfw?: InputMaybe<Scalars['Boolean']['input']>;
  isObsolete?: InputMaybe<Scalars['Boolean']['input']>;
  lang?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  pkgName?: InputMaybe<Scalars['String']['input']>;
  versionCode?: InputMaybe<Scalars['Int']['input']>;
  versionName?: InputMaybe<Scalars['String']['input']>;
};

export type ExtensionEdge = Edge & {
  __typename?: 'ExtensionEdge';
  cursor: Scalars['Cursor']['output'];
  node: ExtensionType;
};

export type ExtensionFilterInput = {
  and?: InputMaybe<Array<ExtensionFilterInput>>;
  apkName?: InputMaybe<StringFilterInput>;
  hasUpdate?: InputMaybe<BooleanFilterInput>;
  iconUrl?: InputMaybe<StringFilterInput>;
  isInstalled?: InputMaybe<BooleanFilterInput>;
  isNsfw?: InputMaybe<BooleanFilterInput>;
  isObsolete?: InputMaybe<BooleanFilterInput>;
  lang?: InputMaybe<StringFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ExtensionFilterInput>;
  or?: InputMaybe<Array<ExtensionFilterInput>>;
  pkgName?: InputMaybe<StringFilterInput>;
  versionCode?: InputMaybe<IntFilterInput>;
  versionName?: InputMaybe<StringFilterInput>;
};

export type ExtensionNodeList = NodeList & {
  __typename?: 'ExtensionNodeList';
  edges: Array<ExtensionEdge>;
  nodes: Array<ExtensionType>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export enum ExtensionOrderBy {
  ApkName = 'APK_NAME',
  Name = 'NAME',
  PkgName = 'PKG_NAME'
}

export type ExtensionType = {
  __typename?: 'ExtensionType';
  apkName: Scalars['String']['output'];
  hasUpdate: Scalars['Boolean']['output'];
  iconUrl: Scalars['String']['output'];
  isInstalled: Scalars['Boolean']['output'];
  isNsfw: Scalars['Boolean']['output'];
  isObsolete: Scalars['Boolean']['output'];
  lang: Scalars['String']['output'];
  name: Scalars['String']['output'];
  pkgName: Scalars['String']['output'];
  source: SourceNodeList;
  versionCode: Scalars['Int']['output'];
  versionName: Scalars['String']['output'];
};

export type FetchChapterPagesInput = {
  chapterId: Scalars['Int']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type FetchChapterPagesPayload = {
  __typename?: 'FetchChapterPagesPayload';
  chapter: ChapterType;
  clientMutationId?: Maybe<Scalars['String']['output']>;
  pages: Array<Scalars['String']['output']>;
};

export type FetchChaptersInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  mangaId: Scalars['Int']['input'];
};

export type FetchChaptersPayload = {
  __typename?: 'FetchChaptersPayload';
  chapters: Array<ChapterType>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type FetchExtensionsInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type FetchExtensionsPayload = {
  __typename?: 'FetchExtensionsPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  extensions: Array<ExtensionType>;
};

export type FetchMangaInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
};

export type FetchMangaPayload = {
  __typename?: 'FetchMangaPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  manga: MangaType;
};

export type FetchSourceMangaInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<Array<FilterChangeInput>>;
  page: Scalars['Int']['input'];
  query?: InputMaybe<Scalars['String']['input']>;
  source: Scalars['LongString']['input'];
  type: FetchSourceMangaType;
};

export type FetchSourceMangaPayload = {
  __typename?: 'FetchSourceMangaPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  mangas: Array<MangaType>;
};

export enum FetchSourceMangaType {
  Latest = 'LATEST',
  Popular = 'POPULAR',
  Search = 'SEARCH'
}

export type Filter = CheckBoxFilter | GroupFilter | HeaderFilter | SelectFilter | SeparatorFilter | SortFilter | TextFilter | TriStateFilter;

export type FilterChangeInput = {
  checkBoxState?: InputMaybe<Scalars['Boolean']['input']>;
  groupChange?: InputMaybe<FilterChangeInput>;
  position: Scalars['Int']['input'];
  selectState?: InputMaybe<Scalars['Int']['input']>;
  sortState?: InputMaybe<SortSelectionInput>;
  textState?: InputMaybe<Scalars['String']['input']>;
  triState?: InputMaybe<TriState>;
};

export type FloatFilterInput = {
  distinctFrom?: InputMaybe<Scalars['Float']['input']>;
  equalTo?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<Scalars['Float']['input']>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lessThan?: InputMaybe<Scalars['Float']['input']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['Float']['input']>;
  notDistinctFrom?: InputMaybe<Scalars['Float']['input']>;
  notEqualTo?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<Scalars['Float']['input']>>;
};

export type GlobalMetaNodeList = NodeList & {
  __typename?: 'GlobalMetaNodeList';
  edges: Array<MetaEdge>;
  nodes: Array<GlobalMetaType>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type GlobalMetaType = MetaType & {
  __typename?: 'GlobalMetaType';
  key: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type GlobalMetaTypeInput = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type GroupFilter = {
  __typename?: 'GroupFilter';
  filters: Array<Filter>;
  name: Scalars['String']['output'];
};

export type HeaderFilter = {
  __typename?: 'HeaderFilter';
  name: Scalars['String']['output'];
};

export enum IncludeInUpdate {
  Exclude = 'EXCLUDE',
  Include = 'INCLUDE',
  Unset = 'UNSET'
}

export type InstallExternalExtensionInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  extensionFile: Scalars['Upload']['input'];
};

export type InstallExternalExtensionPayload = {
  __typename?: 'InstallExternalExtensionPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  extension: ExtensionType;
};

export type IntFilterInput = {
  distinctFrom?: InputMaybe<Scalars['Int']['input']>;
  equalTo?: InputMaybe<Scalars['Int']['input']>;
  greaterThan?: InputMaybe<Scalars['Int']['input']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lessThan?: InputMaybe<Scalars['Int']['input']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>;
  notDistinctFrom?: InputMaybe<Scalars['Int']['input']>;
  notEqualTo?: InputMaybe<Scalars['Int']['input']>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type LastUpdateTimestampPayload = {
  __typename?: 'LastUpdateTimestampPayload';
  timestamp: Scalars['LongString']['output'];
};

export type ListPreference = {
  __typename?: 'ListPreference';
  currentValue?: Maybe<Scalars['String']['output']>;
  default?: Maybe<Scalars['String']['output']>;
  entries: Array<Scalars['String']['output']>;
  entryValues: Array<Scalars['String']['output']>;
  key: Scalars['String']['output'];
  summary?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  visible: Scalars['Boolean']['output'];
};

export type LongFilterInput = {
  distinctFrom?: InputMaybe<Scalars['LongString']['input']>;
  equalTo?: InputMaybe<Scalars['LongString']['input']>;
  greaterThan?: InputMaybe<Scalars['LongString']['input']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['LongString']['input']>;
  in?: InputMaybe<Array<Scalars['LongString']['input']>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lessThan?: InputMaybe<Scalars['LongString']['input']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['LongString']['input']>;
  notDistinctFrom?: InputMaybe<Scalars['LongString']['input']>;
  notEqualTo?: InputMaybe<Scalars['LongString']['input']>;
  notIn?: InputMaybe<Array<Scalars['LongString']['input']>>;
};

export type MangaConditionInput = {
  artist?: InputMaybe<Scalars['String']['input']>;
  author?: InputMaybe<Scalars['String']['input']>;
  categoryIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  chaptersLastFetchedAt?: InputMaybe<Scalars['LongString']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  genre?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['Int']['input']>;
  inLibrary?: InputMaybe<Scalars['Boolean']['input']>;
  inLibraryAt?: InputMaybe<Scalars['LongString']['input']>;
  initialized?: InputMaybe<Scalars['Boolean']['input']>;
  lastFetchedAt?: InputMaybe<Scalars['LongString']['input']>;
  realUrl?: InputMaybe<Scalars['String']['input']>;
  sourceId?: InputMaybe<Scalars['LongString']['input']>;
  status?: InputMaybe<MangaStatus>;
  thumbnailUrl?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type MangaEdge = Edge & {
  __typename?: 'MangaEdge';
  cursor: Scalars['Cursor']['output'];
  node: MangaType;
};

export type MangaFilterInput = {
  and?: InputMaybe<Array<MangaFilterInput>>;
  artist?: InputMaybe<StringFilterInput>;
  author?: InputMaybe<StringFilterInput>;
  categoryId?: InputMaybe<IntFilterInput>;
  chaptersLastFetchedAt?: InputMaybe<LongFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  genre?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IntFilterInput>;
  inLibrary?: InputMaybe<BooleanFilterInput>;
  inLibraryAt?: InputMaybe<LongFilterInput>;
  initialized?: InputMaybe<BooleanFilterInput>;
  lastFetchedAt?: InputMaybe<LongFilterInput>;
  not?: InputMaybe<MangaFilterInput>;
  or?: InputMaybe<Array<MangaFilterInput>>;
  realUrl?: InputMaybe<StringFilterInput>;
  sourceId?: InputMaybe<LongFilterInput>;
  status?: InputMaybe<MangaStatusFilterInput>;
  thumbnailUrl?: InputMaybe<StringFilterInput>;
  title?: InputMaybe<StringFilterInput>;
  url?: InputMaybe<StringFilterInput>;
};

export type MangaMetaType = MetaType & {
  __typename?: 'MangaMetaType';
  key: Scalars['String']['output'];
  manga: MangaType;
  mangaId: Scalars['Int']['output'];
  value: Scalars['String']['output'];
};

export type MangaMetaTypeInput = {
  key: Scalars['String']['input'];
  mangaId: Scalars['Int']['input'];
  value: Scalars['String']['input'];
};

export type MangaNodeList = NodeList & {
  __typename?: 'MangaNodeList';
  edges: Array<MangaEdge>;
  nodes: Array<MangaType>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export enum MangaOrderBy {
  Id = 'ID',
  InLibraryAt = 'IN_LIBRARY_AT',
  LastFetchedAt = 'LAST_FETCHED_AT',
  Title = 'TITLE'
}

export enum MangaStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Licensed = 'LICENSED',
  Ongoing = 'ONGOING',
  OnHiatus = 'ON_HIATUS',
  PublishingFinished = 'PUBLISHING_FINISHED',
  Unknown = 'UNKNOWN'
}

export type MangaStatusFilterInput = {
  distinctFrom?: InputMaybe<MangaStatus>;
  equalTo?: InputMaybe<MangaStatus>;
  greaterThan?: InputMaybe<MangaStatus>;
  greaterThanOrEqualTo?: InputMaybe<MangaStatus>;
  in?: InputMaybe<Array<MangaStatus>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lessThan?: InputMaybe<MangaStatus>;
  lessThanOrEqualTo?: InputMaybe<MangaStatus>;
  notDistinctFrom?: InputMaybe<MangaStatus>;
  notEqualTo?: InputMaybe<MangaStatus>;
  notIn?: InputMaybe<Array<MangaStatus>>;
};

export type MangaType = {
  __typename?: 'MangaType';
  age?: Maybe<Scalars['LongString']['output']>;
  artist?: Maybe<Scalars['String']['output']>;
  author?: Maybe<Scalars['String']['output']>;
  categories: CategoryNodeList;
  chapters: ChapterNodeList;
  chaptersAge?: Maybe<Scalars['LongString']['output']>;
  chaptersLastFetchedAt?: Maybe<Scalars['LongString']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  downloadCount: Scalars['Int']['output'];
  genre: Array<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  inLibrary: Scalars['Boolean']['output'];
  inLibraryAt: Scalars['LongString']['output'];
  initialized: Scalars['Boolean']['output'];
  lastFetchedAt?: Maybe<Scalars['LongString']['output']>;
  lastReadChapter?: Maybe<ChapterType>;
  meta: Array<MangaMetaType>;
  realUrl?: Maybe<Scalars['String']['output']>;
  source?: Maybe<SourceType>;
  sourceId: Scalars['LongString']['output'];
  status: MangaStatus;
  thumbnailUrl?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  unreadCount: Scalars['Int']['output'];
  url: Scalars['String']['output'];
};

export type MetaConditionInput = {
  key?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type MetaEdge = Edge & {
  __typename?: 'MetaEdge';
  cursor: Scalars['Cursor']['output'];
  node: GlobalMetaType;
};

export type MetaFilterInput = {
  and?: InputMaybe<Array<MetaFilterInput>>;
  key?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<MetaFilterInput>;
  or?: InputMaybe<Array<MetaFilterInput>>;
  value?: InputMaybe<StringFilterInput>;
};

export enum MetaOrderBy {
  Key = 'KEY',
  Value = 'VALUE'
}

export type MetaType = {
  key: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type MultiSelectListPreference = {
  __typename?: 'MultiSelectListPreference';
  currentValue?: Maybe<Array<Scalars['String']['output']>>;
  default?: Maybe<Array<Scalars['String']['output']>>;
  dialogMessage?: Maybe<Scalars['String']['output']>;
  dialogTitle?: Maybe<Scalars['String']['output']>;
  entries: Array<Scalars['String']['output']>;
  entryValues: Array<Scalars['String']['output']>;
  key: Scalars['String']['output'];
  summary?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  visible: Scalars['Boolean']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  clearDownloader: ClearDownloaderPayload;
  createBackup: CreateBackupPayload;
  createCategory: CreateCategoryPayload;
  deleteCategory: DeleteCategoryPayload;
  deleteCategoryMeta: DeleteCategoryMetaPayload;
  deleteChapterMeta: DeleteChapterMetaPayload;
  deleteDownloadedChapter: DeleteDownloadedChapterPayload;
  deleteDownloadedChapters: DeleteDownloadedChaptersPayload;
  deleteGlobalMeta: DeleteGlobalMetaPayload;
  deleteMangaMeta: DeleteMangaMetaPayload;
  dequeueChapterDownload: DequeueChapterDownloadPayload;
  dequeueChapterDownloads: DequeueChapterDownloadsPayload;
  downloadAhead: DownloadAheadPayload;
  enqueueChapterDownload: EnqueueChapterDownloadPayload;
  enqueueChapterDownloads: EnqueueChapterDownloadsPayload;
  fetchChapterPages: FetchChapterPagesPayload;
  fetchChapters: FetchChaptersPayload;
  fetchExtensions: FetchExtensionsPayload;
  fetchManga: FetchMangaPayload;
  fetchSourceManga: FetchSourceMangaPayload;
  installExternalExtension: InstallExternalExtensionPayload;
  reorderChapterDownload: ReorderChapterDownloadPayload;
  resetSettings: ResetSettingsPayload;
  restoreBackup: RestoreBackupPayload;
  setCategoryMeta: SetCategoryMetaPayload;
  setChapterMeta: SetChapterMetaPayload;
  setGlobalMeta: SetGlobalMetaPayload;
  setMangaMeta: SetMangaMetaPayload;
  setSettings: SetSettingsPayload;
  startDownloader: StartDownloaderPayload;
  stopDownloader: StopDownloaderPayload;
  updateCategories: UpdateCategoriesPayload;
  updateCategory: UpdateCategoryPayload;
  updateCategoryManga: UpdateCategoryMangaPayload;
  updateCategoryOrder: UpdateCategoryOrderPayload;
  updateChapter: UpdateChapterPayload;
  updateChapters: UpdateChaptersPayload;
  updateExtension: UpdateExtensionPayload;
  updateExtensions: UpdateExtensionsPayload;
  updateLibraryManga: UpdateLibraryMangaPayload;
  updateManga: UpdateMangaPayload;
  updateMangaCategories: UpdateMangaCategoriesPayload;
  updateMangas: UpdateMangasPayload;
  updateMangasCategories: UpdateMangasCategoriesPayload;
  updateSourcePreference: UpdateSourcePreferencePayload;
  updateStop: UpdateStopPayload;
  updateWebUI: WebUiUpdatePayload;
};


export type MutationClearDownloaderArgs = {
  input: ClearDownloaderInput;
};


export type MutationCreateBackupArgs = {
  input?: InputMaybe<CreateBackupInput>;
};


export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};


export type MutationDeleteCategoryArgs = {
  input: DeleteCategoryInput;
};


export type MutationDeleteCategoryMetaArgs = {
  input: DeleteCategoryMetaInput;
};


export type MutationDeleteChapterMetaArgs = {
  input: DeleteChapterMetaInput;
};


export type MutationDeleteDownloadedChapterArgs = {
  input: DeleteDownloadedChapterInput;
};


export type MutationDeleteDownloadedChaptersArgs = {
  input: DeleteDownloadedChaptersInput;
};


export type MutationDeleteGlobalMetaArgs = {
  input: DeleteGlobalMetaInput;
};


export type MutationDeleteMangaMetaArgs = {
  input: DeleteMangaMetaInput;
};


export type MutationDequeueChapterDownloadArgs = {
  input: DequeueChapterDownloadInput;
};


export type MutationDequeueChapterDownloadsArgs = {
  input: DequeueChapterDownloadsInput;
};


export type MutationDownloadAheadArgs = {
  input: DownloadAheadInput;
};


export type MutationEnqueueChapterDownloadArgs = {
  input: EnqueueChapterDownloadInput;
};


export type MutationEnqueueChapterDownloadsArgs = {
  input: EnqueueChapterDownloadsInput;
};


export type MutationFetchChapterPagesArgs = {
  input: FetchChapterPagesInput;
};


export type MutationFetchChaptersArgs = {
  input: FetchChaptersInput;
};


export type MutationFetchExtensionsArgs = {
  input: FetchExtensionsInput;
};


export type MutationFetchMangaArgs = {
  input: FetchMangaInput;
};


export type MutationFetchSourceMangaArgs = {
  input: FetchSourceMangaInput;
};


export type MutationInstallExternalExtensionArgs = {
  input: InstallExternalExtensionInput;
};


export type MutationReorderChapterDownloadArgs = {
  input: ReorderChapterDownloadInput;
};


export type MutationResetSettingsArgs = {
  input: ResetSettingsInput;
};


export type MutationRestoreBackupArgs = {
  input: RestoreBackupInput;
};


export type MutationSetCategoryMetaArgs = {
  input: SetCategoryMetaInput;
};


export type MutationSetChapterMetaArgs = {
  input: SetChapterMetaInput;
};


export type MutationSetGlobalMetaArgs = {
  input: SetGlobalMetaInput;
};


export type MutationSetMangaMetaArgs = {
  input: SetMangaMetaInput;
};


export type MutationSetSettingsArgs = {
  input: SetSettingsInput;
};


export type MutationStartDownloaderArgs = {
  input: StartDownloaderInput;
};


export type MutationStopDownloaderArgs = {
  input: StopDownloaderInput;
};


export type MutationUpdateCategoriesArgs = {
  input: UpdateCategoriesInput;
};


export type MutationUpdateCategoryArgs = {
  input: UpdateCategoryInput;
};


export type MutationUpdateCategoryMangaArgs = {
  input: UpdateCategoryMangaInput;
};


export type MutationUpdateCategoryOrderArgs = {
  input: UpdateCategoryOrderInput;
};


export type MutationUpdateChapterArgs = {
  input: UpdateChapterInput;
};


export type MutationUpdateChaptersArgs = {
  input: UpdateChaptersInput;
};


export type MutationUpdateExtensionArgs = {
  input: UpdateExtensionInput;
};


export type MutationUpdateExtensionsArgs = {
  input: UpdateExtensionsInput;
};


export type MutationUpdateLibraryMangaArgs = {
  input: UpdateLibraryMangaInput;
};


export type MutationUpdateMangaArgs = {
  input: UpdateMangaInput;
};


export type MutationUpdateMangaCategoriesArgs = {
  input: UpdateMangaCategoriesInput;
};


export type MutationUpdateMangasArgs = {
  input: UpdateMangasInput;
};


export type MutationUpdateMangasCategoriesArgs = {
  input: UpdateMangasCategoriesInput;
};


export type MutationUpdateSourcePreferenceArgs = {
  input: UpdateSourcePreferenceInput;
};


export type MutationUpdateStopArgs = {
  input: UpdateStopInput;
};


export type MutationUpdateWebUiArgs = {
  input: WebUiUpdateInput;
};

export type Node = CategoryMetaType | CategoryType | ChapterMetaType | ChapterType | DownloadType | ExtensionType | GlobalMetaType | MangaMetaType | MangaType | PartialSettingsType | SettingsType | SourceType;

export type NodeList = {
  /** A list of edges which contains the [T] and cursor to aid in pagination. */
  edges: Array<Edge>;
  /** A list of [T] objects. */
  nodes: Array<Node>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of all nodes you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']['output']>;
};

export type PartialSettingsType = Settings & {
  __typename?: 'PartialSettingsType';
  autoDownloadAheadLimit?: Maybe<Scalars['Int']['output']>;
  autoDownloadNewChapters?: Maybe<Scalars['Boolean']['output']>;
  backupInterval?: Maybe<Scalars['Int']['output']>;
  backupPath?: Maybe<Scalars['String']['output']>;
  backupTTL?: Maybe<Scalars['Int']['output']>;
  backupTime?: Maybe<Scalars['String']['output']>;
  basicAuthEnabled?: Maybe<Scalars['Boolean']['output']>;
  basicAuthPassword?: Maybe<Scalars['String']['output']>;
  basicAuthUsername?: Maybe<Scalars['String']['output']>;
  debugLogsEnabled?: Maybe<Scalars['Boolean']['output']>;
  downloadAsCbz?: Maybe<Scalars['Boolean']['output']>;
  downloadsPath?: Maybe<Scalars['String']['output']>;
  electronPath?: Maybe<Scalars['String']['output']>;
  excludeCompleted?: Maybe<Scalars['Boolean']['output']>;
  excludeEntryWithUnreadChapters?: Maybe<Scalars['Boolean']['output']>;
  excludeNotStarted?: Maybe<Scalars['Boolean']['output']>;
  excludeUnreadChapters?: Maybe<Scalars['Boolean']['output']>;
  globalUpdateInterval?: Maybe<Scalars['Float']['output']>;
  gqlDebugLogsEnabled?: Maybe<Scalars['Boolean']['output']>;
  initialOpenInBrowserEnabled?: Maybe<Scalars['Boolean']['output']>;
  ip?: Maybe<Scalars['String']['output']>;
  localSourcePath?: Maybe<Scalars['String']['output']>;
  maxSourcesInParallel?: Maybe<Scalars['Int']['output']>;
  port?: Maybe<Scalars['Int']['output']>;
  socksProxyEnabled?: Maybe<Scalars['Boolean']['output']>;
  socksProxyHost?: Maybe<Scalars['String']['output']>;
  socksProxyPort?: Maybe<Scalars['String']['output']>;
  systemTrayEnabled?: Maybe<Scalars['Boolean']['output']>;
  updateMangas?: Maybe<Scalars['Boolean']['output']>;
  webUIChannel?: Maybe<WebUiChannel>;
  webUIFlavor?: Maybe<WebUiFlavor>;
  webUIInterface?: Maybe<WebUiInterface>;
  webUIUpdateCheckInterval?: Maybe<Scalars['Float']['output']>;
};

export type PartialSettingsTypeInput = {
  autoDownloadAheadLimit?: InputMaybe<Scalars['Int']['input']>;
  autoDownloadNewChapters?: InputMaybe<Scalars['Boolean']['input']>;
  backupInterval?: InputMaybe<Scalars['Int']['input']>;
  backupPath?: InputMaybe<Scalars['String']['input']>;
  backupTTL?: InputMaybe<Scalars['Int']['input']>;
  backupTime?: InputMaybe<Scalars['String']['input']>;
  basicAuthEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  basicAuthPassword?: InputMaybe<Scalars['String']['input']>;
  basicAuthUsername?: InputMaybe<Scalars['String']['input']>;
  debugLogsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  downloadAsCbz?: InputMaybe<Scalars['Boolean']['input']>;
  downloadsPath?: InputMaybe<Scalars['String']['input']>;
  electronPath?: InputMaybe<Scalars['String']['input']>;
  excludeCompleted?: InputMaybe<Scalars['Boolean']['input']>;
  excludeEntryWithUnreadChapters?: InputMaybe<Scalars['Boolean']['input']>;
  excludeNotStarted?: InputMaybe<Scalars['Boolean']['input']>;
  excludeUnreadChapters?: InputMaybe<Scalars['Boolean']['input']>;
  globalUpdateInterval?: InputMaybe<Scalars['Float']['input']>;
  gqlDebugLogsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  initialOpenInBrowserEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  ip?: InputMaybe<Scalars['String']['input']>;
  localSourcePath?: InputMaybe<Scalars['String']['input']>;
  maxSourcesInParallel?: InputMaybe<Scalars['Int']['input']>;
  port?: InputMaybe<Scalars['Int']['input']>;
  socksProxyEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  socksProxyHost?: InputMaybe<Scalars['String']['input']>;
  socksProxyPort?: InputMaybe<Scalars['String']['input']>;
  systemTrayEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  updateMangas?: InputMaybe<Scalars['Boolean']['input']>;
  webUIChannel?: InputMaybe<WebUiChannel>;
  webUIFlavor?: InputMaybe<WebUiFlavor>;
  webUIInterface?: InputMaybe<WebUiInterface>;
  webUIUpdateCheckInterval?: InputMaybe<Scalars['Float']['input']>;
};

export type Preference = CheckBoxPreference | EditTextPreference | ListPreference | MultiSelectListPreference | SwitchPreference;

export type Query = {
  __typename?: 'Query';
  about: AboutPayload;
  categories: CategoryNodeList;
  category: CategoryType;
  chapter: ChapterType;
  chapters: ChapterNodeList;
  checkForServerUpdates: Array<CheckForServerUpdatesPayload>;
  checkForWebUIUpdate: WebUiUpdateInfo;
  downloadStatus: DownloadStatus;
  extension: ExtensionType;
  extensions: ExtensionNodeList;
  getWebUIUpdateStatus: WebUiUpdateStatus;
  lastUpdateTimestamp: LastUpdateTimestampPayload;
  manga: MangaType;
  mangas: MangaNodeList;
  meta: GlobalMetaType;
  metas: GlobalMetaNodeList;
  restoreStatus?: Maybe<BackupRestoreStatus>;
  settings: SettingsType;
  source: SourceType;
  sources: SourceNodeList;
  updateStatus: UpdateStatus;
  validateBackup: ValidateBackupResult;
};


export type QueryCategoriesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<CategoryConditionInput>;
  filter?: InputMaybe<CategoryFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<CategoryOrderBy>;
  orderByType?: InputMaybe<SortOrder>;
};


export type QueryCategoryArgs = {
  id: Scalars['Int']['input'];
};


export type QueryChapterArgs = {
  id: Scalars['Int']['input'];
};


export type QueryChaptersArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ChapterConditionInput>;
  filter?: InputMaybe<ChapterFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ChapterOrderBy>;
  orderByType?: InputMaybe<SortOrder>;
};


export type QueryExtensionArgs = {
  pkgName: Scalars['String']['input'];
};


export type QueryExtensionsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ExtensionConditionInput>;
  filter?: InputMaybe<ExtensionFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ExtensionOrderBy>;
  orderByType?: InputMaybe<SortOrder>;
};


export type QueryMangaArgs = {
  id: Scalars['Int']['input'];
};


export type QueryMangasArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<MangaConditionInput>;
  filter?: InputMaybe<MangaFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MangaOrderBy>;
  orderByType?: InputMaybe<SortOrder>;
};


export type QueryMetaArgs = {
  key: Scalars['String']['input'];
};


export type QueryMetasArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<MetaConditionInput>;
  filter?: InputMaybe<MetaFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MetaOrderBy>;
  orderByType?: InputMaybe<SortOrder>;
};


export type QueryRestoreStatusArgs = {
  id: Scalars['String']['input'];
};


export type QuerySourceArgs = {
  id: Scalars['LongString']['input'];
};


export type QuerySourcesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<SourceConditionInput>;
  filter?: InputMaybe<SourceFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SourceOrderBy>;
  orderByType?: InputMaybe<SortOrder>;
};


export type QueryValidateBackupArgs = {
  input: ValidateBackupInput;
};

export type ReorderChapterDownloadInput = {
  chapterId: Scalars['Int']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  to: Scalars['Int']['input'];
};

export type ReorderChapterDownloadPayload = {
  __typename?: 'ReorderChapterDownloadPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  downloadStatus: DownloadStatus;
};

export type ResetSettingsInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type ResetSettingsPayload = {
  __typename?: 'ResetSettingsPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  settings: SettingsType;
};

export type RestoreBackupInput = {
  backup: Scalars['Upload']['input'];
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type RestoreBackupPayload = {
  __typename?: 'RestoreBackupPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  status?: Maybe<BackupRestoreStatus>;
};

export type SelectFilter = {
  __typename?: 'SelectFilter';
  default: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  values: Array<Scalars['String']['output']>;
};

export type SeparatorFilter = {
  __typename?: 'SeparatorFilter';
  name: Scalars['String']['output'];
};

export type SetCategoryMetaInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  meta: CategoryMetaTypeInput;
};

export type SetCategoryMetaPayload = {
  __typename?: 'SetCategoryMetaPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  meta: CategoryMetaType;
};

export type SetChapterMetaInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  meta: ChapterMetaTypeInput;
};

export type SetChapterMetaPayload = {
  __typename?: 'SetChapterMetaPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  meta: ChapterMetaType;
};

export type SetGlobalMetaInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  meta: GlobalMetaTypeInput;
};

export type SetGlobalMetaPayload = {
  __typename?: 'SetGlobalMetaPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  meta: GlobalMetaType;
};

export type SetMangaMetaInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  meta: MangaMetaTypeInput;
};

export type SetMangaMetaPayload = {
  __typename?: 'SetMangaMetaPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  meta: MangaMetaType;
};

export type SetSettingsInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  settings: PartialSettingsTypeInput;
};

export type SetSettingsPayload = {
  __typename?: 'SetSettingsPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  settings: SettingsType;
};

export type Settings = {
  autoDownloadAheadLimit?: Maybe<Scalars['Int']['output']>;
  autoDownloadNewChapters?: Maybe<Scalars['Boolean']['output']>;
  backupInterval?: Maybe<Scalars['Int']['output']>;
  backupPath?: Maybe<Scalars['String']['output']>;
  backupTTL?: Maybe<Scalars['Int']['output']>;
  backupTime?: Maybe<Scalars['String']['output']>;
  basicAuthEnabled?: Maybe<Scalars['Boolean']['output']>;
  basicAuthPassword?: Maybe<Scalars['String']['output']>;
  basicAuthUsername?: Maybe<Scalars['String']['output']>;
  debugLogsEnabled?: Maybe<Scalars['Boolean']['output']>;
  downloadAsCbz?: Maybe<Scalars['Boolean']['output']>;
  downloadsPath?: Maybe<Scalars['String']['output']>;
  electronPath?: Maybe<Scalars['String']['output']>;
  excludeCompleted?: Maybe<Scalars['Boolean']['output']>;
  excludeEntryWithUnreadChapters?: Maybe<Scalars['Boolean']['output']>;
  excludeNotStarted?: Maybe<Scalars['Boolean']['output']>;
  excludeUnreadChapters?: Maybe<Scalars['Boolean']['output']>;
  globalUpdateInterval?: Maybe<Scalars['Float']['output']>;
  gqlDebugLogsEnabled?: Maybe<Scalars['Boolean']['output']>;
  initialOpenInBrowserEnabled?: Maybe<Scalars['Boolean']['output']>;
  ip?: Maybe<Scalars['String']['output']>;
  localSourcePath?: Maybe<Scalars['String']['output']>;
  maxSourcesInParallel?: Maybe<Scalars['Int']['output']>;
  port?: Maybe<Scalars['Int']['output']>;
  socksProxyEnabled?: Maybe<Scalars['Boolean']['output']>;
  socksProxyHost?: Maybe<Scalars['String']['output']>;
  socksProxyPort?: Maybe<Scalars['String']['output']>;
  systemTrayEnabled?: Maybe<Scalars['Boolean']['output']>;
  updateMangas?: Maybe<Scalars['Boolean']['output']>;
  webUIChannel?: Maybe<WebUiChannel>;
  webUIFlavor?: Maybe<WebUiFlavor>;
  webUIInterface?: Maybe<WebUiInterface>;
  webUIUpdateCheckInterval?: Maybe<Scalars['Float']['output']>;
};

export type SettingsType = Settings & {
  __typename?: 'SettingsType';
  autoDownloadAheadLimit: Scalars['Int']['output'];
  autoDownloadNewChapters: Scalars['Boolean']['output'];
  backupInterval: Scalars['Int']['output'];
  backupPath: Scalars['String']['output'];
  backupTTL: Scalars['Int']['output'];
  backupTime: Scalars['String']['output'];
  basicAuthEnabled: Scalars['Boolean']['output'];
  basicAuthPassword: Scalars['String']['output'];
  basicAuthUsername: Scalars['String']['output'];
  debugLogsEnabled: Scalars['Boolean']['output'];
  downloadAsCbz: Scalars['Boolean']['output'];
  downloadsPath: Scalars['String']['output'];
  electronPath: Scalars['String']['output'];
  excludeCompleted: Scalars['Boolean']['output'];
  excludeEntryWithUnreadChapters: Scalars['Boolean']['output'];
  excludeNotStarted: Scalars['Boolean']['output'];
  excludeUnreadChapters: Scalars['Boolean']['output'];
  globalUpdateInterval: Scalars['Float']['output'];
  gqlDebugLogsEnabled: Scalars['Boolean']['output'];
  initialOpenInBrowserEnabled: Scalars['Boolean']['output'];
  ip: Scalars['String']['output'];
  localSourcePath: Scalars['String']['output'];
  maxSourcesInParallel: Scalars['Int']['output'];
  port: Scalars['Int']['output'];
  socksProxyEnabled: Scalars['Boolean']['output'];
  socksProxyHost: Scalars['String']['output'];
  socksProxyPort: Scalars['String']['output'];
  systemTrayEnabled: Scalars['Boolean']['output'];
  updateMangas: Scalars['Boolean']['output'];
  webUIChannel: WebUiChannel;
  webUIFlavor: WebUiFlavor;
  webUIInterface: WebUiInterface;
  webUIUpdateCheckInterval: Scalars['Float']['output'];
};

export type SortFilter = {
  __typename?: 'SortFilter';
  default?: Maybe<SortSelection>;
  name: Scalars['String']['output'];
  values: Array<Scalars['String']['output']>;
};

export enum SortOrder {
  Asc = 'ASC',
  AscNullsFirst = 'ASC_NULLS_FIRST',
  AscNullsLast = 'ASC_NULLS_LAST',
  Desc = 'DESC',
  DescNullsFirst = 'DESC_NULLS_FIRST',
  DescNullsLast = 'DESC_NULLS_LAST'
}

export type SortSelection = {
  __typename?: 'SortSelection';
  ascending: Scalars['Boolean']['output'];
  index: Scalars['Int']['output'];
};

export type SortSelectionInput = {
  ascending: Scalars['Boolean']['input'];
  index: Scalars['Int']['input'];
};

export type SourceConditionInput = {
  id?: InputMaybe<Scalars['LongString']['input']>;
  isNsfw?: InputMaybe<Scalars['Boolean']['input']>;
  lang?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type SourceEdge = Edge & {
  __typename?: 'SourceEdge';
  cursor: Scalars['Cursor']['output'];
  node: SourceType;
};

export type SourceFilterInput = {
  and?: InputMaybe<Array<SourceFilterInput>>;
  id?: InputMaybe<LongFilterInput>;
  isNsfw?: InputMaybe<BooleanFilterInput>;
  lang?: InputMaybe<StringFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<SourceFilterInput>;
  or?: InputMaybe<Array<SourceFilterInput>>;
};

export type SourceNodeList = NodeList & {
  __typename?: 'SourceNodeList';
  edges: Array<SourceEdge>;
  nodes: Array<SourceType>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export enum SourceOrderBy {
  Id = 'ID',
  Lang = 'LANG',
  Name = 'NAME'
}

export type SourcePreferenceChangeInput = {
  checkBoxState?: InputMaybe<Scalars['Boolean']['input']>;
  editTextState?: InputMaybe<Scalars['String']['input']>;
  listState?: InputMaybe<Scalars['String']['input']>;
  multiSelectState?: InputMaybe<Array<Scalars['String']['input']>>;
  position: Scalars['Int']['input'];
  switchState?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SourceType = {
  __typename?: 'SourceType';
  displayName: Scalars['String']['output'];
  extension: ExtensionType;
  filters: Array<Filter>;
  iconUrl: Scalars['String']['output'];
  id: Scalars['LongString']['output'];
  isConfigurable: Scalars['Boolean']['output'];
  isNsfw: Scalars['Boolean']['output'];
  lang: Scalars['String']['output'];
  manga: MangaNodeList;
  name: Scalars['String']['output'];
  preferences: Array<Preference>;
  supportsLatest: Scalars['Boolean']['output'];
};

export type StartDownloaderInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type StartDownloaderPayload = {
  __typename?: 'StartDownloaderPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  downloadStatus: DownloadStatus;
};

export type StopDownloaderInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type StopDownloaderPayload = {
  __typename?: 'StopDownloaderPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  downloadStatus: DownloadStatus;
};

export type StringFilterInput = {
  distinctFrom?: InputMaybe<Scalars['String']['input']>;
  distinctFromInsensitive?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  endsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  equalTo?: InputMaybe<Scalars['String']['input']>;
  greaterThan?: InputMaybe<Scalars['String']['input']>;
  greaterThanInsensitive?: InputMaybe<Scalars['String']['input']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  greaterThanOrEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  inInsensitive?: InputMaybe<Array<Scalars['String']['input']>>;
  includes?: InputMaybe<Scalars['String']['input']>;
  includesInsensitive?: InputMaybe<Scalars['String']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lessThan?: InputMaybe<Scalars['String']['input']>;
  lessThanInsensitive?: InputMaybe<Scalars['String']['input']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  lessThanOrEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
  like?: InputMaybe<Scalars['String']['input']>;
  likeInsensitive?: InputMaybe<Scalars['String']['input']>;
  notDistinctFrom?: InputMaybe<Scalars['String']['input']>;
  notDistinctFromInsensitive?: InputMaybe<Scalars['String']['input']>;
  notEndsWith?: InputMaybe<Scalars['String']['input']>;
  notEndsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  notEqualTo?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  notInInsensitive?: InputMaybe<Array<Scalars['String']['input']>>;
  notIncludes?: InputMaybe<Scalars['String']['input']>;
  notIncludesInsensitive?: InputMaybe<Scalars['String']['input']>;
  notLike?: InputMaybe<Scalars['String']['input']>;
  notLikeInsensitive?: InputMaybe<Scalars['String']['input']>;
  notStartsWith?: InputMaybe<Scalars['String']['input']>;
  notStartsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
  startsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  downloadChanged: DownloadStatus;
  updateStatusChanged: UpdateStatus;
  webUIUpdateStatusChange: WebUiUpdateStatus;
};

export type SwitchPreference = {
  __typename?: 'SwitchPreference';
  currentValue?: Maybe<Scalars['Boolean']['output']>;
  default: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  summary?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  visible: Scalars['Boolean']['output'];
};

export type TextFilter = {
  __typename?: 'TextFilter';
  default: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export enum TriState {
  Exclude = 'EXCLUDE',
  Ignore = 'IGNORE',
  Include = 'INCLUDE'
}

export type TriStateFilter = {
  __typename?: 'TriStateFilter';
  default: TriState;
  name: Scalars['String']['output'];
};

export type UpdateCategoriesInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  ids: Array<Scalars['Int']['input']>;
  patch: UpdateCategoryPatchInput;
};

export type UpdateCategoriesPayload = {
  __typename?: 'UpdateCategoriesPayload';
  categories: Array<CategoryType>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type UpdateCategoryInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  patch: UpdateCategoryPatchInput;
};

export type UpdateCategoryMangaInput = {
  categories: Array<Scalars['Int']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCategoryMangaPayload = {
  __typename?: 'UpdateCategoryMangaPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  updateStatus: UpdateStatus;
};

export type UpdateCategoryOrderInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  position: Scalars['Int']['input'];
};

export type UpdateCategoryOrderPayload = {
  __typename?: 'UpdateCategoryOrderPayload';
  categories: Array<CategoryType>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type UpdateCategoryPatchInput = {
  default?: InputMaybe<Scalars['Boolean']['input']>;
  includeInUpdate?: InputMaybe<IncludeInUpdate>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCategoryPayload = {
  __typename?: 'UpdateCategoryPayload';
  category: CategoryType;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type UpdateChapterInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  patch: UpdateChapterPatchInput;
};

export type UpdateChapterPatchInput = {
  isBookmarked?: InputMaybe<Scalars['Boolean']['input']>;
  isRead?: InputMaybe<Scalars['Boolean']['input']>;
  lastPageRead?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateChapterPayload = {
  __typename?: 'UpdateChapterPayload';
  chapter: ChapterType;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type UpdateChaptersInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  ids: Array<Scalars['Int']['input']>;
  patch: UpdateChapterPatchInput;
};

export type UpdateChaptersPayload = {
  __typename?: 'UpdateChaptersPayload';
  chapters: Array<ChapterType>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type UpdateExtensionInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  patch: UpdateExtensionPatchInput;
};

export type UpdateExtensionPatchInput = {
  install?: InputMaybe<Scalars['Boolean']['input']>;
  uninstall?: InputMaybe<Scalars['Boolean']['input']>;
  update?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateExtensionPayload = {
  __typename?: 'UpdateExtensionPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  extension: ExtensionType;
};

export type UpdateExtensionsInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  ids: Array<Scalars['String']['input']>;
  patch: UpdateExtensionPatchInput;
};

export type UpdateExtensionsPayload = {
  __typename?: 'UpdateExtensionsPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  extensions: Array<ExtensionType>;
};

export type UpdateLibraryMangaInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateLibraryMangaPayload = {
  __typename?: 'UpdateLibraryMangaPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  updateStatus: UpdateStatus;
};

export type UpdateMangaCategoriesInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  patch: UpdateMangaCategoriesPatchInput;
};

export type UpdateMangaCategoriesPatchInput = {
  addToCategories?: InputMaybe<Array<Scalars['Int']['input']>>;
  clearCategories?: InputMaybe<Scalars['Boolean']['input']>;
  removeFromCategories?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type UpdateMangaCategoriesPayload = {
  __typename?: 'UpdateMangaCategoriesPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  manga: MangaType;
};

export type UpdateMangaInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  patch: UpdateMangaPatchInput;
};

export type UpdateMangaPatchInput = {
  inLibrary?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateMangaPayload = {
  __typename?: 'UpdateMangaPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  manga: MangaType;
};

export type UpdateMangasCategoriesInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  ids: Array<Scalars['Int']['input']>;
  patch: UpdateMangaCategoriesPatchInput;
};

export type UpdateMangasCategoriesPayload = {
  __typename?: 'UpdateMangasCategoriesPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  mangas: Array<MangaType>;
};

export type UpdateMangasInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  ids: Array<Scalars['Int']['input']>;
  patch: UpdateMangaPatchInput;
};

export type UpdateMangasPayload = {
  __typename?: 'UpdateMangasPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  mangas: Array<MangaType>;
};

export type UpdateSourcePreferenceInput = {
  change: SourcePreferenceChangeInput;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  source: Scalars['LongString']['input'];
};

export type UpdateSourcePreferencePayload = {
  __typename?: 'UpdateSourcePreferencePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  preferences: Array<Preference>;
  source: SourceType;
};

export enum UpdateState {
  Downloading = 'DOWNLOADING',
  Error = 'ERROR',
  Finished = 'FINISHED',
  Stopped = 'STOPPED'
}

export type UpdateStatus = {
  __typename?: 'UpdateStatus';
  completeJobs: UpdateStatusType;
  failedJobs: UpdateStatusType;
  isRunning: Scalars['Boolean']['output'];
  pendingJobs: UpdateStatusType;
  runningJobs: UpdateStatusType;
  skippedCategories: UpdateStatusCategoryType;
  skippedJobs: UpdateStatusType;
  updatingCategories: UpdateStatusCategoryType;
};

export type UpdateStatusCategoryType = {
  __typename?: 'UpdateStatusCategoryType';
  categories: CategoryNodeList;
};

export type UpdateStatusType = {
  __typename?: 'UpdateStatusType';
  mangas: MangaNodeList;
};

export type UpdateStopInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateStopPayload = {
  __typename?: 'UpdateStopPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type ValidateBackupInput = {
  backup: Scalars['Upload']['input'];
};

export type ValidateBackupResult = {
  __typename?: 'ValidateBackupResult';
  missingSources: Array<ValidateBackupSource>;
};

export type ValidateBackupSource = {
  __typename?: 'ValidateBackupSource';
  id: Scalars['LongString']['output'];
  name: Scalars['String']['output'];
};

export enum WebUiChannel {
  Bundled = 'BUNDLED',
  Preview = 'PREVIEW',
  Stable = 'STABLE'
}

export enum WebUiFlavor {
  Custom = 'CUSTOM',
  Webui = 'WEBUI'
}

export enum WebUiInterface {
  Browser = 'BROWSER',
  Electron = 'ELECTRON'
}

export type WebUiUpdateInfo = {
  __typename?: 'WebUIUpdateInfo';
  channel: Scalars['String']['output'];
  tag: Scalars['String']['output'];
  updateAvailable: Scalars['Boolean']['output'];
};

export type WebUiUpdateInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type WebUiUpdatePayload = {
  __typename?: 'WebUIUpdatePayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  updateStatus: WebUiUpdateStatus;
};

export type WebUiUpdateStatus = {
  __typename?: 'WebUIUpdateStatus';
  info: WebUiUpdateInfo;
  progress: Scalars['Int']['output'];
  state: UpdateState;
};

export type ChapterTypeFragmentFragment = { __typename?: 'ChapterType', isBookmarked: boolean, isDownloaded: boolean, isRead: boolean, id: number, chapterNumber: number, fetchedAt: any, lastPageRead: number, name: string, sourceOrder: number, uploadDate: any, pageCount: number, scanlator?: string | null };

export type MangaTypeFragmentFragment = { __typename?: 'MangaType', artist?: string | null, author?: string | null, description?: string | null, genre: Array<string>, id: number, inLibrary: boolean, lastFetchedAt?: any | null, realUrl?: string | null, status: MangaStatus, title: string, thumbnailUrl?: string | null, unreadCount: number, downloadCount: number, lastReadChapter?: { __typename?: 'ChapterType', lastReadAt: any } | null, meta: Array<{ __typename?: 'MangaMetaType', value: string, key: string }>, source?: { __typename?: 'SourceType', displayName: string } | null, categories: { __typename?: 'CategoryNodeList', nodes: Array<{ __typename?: 'CategoryType', id: number }> } };

export type SourceTypeFragmentFragment = { __typename?: 'SourceType', id: any, displayName: string, iconUrl: string, lang: string };

type PreferenceFragment_CheckBoxPreference_Fragment = { __typename?: 'CheckBoxPreference', summary?: string | null, key: string, CheckBoxCheckBoxCurrentValue?: boolean | null, CheckBoxDefault: boolean, CheckBoxTitle: string };

type PreferenceFragment_EditTextPreference_Fragment = { __typename?: 'EditTextPreference', text?: string | null, summary?: string | null, key: string, dialogTitle?: string | null, dialogMessage?: string | null, EditTextCurrentValue?: string | null, EditTextDefault?: string | null, EditTextTitle?: string | null };

type PreferenceFragment_ListPreference_Fragment = { __typename?: 'ListPreference', summary?: string | null, key: string, entryValues: Array<string>, entries: Array<string>, ListCurrentValue?: string | null, ListDefault?: string | null, ListTitle?: string | null };

type PreferenceFragment_MultiSelectListPreference_Fragment = { __typename?: 'MultiSelectListPreference', dialogMessage?: string | null, dialogTitle?: string | null, summary?: string | null, key: string, entryValues: Array<string>, entries: Array<string>, MultiSelectListTitle?: string | null, MultiSelectListDefault?: Array<string> | null, MultiSelectListCurrentValue?: Array<string> | null };

type PreferenceFragment_SwitchPreference_Fragment = { __typename?: 'SwitchPreference', summary?: string | null, key: string, SwitchCurrentValue?: boolean | null, SwitchDefault: boolean, SwitchTitle: string };

export type PreferenceFragmentFragment = PreferenceFragment_CheckBoxPreference_Fragment | PreferenceFragment_EditTextPreference_Fragment | PreferenceFragment_ListPreference_Fragment | PreferenceFragment_MultiSelectListPreference_Fragment | PreferenceFragment_SwitchPreference_Fragment;

export type ExtensionTypeFragmentFragment = { __typename?: 'ExtensionType', name: string, versionName: string, pkgName: string, lang: string, iconUrl: string, isNsfw: boolean, isInstalled: boolean, isObsolete: boolean, hasUpdate: boolean };

export type FetchExtensionsMutationVariables = Exact<{ [key: string]: never; }>;


export type FetchExtensionsMutation = { __typename?: 'Mutation', fetchExtensions: { __typename?: 'FetchExtensionsPayload', extensions: Array<{ __typename?: 'ExtensionType', name: string, versionName: string, pkgName: string, lang: string, iconUrl: string, isNsfw: boolean, isInstalled: boolean, isObsolete: boolean, hasUpdate: boolean }> } };

export type UpdateChaptersMutationVariables = Exact<{
  ids: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
  isBookmarked?: InputMaybe<Scalars['Boolean']['input']>;
  isRead?: InputMaybe<Scalars['Boolean']['input']>;
  lastPageRead?: InputMaybe<Scalars['Int']['input']>;
}>;


export type UpdateChaptersMutation = { __typename?: 'Mutation', updateChapters: { __typename?: 'UpdateChaptersPayload', chapters: Array<{ __typename?: 'ChapterType', isBookmarked: boolean, isDownloaded: boolean, isRead: boolean, id: number }> } };

export type UpdateChapterMutationVariables = Exact<{
  isRead?: InputMaybe<Scalars['Boolean']['input']>;
  lastPageRead: Scalars['Int']['input'];
  id: Scalars['Int']['input'];
}>;


export type UpdateChapterMutation = { __typename?: 'Mutation', updateChapter: { __typename?: 'UpdateChapterPayload', chapter: { __typename?: 'ChapterType', id: number, isRead: boolean, lastPageRead: number } } };

export type UpdateMangasMutationVariables = Exact<{
  ids: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
  inLibrary: Scalars['Boolean']['input'];
}>;


export type UpdateMangasMutation = { __typename?: 'Mutation', updateMangas: { __typename?: 'UpdateMangasPayload', mangas: Array<{ __typename?: 'MangaType', inLibrary: boolean, id: number, categories: { __typename?: 'CategoryNodeList', nodes: Array<{ __typename?: 'CategoryType', id: number }> } }> } };

export type SetGlobalMetaMutationVariables = Exact<{
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
}>;


export type SetGlobalMetaMutation = { __typename?: 'Mutation', setGlobalMeta: { __typename?: 'SetGlobalMetaPayload', meta: { __typename?: 'GlobalMetaType', value: string, key: string } } };

export type DeleteGlobalMetaMutationVariables = Exact<{
  key: Scalars['String']['input'];
}>;


export type DeleteGlobalMetaMutation = { __typename?: 'Mutation', deleteGlobalMeta: { __typename?: 'DeleteGlobalMetaPayload', clientMutationId?: string | null } };

export type SetMangaMetaMutationVariables = Exact<{
  value: Scalars['String']['input'];
  id: Scalars['Int']['input'];
  key: Scalars['String']['input'];
}>;


export type SetMangaMetaMutation = { __typename?: 'Mutation', setMangaMeta: { __typename?: 'SetMangaMetaPayload', meta: { __typename?: 'MangaMetaType', manga: { __typename?: 'MangaType', id: number, meta: Array<{ __typename?: 'MangaMetaType', key: string, mangaId: number, value: string }> } } } };

export type DeleteMangaMetaMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  key: Scalars['String']['input'];
}>;


export type DeleteMangaMetaMutation = { __typename?: 'Mutation', deleteMangaMeta: { __typename?: 'DeleteMangaMetaPayload', manga: { __typename?: 'MangaType', id: number, meta: Array<{ __typename?: 'MangaMetaType', key: string, value: string }> } } };

export type FetchMangaInfoMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type FetchMangaInfoMutation = { __typename?: 'Mutation', fetchManga: { __typename?: 'FetchMangaPayload', manga: { __typename?: 'MangaType', artist?: string | null, author?: string | null, description?: string | null, genre: Array<string>, id: number, inLibrary: boolean, lastFetchedAt?: any | null, realUrl?: string | null, status: MangaStatus, title: string, thumbnailUrl?: string | null, unreadCount: number, downloadCount: number, lastReadChapter?: { __typename?: 'ChapterType', lastReadAt: any } | null, meta: Array<{ __typename?: 'MangaMetaType', value: string, key: string }>, source?: { __typename?: 'SourceType', displayName: string } | null, categories: { __typename?: 'CategoryNodeList', nodes: Array<{ __typename?: 'CategoryType', id: number }> } } } };

export type FetchMangaChaptersMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type FetchMangaChaptersMutation = { __typename?: 'Mutation', fetchChapters: { __typename?: 'FetchChaptersPayload', chapters: Array<{ __typename?: 'ChapterType', isBookmarked: boolean, isDownloaded: boolean, isRead: boolean, id: number, chapterNumber: number, fetchedAt: any, lastPageRead: number, name: string, sourceOrder: number, uploadDate: any, pageCount: number, scanlator?: string | null }> } };

export type UpdateExtensionMutationVariables = Exact<{
  pkgName: Scalars['String']['input'];
  install?: InputMaybe<Scalars['Boolean']['input']>;
  uninstall?: InputMaybe<Scalars['Boolean']['input']>;
  update?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type UpdateExtensionMutation = { __typename?: 'Mutation', updateExtension: { __typename?: 'UpdateExtensionPayload', extension: { __typename?: 'ExtensionType', name: string, versionName: string, pkgName: string, lang: string, iconUrl: string, isNsfw: boolean, isInstalled: boolean, isObsolete: boolean, hasUpdate: boolean, source: { __typename?: 'SourceNodeList', nodes: Array<{ __typename?: 'SourceType', isNsfw: boolean, id: any, displayName: string, iconUrl: string, lang: string, extension: { __typename?: 'ExtensionType', pkgName: string } }> } } } };

export type FetchSourceMangaMutationVariables = Exact<{
  page: Scalars['Int']['input'];
  source: Scalars['LongString']['input'];
  type: FetchSourceMangaType;
  query?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<Array<FilterChangeInput> | FilterChangeInput>;
}>;


export type FetchSourceMangaMutation = { __typename?: 'Mutation', fetchSourceManga: { __typename?: 'FetchSourceMangaPayload', hasNextPage: boolean, mangas: Array<{ __typename?: 'MangaType', id: number, title: string, inLibrary: boolean, thumbnailUrl?: string | null }> } };

export type UpdateSourcePreferenceMutationVariables = Exact<{
  position: Scalars['Int']['input'];
  source: Scalars['LongString']['input'];
  multiSelectState?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  listState?: InputMaybe<Scalars['String']['input']>;
  editTextState?: InputMaybe<Scalars['String']['input']>;
  switchState?: InputMaybe<Scalars['Boolean']['input']>;
  checkBoxState?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type UpdateSourcePreferenceMutation = { __typename?: 'Mutation', updateSourcePreference: { __typename?: 'UpdateSourcePreferencePayload', clientMutationId?: string | null, source: { __typename?: 'SourceType', id: any, preferences: Array<{ __typename?: 'CheckBoxPreference', summary?: string | null, key: string, CheckBoxCheckBoxCurrentValue?: boolean | null, CheckBoxDefault: boolean, CheckBoxTitle: string } | { __typename?: 'EditTextPreference', text?: string | null, summary?: string | null, key: string, dialogTitle?: string | null, dialogMessage?: string | null, EditTextCurrentValue?: string | null, EditTextDefault?: string | null, EditTextTitle?: string | null } | { __typename?: 'ListPreference', summary?: string | null, key: string, entryValues: Array<string>, entries: Array<string>, ListCurrentValue?: string | null, ListDefault?: string | null, ListTitle?: string | null } | { __typename?: 'MultiSelectListPreference', dialogMessage?: string | null, dialogTitle?: string | null, summary?: string | null, key: string, entryValues: Array<string>, entries: Array<string>, MultiSelectListTitle?: string | null, MultiSelectListDefault?: Array<string> | null, MultiSelectListCurrentValue?: Array<string> | null } | { __typename?: 'SwitchPreference', summary?: string | null, key: string, SwitchCurrentValue?: boolean | null, SwitchDefault: boolean, SwitchTitle: string }> } } };

export type UpdateCategoryOrderMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  position: Scalars['Int']['input'];
}>;


export type UpdateCategoryOrderMutation = { __typename?: 'Mutation', updateCategoryOrder: { __typename?: 'UpdateCategoryOrderPayload', categories: Array<{ __typename?: 'CategoryType', id: number, default: boolean, order: number, name: string }> } };

export type CreateCategoryMutationVariables = Exact<{
  name: Scalars['String']['input'];
  default: Scalars['Boolean']['input'];
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory: { __typename?: 'CreateCategoryPayload', category: { __typename?: 'CategoryType', id: number, name: string, default: boolean, order: number } } };

export type DeleteCategoryMutationVariables = Exact<{
  categoryId: Scalars['Int']['input'];
}>;


export type DeleteCategoryMutation = { __typename?: 'Mutation', deleteCategory: { __typename?: 'DeleteCategoryPayload', clientMutationId?: string | null } };

export type UpdateCategoryMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  default?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type UpdateCategoryMutation = { __typename?: 'Mutation', updateCategory: { __typename?: 'UpdateCategoryPayload', category: { __typename?: 'CategoryType', id: number, default: boolean, name: string, order: number } } };

export type UpdateMangasCategoriesMutationVariables = Exact<{
  addTo?: InputMaybe<Array<Scalars['Int']['input']> | Scalars['Int']['input']>;
  clear?: InputMaybe<Scalars['Boolean']['input']>;
  id: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
}>;


export type UpdateMangasCategoriesMutation = { __typename?: 'Mutation', updateMangasCategories: { __typename?: 'UpdateMangasCategoriesPayload', mangas: Array<{ __typename?: 'MangaType', id: number, categories: { __typename?: 'CategoryNodeList', nodes: Array<{ __typename?: 'CategoryType', id: number }> } }> } };

export type UpdateMangaCategoriesMutationVariables = Exact<{
  addTo?: InputMaybe<Array<Scalars['Int']['input']> | Scalars['Int']['input']>;
  clear?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['Int']['input'];
}>;


export type UpdateMangaCategoriesMutation = { __typename?: 'Mutation', updateMangaCategories: { __typename?: 'UpdateMangaCategoriesPayload', manga: { __typename?: 'MangaType', id: number, categories: { __typename?: 'CategoryNodeList', nodes: Array<{ __typename?: 'CategoryType', id: number }> } } } };

export type FetchChapterPagesMutationVariables = Exact<{
  chapterId: Scalars['Int']['input'];
}>;


export type FetchChapterPagesMutation = { __typename?: 'Mutation', fetchChapterPages: { __typename?: 'FetchChapterPagesPayload', pages: Array<string> } };

export type ChaptersMigrationMutationVariables = Exact<{
  ids: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
  lastPageRead?: InputMaybe<Scalars['Int']['input']>;
  isRead?: InputMaybe<Scalars['Boolean']['input']>;
  isBookmarked?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type ChaptersMigrationMutation = { __typename?: 'Mutation', updateChapters: { __typename?: 'UpdateChaptersPayload', clientMutationId?: string | null } };

export type FetchChaptersMigrationMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type FetchChaptersMigrationMutation = { __typename?: 'Mutation', fetchChapters: { __typename?: 'FetchChaptersPayload', chapters: Array<{ __typename?: 'ChapterType', id: number, chapterNumber: number }> } };

export type CreateBackupMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateBackupMutation = { __typename?: 'Mutation', createBackup: { __typename?: 'CreateBackupPayload', url: string } };

export type RestoreBackupMutationVariables = Exact<{
  backup: Scalars['Upload']['input'];
}>;


export type RestoreBackupMutation = { __typename?: 'Mutation', restoreBackup: { __typename?: 'RestoreBackupPayload', id: string, status?: { __typename?: 'BackupRestoreStatus', mangaProgress: number, state: BackupRestoreState, totalManga: number } | null } };

export type ClearDownloaderMutationVariables = Exact<{ [key: string]: never; }>;


export type ClearDownloaderMutation = { __typename?: 'Mutation', clearDownloader: { __typename?: 'ClearDownloaderPayload', downloadStatus: { __typename?: 'DownloadStatus', state: DownloaderState } } };

export type DequeueChapterDownloadsMutationVariables = Exact<{
  ids: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
}>;


export type DequeueChapterDownloadsMutation = { __typename?: 'Mutation', dequeueChapterDownloads: { __typename?: 'DequeueChapterDownloadsPayload', clientMutationId?: string | null } };

export type EnqueueChapterDownloadsMutationVariables = Exact<{
  ids: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
}>;


export type EnqueueChapterDownloadsMutation = { __typename?: 'Mutation', enqueueChapterDownloads: { __typename?: 'EnqueueChapterDownloadsPayload', clientMutationId?: string | null } };

export type ReorderChapterDownloadMutationVariables = Exact<{
  chapterId: Scalars['Int']['input'];
  to: Scalars['Int']['input'];
}>;


export type ReorderChapterDownloadMutation = { __typename?: 'Mutation', reorderChapterDownload: { __typename?: 'ReorderChapterDownloadPayload', clientMutationId?: string | null } };

export type StartDownloaderMutationVariables = Exact<{ [key: string]: never; }>;


export type StartDownloaderMutation = { __typename?: 'Mutation', startDownloader: { __typename?: 'StartDownloaderPayload', downloadStatus: { __typename?: 'DownloadStatus', state: DownloaderState } } };

export type StopDownloaderMutationVariables = Exact<{ [key: string]: never; }>;


export type StopDownloaderMutation = { __typename?: 'Mutation', stopDownloader: { __typename?: 'StopDownloaderPayload', downloadStatus: { __typename?: 'DownloadStatus', state: DownloaderState } } };

export type DeleteDownloadedChapterMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteDownloadedChapterMutation = { __typename?: 'Mutation', deleteDownloadedChapter: { __typename?: 'DeleteDownloadedChapterPayload', chapters: { __typename?: 'ChapterType', isBookmarked: boolean, isDownloaded: boolean, isRead: boolean, id: number, chapterNumber: number, fetchedAt: any, lastPageRead: number, name: string, sourceOrder: number, uploadDate: any, pageCount: number, scanlator?: string | null } } };

export type DeleteDownloadedChaptersMutationVariables = Exact<{
  ids: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
}>;


export type DeleteDownloadedChaptersMutation = { __typename?: 'Mutation', deleteDownloadedChapters: { __typename?: 'DeleteDownloadedChaptersPayload', chapters: Array<{ __typename?: 'ChapterType', isBookmarked: boolean, isDownloaded: boolean, isRead: boolean, id: number, chapterNumber: number, fetchedAt: any, lastPageRead: number, name: string, sourceOrder: number, uploadDate: any, pageCount: number, scanlator?: string | null }> } };

export type CategoriesQueryVariables = Exact<{
  notEqualTo?: InputMaybe<Scalars['Int']['input']>;
}>;


export type CategoriesQuery = { __typename?: 'Query', categories: { __typename?: 'CategoryNodeList', nodes: Array<{ __typename?: 'CategoryType', id: number, default: boolean, order: number, name: string, mangas: { __typename?: 'MangaNodeList', totalCount: number } }> } };

export type CategoryQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type CategoryQuery = { __typename?: 'Query', category: { __typename?: 'CategoryType', mangas: { __typename?: 'MangaNodeList', nodes: Array<{ __typename?: 'MangaType', id: number, title: string, inLibrary: boolean, thumbnailUrl?: string | null, unreadCount: number, downloadCount: number, lastReadChapter?: { __typename?: 'ChapterType', lastReadAt: any } | null, chapters: { __typename?: 'ChapterNodeList', totalCount: number } }> } } };

export type GetMangaQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetMangaQuery = { __typename?: 'Query', manga: { __typename?: 'MangaType', artist?: string | null, author?: string | null, description?: string | null, genre: Array<string>, id: number, inLibrary: boolean, lastFetchedAt?: any | null, realUrl?: string | null, status: MangaStatus, title: string, thumbnailUrl?: string | null, unreadCount: number, downloadCount: number, chapters: { __typename?: 'ChapterNodeList', totalCount: number, nodes: Array<{ __typename?: 'ChapterType', isBookmarked: boolean, isDownloaded: boolean, isRead: boolean, id: number, chapterNumber: number, fetchedAt: any, lastPageRead: number, name: string, sourceOrder: number, uploadDate: any, pageCount: number, scanlator?: string | null }> }, lastReadChapter?: { __typename?: 'ChapterType', lastReadAt: any } | null, meta: Array<{ __typename?: 'MangaMetaType', value: string, key: string }>, source?: { __typename?: 'SourceType', displayName: string } | null, categories: { __typename?: 'CategoryNodeList', nodes: Array<{ __typename?: 'CategoryType', id: number }> } } };

export type GetSingleChapterQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetSingleChapterQuery = { __typename?: 'Query', chapter: { __typename?: 'ChapterType', isBookmarked: boolean, isDownloaded: boolean, isRead: boolean, id: number, chapterNumber: number, fetchedAt: any, lastPageRead: number, name: string, sourceOrder: number, uploadDate: any, pageCount: number, scanlator?: string | null } };

export type ExtensionsQueryVariables = Exact<{
  isNsfw?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type ExtensionsQuery = { __typename?: 'Query', extensions: { __typename?: 'ExtensionNodeList', nodes: Array<{ __typename?: 'ExtensionType', name: string, versionName: string, pkgName: string, lang: string, iconUrl: string, isNsfw: boolean, isInstalled: boolean, isObsolete: boolean, hasUpdate: boolean }> } };

export type SourcesQueryVariables = Exact<{
  isNsfw?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type SourcesQuery = { __typename?: 'Query', sources: { __typename?: 'SourceNodeList', nodes: Array<{ __typename?: 'SourceType', isNsfw: boolean, id: any, displayName: string, iconUrl: string, lang: string, extension: { __typename?: 'ExtensionType', pkgName: string } }> } };

export type SourcesMigrationQueryVariables = Exact<{ [key: string]: never; }>;


export type SourcesMigrationQuery = { __typename?: 'Query', sources: { __typename?: 'SourceNodeList', nodes: Array<{ __typename?: 'SourceType', id: any, displayName: string, iconUrl: string, lang: string }> }, mangas: { __typename?: 'MangaNodeList', totalCount: number, nodes: Array<{ __typename?: 'MangaType', sourceId: any }> } };

export type SourceMigrationMangaQueryVariables = Exact<{
  sourceId: Scalars['LongString']['input'];
}>;


export type SourceMigrationMangaQuery = { __typename?: 'Query', mangas: { __typename?: 'MangaNodeList', nodes: Array<{ __typename?: 'MangaType', id: number, title: string, thumbnailUrl?: string | null }> } };

export type SourceMigrationsourceQueryVariables = Exact<{
  sourceId: Scalars['LongString']['input'];
}>;


export type SourceMigrationsourceQuery = { __typename?: 'Query', source: { __typename?: 'SourceType', displayName: string } };

export type MangaTitleMigrationQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type MangaTitleMigrationQuery = { __typename?: 'Query', manga: { __typename?: 'MangaType', title: string } };

export type InfoForMigrationQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type InfoForMigrationQuery = { __typename?: 'Query', manga: { __typename?: 'MangaType', chapters: { __typename?: 'ChapterNodeList', nodes: Array<{ __typename?: 'ChapterType', id: number, isRead: boolean, isBookmarked: boolean, chapterNumber: number }> }, categories: { __typename?: 'CategoryNodeList', nodes: Array<{ __typename?: 'CategoryType', id: number }> } } };

export type MetasQueryVariables = Exact<{ [key: string]: never; }>;


export type MetasQuery = { __typename?: 'Query', metas: { __typename?: 'GlobalMetaNodeList', nodes: Array<{ __typename?: 'GlobalMetaType', value: string, key: string }> } };

export type UpdatesQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type UpdatesQuery = { __typename?: 'Query', chapters: { __typename?: 'ChapterNodeList', nodes: Array<{ __typename?: 'ChapterType', id: number, name: string, fetchedAt: any, isBookmarked: boolean, isDownloaded: boolean, isRead: boolean, manga: { __typename?: 'MangaType', id: number, title: string, thumbnailUrl?: string | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean } } };

export type ChaptersQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type ChaptersQuery = { __typename?: 'Query', manga: { __typename?: 'MangaType', id: number, title: string, meta: Array<{ __typename?: 'MangaMetaType', value: string, key: string }>, chapters: { __typename?: 'ChapterNodeList', nodes: Array<{ __typename?: 'ChapterType', id: number, name: string, pageCount: number, lastPageRead: number, sourceOrder: number }> } } };

export type SourceQueryVariables = Exact<{
  id: Scalars['LongString']['input'];
}>;


export type SourceQuery = { __typename?: 'Query', source: { __typename?: 'SourceType', displayName: string, id: any, lang: string, name: string, supportsLatest: boolean, isConfigurable: boolean, preferences: Array<{ __typename?: 'CheckBoxPreference', summary?: string | null, key: string, CheckBoxCheckBoxCurrentValue?: boolean | null, CheckBoxDefault: boolean, CheckBoxTitle: string } | { __typename?: 'EditTextPreference', text?: string | null, summary?: string | null, key: string, dialogTitle?: string | null, dialogMessage?: string | null, EditTextCurrentValue?: string | null, EditTextDefault?: string | null, EditTextTitle?: string | null } | { __typename?: 'ListPreference', summary?: string | null, key: string, entryValues: Array<string>, entries: Array<string>, ListCurrentValue?: string | null, ListDefault?: string | null, ListTitle?: string | null } | { __typename?: 'MultiSelectListPreference', dialogMessage?: string | null, dialogTitle?: string | null, summary?: string | null, key: string, entryValues: Array<string>, entries: Array<string>, MultiSelectListTitle?: string | null, MultiSelectListDefault?: Array<string> | null, MultiSelectListCurrentValue?: Array<string> | null } | { __typename?: 'SwitchPreference', summary?: string | null, key: string, SwitchCurrentValue?: boolean | null, SwitchDefault: boolean, SwitchTitle: string }>, filters: Array<{ __typename: 'CheckBoxFilter', name: string, CheckBoxDefault: boolean } | { __typename: 'GroupFilter', name: string, filters: Array<{ __typename: 'CheckBoxFilter', name: string, CheckBoxDefault: boolean } | { __typename?: 'GroupFilter' } | { __typename: 'HeaderFilter', name: string } | { __typename: 'SelectFilter', values: Array<string>, name: string, SelectDefault: number } | { __typename: 'SeparatorFilter', name: string } | { __typename: 'SortFilter', values: Array<string>, name: string, SortDefault?: { __typename?: 'SortSelection', ascending: boolean, index: number } | null } | { __typename: 'TextFilter', name: string, TextDefault: string } | { __typename: 'TriStateFilter', name: string, TriStateDefault: TriState }> } | { __typename: 'HeaderFilter', name: string } | { __typename: 'SelectFilter', values: Array<string>, name: string, SelectDefault: number } | { __typename: 'SeparatorFilter', name: string } | { __typename: 'SortFilter', values: Array<string>, name: string, SortDefault?: { __typename?: 'SortSelection', ascending: boolean, index: number } | null } | { __typename: 'TextFilter', name: string, TextDefault: string } | { __typename: 'TriStateFilter', name: string, TriStateDefault: TriState }> } };

export type ValidateBackupQueryVariables = Exact<{
  backup: Scalars['Upload']['input'];
}>;


export type ValidateBackupQuery = { __typename?: 'Query', validateBackup: { __typename?: 'ValidateBackupResult', missingSources: Array<{ __typename?: 'ValidateBackupSource', id: any, name: string }> } };

export type ConditionalChaptersOfGivenMangaQueryVariables = Exact<{
  in: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
  isBookmarked?: InputMaybe<Scalars['Boolean']['input']>;
  isDownloaded?: InputMaybe<Scalars['Boolean']['input']>;
  isRead?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type ConditionalChaptersOfGivenMangaQuery = { __typename?: 'Query', chapters: { __typename?: 'ChapterNodeList', nodes: Array<{ __typename?: 'ChapterType', id: number }> } };

export type AboutQueryVariables = Exact<{ [key: string]: never; }>;


export type AboutQuery = { __typename?: 'Query', about: { __typename?: 'AboutPayload', buildTime: any, buildType: string, discord: string, github: string, name: string, revision: string, version: string } };

export type RestoreStatusQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type RestoreStatusQuery = { __typename?: 'Query', restoreStatus?: { __typename?: 'BackupRestoreStatus', mangaProgress: number, state: BackupRestoreState, totalManga: number } | null };

export type DownloadChangedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type DownloadChangedSubscription = { __typename?: 'Subscription', downloadChanged: { __typename?: 'DownloadStatus', state: DownloaderState, queue: Array<{ __typename?: 'DownloadType', progress: number, state: DownloadState, tries: number, chapter: { __typename?: 'ChapterType', name: string, id: number }, manga: { __typename?: 'MangaType', title: string, thumbnailUrl?: string | null, id: number } }> } };

export type DownloadsOnChaptersSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type DownloadsOnChaptersSubscription = { __typename?: 'Subscription', downloadChanged: { __typename?: 'DownloadStatus', state: DownloaderState, queue: Array<{ __typename?: 'DownloadType', progress: number, state: DownloadState, chapter: { __typename?: 'ChapterType', id: number }, manga: { __typename?: 'MangaType', id: number } }> } };

export const ChapterTypeFragmentFragmentDoc = gql`
    fragment ChapterTypeFragment on ChapterType {
  isBookmarked
  isDownloaded
  isRead
  id
  chapterNumber
  fetchedAt
  lastPageRead
  name
  sourceOrder
  uploadDate
  pageCount
  scanlator
}
    `;
export const MangaTypeFragmentFragmentDoc = gql`
    fragment MangaTypeFragment on MangaType {
  artist
  author
  description
  genre
  id
  inLibrary
  lastFetchedAt
  realUrl
  status
  title
  thumbnailUrl
  unreadCount
  downloadCount
  lastReadChapter {
    lastReadAt
  }
  meta {
    value
    key
  }
  source {
    displayName
  }
  categories {
    nodes {
      id
    }
  }
}
    `;
export const SourceTypeFragmentFragmentDoc = gql`
    fragment SourceTypeFragment on SourceType {
  id
  displayName
  iconUrl
  lang
}
    `;
export const PreferenceFragmentFragmentDoc = gql`
    fragment PreferenceFragment on Preference {
  ... on CheckBoxPreference {
    CheckBoxCheckBoxCurrentValue: currentValue
    summary
    CheckBoxDefault: default
    key
    CheckBoxTitle: title
  }
  ... on EditTextPreference {
    EditTextCurrentValue: currentValue
    EditTextDefault: default
    EditTextTitle: title
    text
    summary
    key
    dialogTitle
    dialogMessage
  }
  ... on SwitchPreference {
    SwitchCurrentValue: currentValue
    summary
    key
    SwitchDefault: default
    SwitchTitle: title
  }
  ... on MultiSelectListPreference {
    dialogMessage
    dialogTitle
    MultiSelectListTitle: title
    summary
    key
    entryValues
    entries
    MultiSelectListDefault: default
    MultiSelectListCurrentValue: currentValue
  }
  ... on ListPreference {
    ListCurrentValue: currentValue
    ListDefault: default
    ListTitle: title
    summary
    key
    entryValues
    entries
  }
}
    `;
export const ExtensionTypeFragmentFragmentDoc = gql`
    fragment ExtensionTypeFragment on ExtensionType {
  name
  versionName
  pkgName
  lang
  iconUrl
  isNsfw
  isInstalled
  isObsolete
  hasUpdate
}
    `;
export const FetchExtensionsDoc = gql`
    mutation fetchExtensions {
  fetchExtensions(input: {}) {
    extensions {
      ...ExtensionTypeFragment
    }
  }
}
    ${ExtensionTypeFragmentFragmentDoc}`;
export const UpdateChaptersDoc = gql`
    mutation updateChapters($ids: [Int!]!, $isBookmarked: Boolean, $isRead: Boolean, $lastPageRead: Int) {
  updateChapters(
    input: {ids: $ids, patch: {isRead: $isRead, isBookmarked: $isBookmarked, lastPageRead: $lastPageRead}}
  ) {
    chapters {
      isBookmarked
      isDownloaded
      isRead
      id
    }
  }
}
    `;
export const UpdateChapterDoc = gql`
    mutation updateChapter($isRead: Boolean = null, $lastPageRead: Int!, $id: Int!) {
  updateChapter(
    input: {id: $id, patch: {isRead: $isRead, lastPageRead: $lastPageRead}}
  ) {
    chapter {
      id
      isRead
      lastPageRead
    }
  }
}
    `;
export const UpdateMangasDoc = gql`
    mutation updateMangas($ids: [Int!]!, $inLibrary: Boolean!) {
  updateMangas(input: {patch: {inLibrary: $inLibrary}, ids: $ids}) {
    mangas {
      inLibrary
      id
      categories {
        nodes {
          id
        }
      }
    }
  }
}
    `;
export const SetGlobalMetaDoc = gql`
    mutation setGlobalMeta($key: String!, $value: String!) {
  setGlobalMeta(input: {meta: {key: $key, value: $value}}) {
    meta {
      value
      key
    }
  }
}
    `;
export const DeleteGlobalMetaDoc = gql`
    mutation deleteGlobalMeta($key: String!) {
  deleteGlobalMeta(input: {key: $key}) {
    clientMutationId
  }
}
    `;
export const SetMangaMetaDoc = gql`
    mutation setMangaMeta($value: String!, $id: Int!, $key: String!) {
  setMangaMeta(input: {meta: {key: $key, mangaId: $id, value: $value}}) {
    meta {
      manga {
        meta {
          key
          mangaId
          value
        }
        id
      }
    }
  }
}
    `;
export const DeleteMangaMetaDoc = gql`
    mutation deleteMangaMeta($id: Int!, $key: String!) {
  deleteMangaMeta(input: {key: $key, mangaId: $id}) {
    manga {
      id
      meta {
        key
        value
      }
    }
  }
}
    `;
export const FetchMangaInfoDoc = gql`
    mutation fetchMangaInfo($id: Int!) {
  fetchManga(input: {id: $id}) {
    manga {
      ...MangaTypeFragment
    }
  }
}
    ${MangaTypeFragmentFragmentDoc}`;
export const FetchMangaChaptersDoc = gql`
    mutation fetchMangaChapters($id: Int!) {
  fetchChapters(input: {mangaId: $id}) {
    chapters {
      ...ChapterTypeFragment
    }
  }
}
    ${ChapterTypeFragmentFragmentDoc}`;
export const UpdateExtensionDoc = gql`
    mutation updateExtension($pkgName: String!, $install: Boolean = null, $uninstall: Boolean = null, $update: Boolean = null) {
  updateExtension(
    input: {id: $pkgName, patch: {install: $install, uninstall: $uninstall, update: $update}}
  ) {
    extension {
      ...ExtensionTypeFragment
      source {
        nodes {
          ...SourceTypeFragment
          isNsfw
          extension {
            pkgName
          }
        }
      }
    }
  }
}
    ${ExtensionTypeFragmentFragmentDoc}
${SourceTypeFragmentFragmentDoc}`;
export const FetchSourceMangaDoc = gql`
    mutation fetchSourceManga($page: Int!, $source: LongString!, $type: FetchSourceMangaType!, $query: String, $filters: [FilterChangeInput!]) {
  fetchSourceManga(
    input: {page: $page, source: $source, type: $type, query: $query, filters: $filters}
  ) {
    hasNextPage
    mangas {
      id
      title
      inLibrary
      thumbnailUrl
    }
  }
}
    `;
export const UpdateSourcePreferenceDoc = gql`
    mutation updateSourcePreference($position: Int!, $source: LongString!, $multiSelectState: [String!] = null, $listState: String = null, $editTextState: String = null, $switchState: Boolean = null, $checkBoxState: Boolean = null) {
  updateSourcePreference(
    input: {change: {position: $position, multiSelectState: $multiSelectState, listState: $listState, editTextState: $editTextState, checkBoxState: $checkBoxState, switchState: $switchState}, source: $source}
  ) {
    clientMutationId
    source {
      id
      preferences {
        ...PreferenceFragment
      }
    }
  }
}
    ${PreferenceFragmentFragmentDoc}`;
export const UpdateCategoryOrderDoc = gql`
    mutation updateCategoryOrder($id: Int!, $position: Int!) {
  updateCategoryOrder(input: {id: $id, position: $position}) {
    categories {
      id
      default
      order
      name
    }
  }
}
    `;
export const CreateCategoryDoc = gql`
    mutation createCategory($name: String!, $default: Boolean!) {
  createCategory(input: {name: $name, default: $default}) {
    category {
      id
      name
      default
      order
    }
  }
}
    `;
export const DeleteCategoryDoc = gql`
    mutation deleteCategory($categoryId: Int!) {
  deleteCategory(input: {categoryId: $categoryId}) {
    clientMutationId
  }
}
    `;
export const UpdateCategoryDoc = gql`
    mutation updateCategory($id: Int!, $name: String = null, $default: Boolean = null) {
  updateCategory(input: {id: $id, patch: {default: $default, name: $name}}) {
    category {
      id
      default
      name
      order
    }
  }
}
    `;
export const UpdateMangasCategoriesDoc = gql`
    mutation updateMangasCategories($addTo: [Int!] = null, $clear: Boolean = null, $id: [Int!]!) {
  updateMangasCategories(
    input: {ids: $id, patch: {addToCategories: $addTo, clearCategories: $clear}}
  ) {
    mangas {
      id
      categories {
        nodes {
          id
        }
      }
    }
  }
}
    `;
export const UpdateMangaCategoriesDoc = gql`
    mutation updateMangaCategories($addTo: [Int!] = null, $clear: Boolean = null, $id: Int!) {
  updateMangaCategories(
    input: {id: $id, patch: {addToCategories: $addTo, clearCategories: $clear}}
  ) {
    manga {
      id
      categories {
        nodes {
          id
        }
      }
    }
  }
}
    `;
export const FetchChapterPagesDoc = gql`
    mutation fetchChapterPages($chapterId: Int!) {
  fetchChapterPages(input: {chapterId: $chapterId}) {
    pages
  }
}
    `;
export const ChaptersMigrationDoc = gql`
    mutation ChaptersMigration($ids: [Int!]!, $lastPageRead: Int = null, $isRead: Boolean = null, $isBookmarked: Boolean = null) {
  updateChapters(
    input: {ids: $ids, patch: {isBookmarked: $isBookmarked, isRead: $isRead, lastPageRead: $lastPageRead}}
  ) {
    clientMutationId
  }
}
    `;
export const FetchChaptersMigrationDoc = gql`
    mutation fetchChaptersMigration($id: Int!) {
  fetchChapters(input: {mangaId: $id}) {
    chapters {
      id
      chapterNumber
    }
  }
}
    `;
export const CreateBackupDoc = gql`
    mutation createBackup {
  createBackup {
    url
  }
}
    `;
export const RestoreBackupDoc = gql`
    mutation restoreBackup($backup: Upload!) {
  restoreBackup(input: {backup: $backup}) {
    status {
      mangaProgress
      state
      totalManga
    }
    id
  }
}
    `;
export const ClearDownloaderDoc = gql`
    mutation clearDownloader {
  clearDownloader(input: {clientMutationId: ""}) {
    downloadStatus {
      state
    }
  }
}
    `;
export const DequeueChapterDownloadsDoc = gql`
    mutation dequeueChapterDownloads($ids: [Int!]!) {
  dequeueChapterDownloads(input: {ids: $ids}) {
    clientMutationId
  }
}
    `;
export const EnqueueChapterDownloadsDoc = gql`
    mutation enqueueChapterDownloads($ids: [Int!]!) {
  enqueueChapterDownloads(input: {ids: $ids}) {
    clientMutationId
  }
}
    `;
export const ReorderChapterDownloadDoc = gql`
    mutation reorderChapterDownload($chapterId: Int!, $to: Int!) {
  reorderChapterDownload(input: {chapterId: $chapterId, to: $to}) {
    clientMutationId
  }
}
    `;
export const StartDownloaderDoc = gql`
    mutation startDownloader {
  startDownloader(input: {clientMutationId: ""}) {
    downloadStatus {
      state
    }
  }
}
    `;
export const StopDownloaderDoc = gql`
    mutation stopDownloader {
  stopDownloader(input: {clientMutationId: ""}) {
    downloadStatus {
      state
    }
  }
}
    `;
export const DeleteDownloadedChapterDoc = gql`
    mutation deleteDownloadedChapter($id: Int!) {
  deleteDownloadedChapter(input: {id: $id}) {
    chapters {
      ...ChapterTypeFragment
    }
  }
}
    ${ChapterTypeFragmentFragmentDoc}`;
export const DeleteDownloadedChaptersDoc = gql`
    mutation deleteDownloadedChapters($ids: [Int!]!) {
  deleteDownloadedChapters(input: {ids: $ids}) {
    chapters {
      ...ChapterTypeFragment
    }
  }
}
    ${ChapterTypeFragmentFragmentDoc}`;
export const CategoriesDoc = gql`
    query categories($notEqualTo: Int = null) {
  categories(filter: {id: {notEqualTo: $notEqualTo}}) {
    nodes {
      id
      default
      order
      name
      mangas {
        totalCount
      }
    }
  }
}
    `;
export const CategoryDoc = gql`
    query category($id: Int!) {
  category(id: $id) {
    mangas {
      nodes {
        id
        title
        inLibrary
        thumbnailUrl
        unreadCount
        downloadCount
        lastReadChapter {
          lastReadAt
        }
        chapters {
          totalCount
        }
      }
    }
  }
}
    `;
export const GetMangaDoc = gql`
    query getManga($id: Int!) {
  manga(id: $id) {
    ...MangaTypeFragment
    chapters {
      totalCount
      nodes {
        ...ChapterTypeFragment
      }
    }
  }
}
    ${MangaTypeFragmentFragmentDoc}
${ChapterTypeFragmentFragmentDoc}`;
export const GetSingleChapterDoc = gql`
    query getSingleChapter($id: Int!) {
  chapter(id: $id) {
    ...ChapterTypeFragment
  }
}
    ${ChapterTypeFragmentFragmentDoc}`;
export const ExtensionsDoc = gql`
    query extensions($isNsfw: Boolean = null) {
  extensions(condition: {isNsfw: $isNsfw}) {
    nodes {
      ...ExtensionTypeFragment
    }
  }
}
    ${ExtensionTypeFragmentFragmentDoc}`;
export const SourcesDoc = gql`
    query sources($isNsfw: Boolean = null) {
  sources(condition: {isNsfw: $isNsfw}) {
    nodes {
      ...SourceTypeFragment
      isNsfw
      extension {
        pkgName
      }
    }
  }
}
    ${SourceTypeFragmentFragmentDoc}`;
export const SourcesMigrationDoc = gql`
    query sourcesMigration {
  sources {
    nodes {
      ...SourceTypeFragment
    }
  }
  mangas(condition: {inLibrary: true}) {
    totalCount
    nodes {
      sourceId
    }
  }
}
    ${SourceTypeFragmentFragmentDoc}`;
export const SourceMigrationMangaDoc = gql`
    query sourceMigrationManga($sourceId: LongString!) {
  mangas(condition: {inLibrary: true, sourceId: $sourceId}) {
    nodes {
      id
      title
      thumbnailUrl
    }
  }
}
    `;
export const SourceMigrationsourceDoc = gql`
    query sourceMigrationsource($sourceId: LongString!) {
  source(id: $sourceId) {
    displayName
  }
}
    `;
export const MangaTitleMigrationDoc = gql`
    query MangaTitleMigration($id: Int!) {
  manga(id: $id) {
    title
  }
}
    `;
export const InfoForMigrationDoc = gql`
    query InfoForMigration($id: Int!) {
  manga(id: $id) {
    chapters {
      nodes {
        id
        isRead
        isBookmarked
        chapterNumber
      }
    }
    categories {
      nodes {
        id
      }
    }
  }
}
    `;
export const MetasDoc = gql`
    query metas {
  metas {
    nodes {
      value
      key
    }
  }
}
    `;
export const UpdatesDoc = gql`
    query updates($offset: Int = 0) {
  chapters(
    orderBy: FETCHED_AT
    offset: $offset
    first: 100
    orderByType: DESC
    filter: {inLibrary: {equalTo: true}}
  ) {
    nodes {
      id
      name
      fetchedAt
      isBookmarked
      isDownloaded
      isRead
      manga {
        id
        title
        thumbnailUrl
      }
    }
    pageInfo {
      hasNextPage
    }
  }
}
    `;
export const ChaptersDoc = gql`
    query chapters($id: Int!) {
  manga(id: $id) {
    id
    title
    meta {
      value
      key
    }
    chapters {
      nodes {
        id
        name
        pageCount
        lastPageRead
        sourceOrder
      }
    }
  }
}
    `;
export const SourceDoc = gql`
    query source($id: LongString!) {
  source(id: $id) {
    displayName
    id
    lang
    name
    supportsLatest
    isConfigurable
    preferences {
      ... on CheckBoxPreference {
        CheckBoxCheckBoxCurrentValue: currentValue
        summary
        CheckBoxDefault: default
        key
        CheckBoxTitle: title
      }
      ... on EditTextPreference {
        EditTextCurrentValue: currentValue
        EditTextDefault: default
        EditTextTitle: title
        text
        summary
        key
        dialogTitle
        dialogMessage
      }
      ... on SwitchPreference {
        SwitchCurrentValue: currentValue
        summary
        key
        SwitchDefault: default
        SwitchTitle: title
      }
      ... on MultiSelectListPreference {
        dialogMessage
        dialogTitle
        MultiSelectListTitle: title
        summary
        key
        entryValues
        entries
        MultiSelectListDefault: default
        MultiSelectListCurrentValue: currentValue
      }
      ... on ListPreference {
        ListCurrentValue: currentValue
        ListDefault: default
        ListTitle: title
        summary
        key
        entryValues
        entries
      }
    }
    filters {
      ... on TriStateFilter {
        __typename
        name
        TriStateDefault: default
      }
      ... on CheckBoxFilter {
        __typename
        CheckBoxDefault: default
        name
      }
      ... on TextFilter {
        __typename
        name
        TextDefault: default
      }
      ... on SortFilter {
        __typename
        values
        name
        SortDefault: default {
          ascending
          index
        }
      }
      ... on SeparatorFilter {
        __typename
        name
      }
      ... on SelectFilter {
        __typename
        values
        name
        SelectDefault: default
      }
      ... on HeaderFilter {
        __typename
        name
      }
      ... on GroupFilter {
        __typename
        name
        filters {
          ... on TriStateFilter {
            __typename
            name
            TriStateDefault: default
          }
          ... on CheckBoxFilter {
            __typename
            CheckBoxDefault: default
            name
          }
          ... on TextFilter {
            __typename
            name
            TextDefault: default
          }
          ... on SortFilter {
            __typename
            values
            name
            SortDefault: default {
              ascending
              index
            }
          }
          ... on SeparatorFilter {
            __typename
            name
          }
          ... on SelectFilter {
            __typename
            values
            name
            SelectDefault: default
          }
          ... on HeaderFilter {
            __typename
            name
          }
        }
      }
    }
  }
}
    `;
export const ValidateBackupDoc = gql`
    query validateBackup($backup: Upload!) {
  validateBackup(input: {backup: $backup}) {
    missingSources {
      id
      name
    }
  }
}
    `;
export const ConditionalChaptersOfGivenMangaDoc = gql`
    query ConditionalChaptersOfGivenManga($in: [Int!]!, $isBookmarked: Boolean = null, $isDownloaded: Boolean = null, $isRead: Boolean = null) {
  chapters(
    filter: {mangaId: {in: $in}}
    condition: {isDownloaded: $isDownloaded, isRead: $isRead, isBookmarked: $isBookmarked}
  ) {
    nodes {
      id
    }
  }
}
    `;
export const AboutDoc = gql`
    query about {
  about {
    buildTime
    buildType
    discord
    github
    name
    revision
    version
  }
}
    `;
export const RestoreStatusDoc = gql`
    query restoreStatus($id: String!) {
  restoreStatus(id: $id) {
    mangaProgress
    state
    totalManga
  }
}
    `;
export const DownloadChangedDoc = gql`
    subscription downloadChanged {
  downloadChanged {
    queue {
      chapter {
        name
        id
      }
      manga {
        title
        thumbnailUrl
        id
      }
      progress
      state
      tries
    }
    state
  }
}
    `;
export const DownloadsOnChaptersDoc = gql`
    subscription downloadsOnChapters {
  downloadChanged {
    queue {
      progress
      state
      chapter {
        id
      }
      manga {
        id
      }
    }
    state
  }
}
    `;
export const fetchExtensions = (
            options: Omit<
              MutationOptions<any, FetchExtensionsMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<FetchExtensionsMutation, FetchExtensionsMutationVariables>({
              mutation: FetchExtensionsDoc,
              ...options,
            });
            return m;
          }
export const updateChapters = (
            options: Omit<
              MutationOptions<any, UpdateChaptersMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<UpdateChaptersMutation, UpdateChaptersMutationVariables>({
              mutation: UpdateChaptersDoc,
              ...options,
            });
            return m;
          }
export const updateChapter = (
            options: Omit<
              MutationOptions<any, UpdateChapterMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<UpdateChapterMutation, UpdateChapterMutationVariables>({
              mutation: UpdateChapterDoc,
              ...options,
            });
            return m;
          }
export const updateMangas = (
            options: Omit<
              MutationOptions<any, UpdateMangasMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<UpdateMangasMutation, UpdateMangasMutationVariables>({
              mutation: UpdateMangasDoc,
              ...options,
            });
            return m;
          }
export const setGlobalMeta = (
            options: Omit<
              MutationOptions<any, SetGlobalMetaMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<SetGlobalMetaMutation, SetGlobalMetaMutationVariables>({
              mutation: SetGlobalMetaDoc,
              ...options,
            });
            return m;
          }
export const deleteGlobalMeta = (
            options: Omit<
              MutationOptions<any, DeleteGlobalMetaMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<DeleteGlobalMetaMutation, DeleteGlobalMetaMutationVariables>({
              mutation: DeleteGlobalMetaDoc,
              ...options,
            });
            return m;
          }
export const setMangaMeta = (
            options: Omit<
              MutationOptions<any, SetMangaMetaMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<SetMangaMetaMutation, SetMangaMetaMutationVariables>({
              mutation: SetMangaMetaDoc,
              ...options,
            });
            return m;
          }
export const deleteMangaMeta = (
            options: Omit<
              MutationOptions<any, DeleteMangaMetaMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<DeleteMangaMetaMutation, DeleteMangaMetaMutationVariables>({
              mutation: DeleteMangaMetaDoc,
              ...options,
            });
            return m;
          }
export const fetchMangaInfo = (
            options: Omit<
              MutationOptions<any, FetchMangaInfoMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<FetchMangaInfoMutation, FetchMangaInfoMutationVariables>({
              mutation: FetchMangaInfoDoc,
              ...options,
            });
            return m;
          }
export const fetchMangaChapters = (
            options: Omit<
              MutationOptions<any, FetchMangaChaptersMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<FetchMangaChaptersMutation, FetchMangaChaptersMutationVariables>({
              mutation: FetchMangaChaptersDoc,
              ...options,
            });
            return m;
          }
export const updateExtension = (
            options: Omit<
              MutationOptions<any, UpdateExtensionMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<UpdateExtensionMutation, UpdateExtensionMutationVariables>({
              mutation: UpdateExtensionDoc,
              ...options,
            });
            return m;
          }
export const fetchSourceManga = (
            options: Omit<
              MutationOptions<any, FetchSourceMangaMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<FetchSourceMangaMutation, FetchSourceMangaMutationVariables>({
              mutation: FetchSourceMangaDoc,
              ...options,
            });
            return m;
          }
export const updateSourcePreference = (
            options: Omit<
              MutationOptions<any, UpdateSourcePreferenceMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<UpdateSourcePreferenceMutation, UpdateSourcePreferenceMutationVariables>({
              mutation: UpdateSourcePreferenceDoc,
              ...options,
            });
            return m;
          }
export const updateCategoryOrder = (
            options: Omit<
              MutationOptions<any, UpdateCategoryOrderMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<UpdateCategoryOrderMutation, UpdateCategoryOrderMutationVariables>({
              mutation: UpdateCategoryOrderDoc,
              ...options,
            });
            return m;
          }
export const createCategory = (
            options: Omit<
              MutationOptions<any, CreateCategoryMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<CreateCategoryMutation, CreateCategoryMutationVariables>({
              mutation: CreateCategoryDoc,
              ...options,
            });
            return m;
          }
export const deleteCategory = (
            options: Omit<
              MutationOptions<any, DeleteCategoryMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<DeleteCategoryMutation, DeleteCategoryMutationVariables>({
              mutation: DeleteCategoryDoc,
              ...options,
            });
            return m;
          }
export const updateCategory = (
            options: Omit<
              MutationOptions<any, UpdateCategoryMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<UpdateCategoryMutation, UpdateCategoryMutationVariables>({
              mutation: UpdateCategoryDoc,
              ...options,
            });
            return m;
          }
export const updateMangasCategories = (
            options: Omit<
              MutationOptions<any, UpdateMangasCategoriesMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<UpdateMangasCategoriesMutation, UpdateMangasCategoriesMutationVariables>({
              mutation: UpdateMangasCategoriesDoc,
              ...options,
            });
            return m;
          }
export const updateMangaCategories = (
            options: Omit<
              MutationOptions<any, UpdateMangaCategoriesMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<UpdateMangaCategoriesMutation, UpdateMangaCategoriesMutationVariables>({
              mutation: UpdateMangaCategoriesDoc,
              ...options,
            });
            return m;
          }
export const fetchChapterPages = (
            options: Omit<
              MutationOptions<any, FetchChapterPagesMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<FetchChapterPagesMutation, FetchChapterPagesMutationVariables>({
              mutation: FetchChapterPagesDoc,
              ...options,
            });
            return m;
          }
export const ChaptersMigration = (
            options: Omit<
              MutationOptions<any, ChaptersMigrationMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<ChaptersMigrationMutation, ChaptersMigrationMutationVariables>({
              mutation: ChaptersMigrationDoc,
              ...options,
            });
            return m;
          }
export const fetchChaptersMigration = (
            options: Omit<
              MutationOptions<any, FetchChaptersMigrationMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<FetchChaptersMigrationMutation, FetchChaptersMigrationMutationVariables>({
              mutation: FetchChaptersMigrationDoc,
              ...options,
            });
            return m;
          }
export const createBackup = (
            options: Omit<
              MutationOptions<any, CreateBackupMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<CreateBackupMutation, CreateBackupMutationVariables>({
              mutation: CreateBackupDoc,
              ...options,
            });
            return m;
          }
export const restoreBackup = (
            options: Omit<
              MutationOptions<any, RestoreBackupMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<RestoreBackupMutation, RestoreBackupMutationVariables>({
              mutation: RestoreBackupDoc,
              ...options,
            });
            return m;
          }
export const clearDownloader = (
            options: Omit<
              MutationOptions<any, ClearDownloaderMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<ClearDownloaderMutation, ClearDownloaderMutationVariables>({
              mutation: ClearDownloaderDoc,
              ...options,
            });
            return m;
          }
export const dequeueChapterDownloads = (
            options: Omit<
              MutationOptions<any, DequeueChapterDownloadsMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<DequeueChapterDownloadsMutation, DequeueChapterDownloadsMutationVariables>({
              mutation: DequeueChapterDownloadsDoc,
              ...options,
            });
            return m;
          }
export const enqueueChapterDownloads = (
            options: Omit<
              MutationOptions<any, EnqueueChapterDownloadsMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<EnqueueChapterDownloadsMutation, EnqueueChapterDownloadsMutationVariables>({
              mutation: EnqueueChapterDownloadsDoc,
              ...options,
            });
            return m;
          }
export const reorderChapterDownload = (
            options: Omit<
              MutationOptions<any, ReorderChapterDownloadMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<ReorderChapterDownloadMutation, ReorderChapterDownloadMutationVariables>({
              mutation: ReorderChapterDownloadDoc,
              ...options,
            });
            return m;
          }
export const startDownloader = (
            options: Omit<
              MutationOptions<any, StartDownloaderMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<StartDownloaderMutation, StartDownloaderMutationVariables>({
              mutation: StartDownloaderDoc,
              ...options,
            });
            return m;
          }
export const stopDownloader = (
            options: Omit<
              MutationOptions<any, StopDownloaderMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<StopDownloaderMutation, StopDownloaderMutationVariables>({
              mutation: StopDownloaderDoc,
              ...options,
            });
            return m;
          }
export const deleteDownloadedChapter = (
            options: Omit<
              MutationOptions<any, DeleteDownloadedChapterMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<DeleteDownloadedChapterMutation, DeleteDownloadedChapterMutationVariables>({
              mutation: DeleteDownloadedChapterDoc,
              ...options,
            });
            return m;
          }
export const deleteDownloadedChapters = (
            options: Omit<
              MutationOptions<any, DeleteDownloadedChaptersMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<DeleteDownloadedChaptersMutation, DeleteDownloadedChaptersMutationVariables>({
              mutation: DeleteDownloadedChaptersDoc,
              ...options,
            });
            return m;
          }
export const categories = (
            options: Omit<
              WatchQueryOptions<CategoriesQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<CategoriesQuery> & {
              query: ObservableQuery<
                CategoriesQuery,
                CategoriesQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: CategoriesDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<CategoriesQuery> & {
                query: ObservableQuery<
                  CategoriesQuery,
                  CategoriesQueryVariables
                >;
              }
            >(
              { data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q },
              (set) => {
                q.subscribe((v: any) => {
                  set({ ...v, query: q });
                });
              }
            );
            return result;
          }
        
              export const Asynccategories = (
                options: Omit<
                  QueryOptions<CategoriesQueryVariables>,
                  "query"
                >
              ) => {
                return client.query<CategoriesQuery>({query: CategoriesDoc, ...options})
              }
            
export const category = (
            options: Omit<
              WatchQueryOptions<CategoryQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<CategoryQuery> & {
              query: ObservableQuery<
                CategoryQuery,
                CategoryQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: CategoryDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<CategoryQuery> & {
                query: ObservableQuery<
                  CategoryQuery,
                  CategoryQueryVariables
                >;
              }
            >(
              { data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q },
              (set) => {
                q.subscribe((v: any) => {
                  set({ ...v, query: q });
                });
              }
            );
            return result;
          }
        
              export const Asynccategory = (
                options: Omit<
                  QueryOptions<CategoryQueryVariables>,
                  "query"
                >
              ) => {
                return client.query<CategoryQuery>({query: CategoryDoc, ...options})
              }
            
export const getManga = (
            options: Omit<
              WatchQueryOptions<GetMangaQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<GetMangaQuery> & {
              query: ObservableQuery<
                GetMangaQuery,
                GetMangaQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: GetMangaDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<GetMangaQuery> & {
                query: ObservableQuery<
                  GetMangaQuery,
                  GetMangaQueryVariables
                >;
              }
            >(
              { data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q },
              (set) => {
                q.subscribe((v: any) => {
                  set({ ...v, query: q });
                });
              }
            );
            return result;
          }
        
              export const AsyncgetManga = (
                options: Omit<
                  QueryOptions<GetMangaQueryVariables>,
                  "query"
                >
              ) => {
                return client.query<GetMangaQuery>({query: GetMangaDoc, ...options})
              }
            
export const getSingleChapter = (
            options: Omit<
              WatchQueryOptions<GetSingleChapterQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<GetSingleChapterQuery> & {
              query: ObservableQuery<
                GetSingleChapterQuery,
                GetSingleChapterQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: GetSingleChapterDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<GetSingleChapterQuery> & {
                query: ObservableQuery<
                  GetSingleChapterQuery,
                  GetSingleChapterQueryVariables
                >;
              }
            >(
              { data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q },
              (set) => {
                q.subscribe((v: any) => {
                  set({ ...v, query: q });
                });
              }
            );
            return result;
          }
        
              export const AsyncgetSingleChapter = (
                options: Omit<
                  QueryOptions<GetSingleChapterQueryVariables>,
                  "query"
                >
              ) => {
                return client.query<GetSingleChapterQuery>({query: GetSingleChapterDoc, ...options})
              }
            
export const extensions = (
            options: Omit<
              WatchQueryOptions<ExtensionsQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<ExtensionsQuery> & {
              query: ObservableQuery<
                ExtensionsQuery,
                ExtensionsQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: ExtensionsDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<ExtensionsQuery> & {
                query: ObservableQuery<
                  ExtensionsQuery,
                  ExtensionsQueryVariables
                >;
              }
            >(
              { data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q },
              (set) => {
                q.subscribe((v: any) => {
                  set({ ...v, query: q });
                });
              }
            );
            return result;
          }
        
              export const Asyncextensions = (
                options: Omit<
                  QueryOptions<ExtensionsQueryVariables>,
                  "query"
                >
              ) => {
                return client.query<ExtensionsQuery>({query: ExtensionsDoc, ...options})
              }
            
export const sources = (
            options: Omit<
              WatchQueryOptions<SourcesQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<SourcesQuery> & {
              query: ObservableQuery<
                SourcesQuery,
                SourcesQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: SourcesDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<SourcesQuery> & {
                query: ObservableQuery<
                  SourcesQuery,
                  SourcesQueryVariables
                >;
              }
            >(
              { data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q },
              (set) => {
                q.subscribe((v: any) => {
                  set({ ...v, query: q });
                });
              }
            );
            return result;
          }
        
              export const Asyncsources = (
                options: Omit<
                  QueryOptions<SourcesQueryVariables>,
                  "query"
                >
              ) => {
                return client.query<SourcesQuery>({query: SourcesDoc, ...options})
              }
            
export const sourcesMigration = (
            options: Omit<
              WatchQueryOptions<SourcesMigrationQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<SourcesMigrationQuery> & {
              query: ObservableQuery<
                SourcesMigrationQuery,
                SourcesMigrationQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: SourcesMigrationDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<SourcesMigrationQuery> & {
                query: ObservableQuery<
                  SourcesMigrationQuery,
                  SourcesMigrationQueryVariables
                >;
              }
            >(
              { data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q },
              (set) => {
                q.subscribe((v: any) => {
                  set({ ...v, query: q });
                });
              }
            );
            return result;
          }
        
              export const AsyncsourcesMigration = (
                options: Omit<
                  QueryOptions<SourcesMigrationQueryVariables>,
                  "query"
                >
              ) => {
                return client.query<SourcesMigrationQuery>({query: SourcesMigrationDoc, ...options})
              }
            
export const sourceMigrationManga = (
            options: Omit<
              WatchQueryOptions<SourceMigrationMangaQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<SourceMigrationMangaQuery> & {
              query: ObservableQuery<
                SourceMigrationMangaQuery,
                SourceMigrationMangaQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: SourceMigrationMangaDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<SourceMigrationMangaQuery> & {
                query: ObservableQuery<
                  SourceMigrationMangaQuery,
                  SourceMigrationMangaQueryVariables
                >;
              }
            >(
              { data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q },
              (set) => {
                q.subscribe((v: any) => {
                  set({ ...v, query: q });
                });
              }
            );
            return result;
          }
        
              export const AsyncsourceMigrationManga = (
                options: Omit<
                  QueryOptions<SourceMigrationMangaQueryVariables>,
                  "query"
                >
              ) => {
                return client.query<SourceMigrationMangaQuery>({query: SourceMigrationMangaDoc, ...options})
              }
            
export const sourceMigrationsource = (
            options: Omit<
              WatchQueryOptions<SourceMigrationsourceQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<SourceMigrationsourceQuery> & {
              query: ObservableQuery<
                SourceMigrationsourceQuery,
                SourceMigrationsourceQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: SourceMigrationsourceDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<SourceMigrationsourceQuery> & {
                query: ObservableQuery<
                  SourceMigrationsourceQuery,
                  SourceMigrationsourceQueryVariables
                >;
              }
            >(
              { data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q },
              (set) => {
                q.subscribe((v: any) => {
                  set({ ...v, query: q });
                });
              }
            );
            return result;
          }
        
              export const AsyncsourceMigrationsource = (
                options: Omit<
                  QueryOptions<SourceMigrationsourceQueryVariables>,
                  "query"
                >
              ) => {
                return client.query<SourceMigrationsourceQuery>({query: SourceMigrationsourceDoc, ...options})
              }
            
export const MangaTitleMigration = (
            options: Omit<
              WatchQueryOptions<MangaTitleMigrationQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<MangaTitleMigrationQuery> & {
              query: ObservableQuery<
                MangaTitleMigrationQuery,
                MangaTitleMigrationQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: MangaTitleMigrationDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<MangaTitleMigrationQuery> & {
                query: ObservableQuery<
                  MangaTitleMigrationQuery,
                  MangaTitleMigrationQueryVariables
                >;
              }
            >(
              { data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q },
              (set) => {
                q.subscribe((v: any) => {
                  set({ ...v, query: q });
                });
              }
            );
            return result;
          }
        
              export const AsyncMangaTitleMigration = (
                options: Omit<
                  QueryOptions<MangaTitleMigrationQueryVariables>,
                  "query"
                >
              ) => {
                return client.query<MangaTitleMigrationQuery>({query: MangaTitleMigrationDoc, ...options})
              }
            
export const InfoForMigration = (
            options: Omit<
              WatchQueryOptions<InfoForMigrationQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<InfoForMigrationQuery> & {
              query: ObservableQuery<
                InfoForMigrationQuery,
                InfoForMigrationQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: InfoForMigrationDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<InfoForMigrationQuery> & {
                query: ObservableQuery<
                  InfoForMigrationQuery,
                  InfoForMigrationQueryVariables
                >;
              }
            >(
              { data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q },
              (set) => {
                q.subscribe((v: any) => {
                  set({ ...v, query: q });
                });
              }
            );
            return result;
          }
        
              export const AsyncInfoForMigration = (
                options: Omit<
                  QueryOptions<InfoForMigrationQueryVariables>,
                  "query"
                >
              ) => {
                return client.query<InfoForMigrationQuery>({query: InfoForMigrationDoc, ...options})
              }
            
export const metas = (
            options: Omit<
              WatchQueryOptions<MetasQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<MetasQuery> & {
              query: ObservableQuery<
                MetasQuery,
                MetasQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: MetasDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<MetasQuery> & {
                query: ObservableQuery<
                  MetasQuery,
                  MetasQueryVariables
                >;
              }
            >(
              { data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q },
              (set) => {
                q.subscribe((v: any) => {
                  set({ ...v, query: q });
                });
              }
            );
            return result;
          }
        
              export const Asyncmetas = (
                options: Omit<
                  QueryOptions<MetasQueryVariables>,
                  "query"
                >
              ) => {
                return client.query<MetasQuery>({query: MetasDoc, ...options})
              }
            
export const updates = (
            options: Omit<
              WatchQueryOptions<UpdatesQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<UpdatesQuery> & {
              query: ObservableQuery<
                UpdatesQuery,
                UpdatesQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: UpdatesDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<UpdatesQuery> & {
                query: ObservableQuery<
                  UpdatesQuery,
                  UpdatesQueryVariables
                >;
              }
            >(
              { data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q },
              (set) => {
                q.subscribe((v: any) => {
                  set({ ...v, query: q });
                });
              }
            );
            return result;
          }
        
              export const Asyncupdates = (
                options: Omit<
                  QueryOptions<UpdatesQueryVariables>,
                  "query"
                >
              ) => {
                return client.query<UpdatesQuery>({query: UpdatesDoc, ...options})
              }
            
export const chapters = (
            options: Omit<
              WatchQueryOptions<ChaptersQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<ChaptersQuery> & {
              query: ObservableQuery<
                ChaptersQuery,
                ChaptersQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: ChaptersDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<ChaptersQuery> & {
                query: ObservableQuery<
                  ChaptersQuery,
                  ChaptersQueryVariables
                >;
              }
            >(
              { data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q },
              (set) => {
                q.subscribe((v: any) => {
                  set({ ...v, query: q });
                });
              }
            );
            return result;
          }
        
              export const Asyncchapters = (
                options: Omit<
                  QueryOptions<ChaptersQueryVariables>,
                  "query"
                >
              ) => {
                return client.query<ChaptersQuery>({query: ChaptersDoc, ...options})
              }
            
export const source = (
            options: Omit<
              WatchQueryOptions<SourceQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<SourceQuery> & {
              query: ObservableQuery<
                SourceQuery,
                SourceQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: SourceDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<SourceQuery> & {
                query: ObservableQuery<
                  SourceQuery,
                  SourceQueryVariables
                >;
              }
            >(
              { data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q },
              (set) => {
                q.subscribe((v: any) => {
                  set({ ...v, query: q });
                });
              }
            );
            return result;
          }
        
              export const Asyncsource = (
                options: Omit<
                  QueryOptions<SourceQueryVariables>,
                  "query"
                >
              ) => {
                return client.query<SourceQuery>({query: SourceDoc, ...options})
              }
            
export const validateBackup = (
            options: Omit<
              WatchQueryOptions<ValidateBackupQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<ValidateBackupQuery> & {
              query: ObservableQuery<
                ValidateBackupQuery,
                ValidateBackupQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: ValidateBackupDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<ValidateBackupQuery> & {
                query: ObservableQuery<
                  ValidateBackupQuery,
                  ValidateBackupQueryVariables
                >;
              }
            >(
              { data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q },
              (set) => {
                q.subscribe((v: any) => {
                  set({ ...v, query: q });
                });
              }
            );
            return result;
          }
        
              export const AsyncvalidateBackup = (
                options: Omit<
                  QueryOptions<ValidateBackupQueryVariables>,
                  "query"
                >
              ) => {
                return client.query<ValidateBackupQuery>({query: ValidateBackupDoc, ...options})
              }
            
export const ConditionalChaptersOfGivenManga = (
            options: Omit<
              WatchQueryOptions<ConditionalChaptersOfGivenMangaQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<ConditionalChaptersOfGivenMangaQuery> & {
              query: ObservableQuery<
                ConditionalChaptersOfGivenMangaQuery,
                ConditionalChaptersOfGivenMangaQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: ConditionalChaptersOfGivenMangaDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<ConditionalChaptersOfGivenMangaQuery> & {
                query: ObservableQuery<
                  ConditionalChaptersOfGivenMangaQuery,
                  ConditionalChaptersOfGivenMangaQueryVariables
                >;
              }
            >(
              { data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q },
              (set) => {
                q.subscribe((v: any) => {
                  set({ ...v, query: q });
                });
              }
            );
            return result;
          }
        
              export const AsyncConditionalChaptersOfGivenManga = (
                options: Omit<
                  QueryOptions<ConditionalChaptersOfGivenMangaQueryVariables>,
                  "query"
                >
              ) => {
                return client.query<ConditionalChaptersOfGivenMangaQuery>({query: ConditionalChaptersOfGivenMangaDoc, ...options})
              }
            
export const about = (
            options: Omit<
              WatchQueryOptions<AboutQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<AboutQuery> & {
              query: ObservableQuery<
                AboutQuery,
                AboutQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: AboutDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<AboutQuery> & {
                query: ObservableQuery<
                  AboutQuery,
                  AboutQueryVariables
                >;
              }
            >(
              { data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q },
              (set) => {
                q.subscribe((v: any) => {
                  set({ ...v, query: q });
                });
              }
            );
            return result;
          }
        
              export const Asyncabout = (
                options: Omit<
                  QueryOptions<AboutQueryVariables>,
                  "query"
                >
              ) => {
                return client.query<AboutQuery>({query: AboutDoc, ...options})
              }
            
export const restoreStatus = (
            options: Omit<
              WatchQueryOptions<RestoreStatusQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<RestoreStatusQuery> & {
              query: ObservableQuery<
                RestoreStatusQuery,
                RestoreStatusQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: RestoreStatusDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<RestoreStatusQuery> & {
                query: ObservableQuery<
                  RestoreStatusQuery,
                  RestoreStatusQueryVariables
                >;
              }
            >(
              { data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q },
              (set) => {
                q.subscribe((v: any) => {
                  set({ ...v, query: q });
                });
              }
            );
            return result;
          }
        
              export const AsyncrestoreStatus = (
                options: Omit<
                  QueryOptions<RestoreStatusQueryVariables>,
                  "query"
                >
              ) => {
                return client.query<RestoreStatusQuery>({query: RestoreStatusDoc, ...options})
              }
            
export const downloadChanged = (
            options: Omit<SubscriptionOptions<DownloadChangedSubscriptionVariables>, "query">
          ) => {
            const q = client.subscribe<DownloadChangedSubscription, DownloadChangedSubscriptionVariables>(
              {
                query: DownloadChangedDoc,
                ...options,
              }
            )
            return q;
          }
export const downloadsOnChapters = (
            options: Omit<SubscriptionOptions<DownloadsOnChaptersSubscriptionVariables>, "query">
          ) => {
            const q = client.subscribe<DownloadsOnChaptersSubscription, DownloadsOnChaptersSubscriptionVariables>(
              {
                query: DownloadsOnChaptersDoc,
                ...options,
              }
            )
            return q;
          }