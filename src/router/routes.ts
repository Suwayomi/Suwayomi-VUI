import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/library'
  },
  {
    path: '/library',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/libraryPage.vue') }
    ]
  },
  {
    path: '/updates',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/updatesPage.vue') }
    ]
  },
  {
    path: '/extensions',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/extensionsPage.vue') }
    ]
  },
  {
    path: '/sources',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/sourcesPage.vue') }
    ]
  },
  {
    path: '/downloads',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/downloadsPage.vue') }
    ]
  },
  {
    path: '/settings',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/settingsPage.vue') }
    ]
  },
  {
    path: '/manga/:mangaID',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/mangaPage.vue') }]
  },
  {
    path: '/manga/:mangaID/chapter/:chapterID',
    component: () => import('layouts/ChapterLayout.vue'),
    children: [
      {
        name: 'chapterpage',
        path: '',
        component: () => import('src/pages/chapterPage.vue')
      }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

export default routes;
