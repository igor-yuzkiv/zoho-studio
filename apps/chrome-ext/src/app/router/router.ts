import { AppRouteName } from './app-route-name.ts'
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { isGitFeatureEnabled } from '../../feature-flags.ts'

const gitRoutes: RouteRecordRaw[] = isGitFeatureEnabled
    ? [
          {
              name: AppRouteName.gitConfig,
              path: '/git/config',
              meta: { hideSidebarMenu: true, layout: 'default' },
              component: () => import('../../pages/git/GitConfigPage.vue'),
          },
      ]
    : []

export const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: AppRouteName.home,
            component: () => import('../../pages/home/HomePage.vue'),
            meta: { hideSidebarMenu: true, layout: 'default' },
        },

        {
            name: AppRouteName.workspaceHome,
            path: '/workspace/:providerId',
            meta: { hideSidebarMenu: true, layout: 'workspace' },
            component: () => import('../../pages/workspace/WorkspaceHomePage.vue'),
        },
        {
            name: AppRouteName.workspaceSettings,
            path: '/workspace/:providerId/settings',
            meta: { hideSidebarMenu: true, layout: 'workspace' },
            component: () => import('../../pages/workspace/WorkspaceSettingsPage.vue'),
        },
        {
            name: AppRouteName.workspaceCapability,
            path: '/workspace/:providerId/capabilities/:capabilityType/:artifactId?',
            meta: { hideSidebarMenu: false, layout: 'workspace' },
            components: {
                default: () => import('../../pages/workspace/capability/CapabilityContentPage.vue'),
                menu: () => import('../../pages/workspace/capability/CapabilitySidebarMenuPage.vue'),
            },
        },

        ...gitRoutes,

        {
            name: AppRouteName.error,
            path: '/error',
            meta: { hideSidebarMenu: true, layout: 'default' },
            component: () => import('../../pages/error/ErrorPage.vue'),
        },

        {
            path: '/:pathMatch(.*)*',
            redirect: { name: AppRouteName.error, query: { code: '404', message: 'Page not found' } },
        },
    ],
})
