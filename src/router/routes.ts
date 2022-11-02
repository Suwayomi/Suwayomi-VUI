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
      {
        path: '',
        components: {
          default: () => import('src/pages/libraryPage.vue'),
          inBar: () => import('src/components/library/TopBar.vue')
        }
      }
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
      {
        path: '',
        components: {
          default: () => import('src/pages/extensionsPage.vue'),
          inBar: () => import('src/components/extantions/TopBar.vue')
        }
      }
    ]
  },
  {
    path: '/sources',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        components: {
          default: () => import('src/pages/sourcesPage.vue'),
          inBar: () => import('src/components/extantions/TopBar.vue')
        }
      },
      {
        path: ':sourceID/popular/',
        components: {
          default: () => import('src/pages/SourceSearchPage.vue'),
          inBar: () => import('src/components/sourceSearch/SourceTopBar.vue')
        }
      },
      {
        path: ':sourceID/config/',
        components: {
          default: () => import('src/pages/sourceConfigPage.vue')
        }
      }
    ]
  },
  {
    path: '/downloads',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        components: {
          default: () => import('src/pages/downloadsPage.vue'),
          inBar: () => import('src/components/downloads/TopBar.vue')
        }
      }
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
