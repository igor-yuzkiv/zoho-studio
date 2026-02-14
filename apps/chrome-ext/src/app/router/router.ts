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
            component: () => import('../../pages/workspace/index/WorkspaceIndexPage.vue'),
        },
    ],
})
