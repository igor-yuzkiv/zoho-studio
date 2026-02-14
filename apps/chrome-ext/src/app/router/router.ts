import { AppRouteName } from './app-route-name.ts'
import { createRouter, createWebHashHistory } from 'vue-router'

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
            name: AppRouteName.workspaceIndex,
            path: '/workspace/:providerId',
            meta: { hideSidebarMenu: true, layout: 'workspace' },
            component: () => import('../../pages/workspace/WorkspaceIndexPage.vue'),
        },

        {
            name: AppRouteName.workspaceFunctions,
            path: '/workspace/:providerId/capabilities/functions/:artifactId?',
            meta: { hideSidebarMenu: false, layout: 'workspace' },
            components: {
                default: () => import('../../pages/workspace/functions/FunctionsDetailPage.vue'),
                menu: () => import('../../pages/workspace/functions/FunctionsMenuPage.vue'),
            },
        },

        {
            name: AppRouteName.workspaceWorkflow,
            path: '/workspace/:providerId/capabilities/workflows/:artifactId?',
            meta: { hideSidebarMenu: false, layout: 'workspace' },
            components: {
                default: () => import('../../pages/workspace/workflows/WorkflowsDetailPage.vue'),
                menu: () => import('../../pages/workspace/workflows/WorkflowsMenuPage.vue'),
            },
        },

        {
            name: AppRouteName.workspaceMetadata,
            path: '/workspace/:providerId/capabilities/modules/:artifactId?',
            meta: { hideSidebarMenu: false, layout: 'workspace' },
            components: {
                default: () => import('../../pages/workspace/modules/ModulesDetailPage.vue'),
                menu: () => import('../../pages/workspace/modules/ModulesMenuPage.vue'),
            },
        },

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
