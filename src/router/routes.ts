import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/login'
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/LoginPage.vue')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('pages/RegisterPage.vue')
      },
      {
        path: 'index',
        name: 'index',
        component: () => import('pages/IndexPage.vue')
      },
      {
        path: 'explore',
        name: 'explore',
        component: () => import('pages/ExplorePage.vue')
      },
      {
        path: 'upload',
        name: 'upload',
        component: () => import('pages/UploadPage.vue')
      },
      {
        path: 'notification',
        name: 'notification',
        component: () => import('pages/NotificationPage.vue')
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('pages/ProfilePage.vue')
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
