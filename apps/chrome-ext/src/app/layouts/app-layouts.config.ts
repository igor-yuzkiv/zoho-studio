import { defineAsyncComponent } from 'vue'

export const AppLayout = {
    default: 'default',
    workspace: 'workspace',
} as const

export type AppLayoutName = (typeof AppLayout)[keyof typeof AppLayout]

export const AppLayoutComponentMap: Record<AppLayoutName, ReturnType<typeof defineAsyncComponent>> = {
    [AppLayout.default]: defineAsyncComponent(() => import('./default/DefaultLayout.vue')),
    [AppLayout.workspace]: defineAsyncComponent(() => import('./workspace/WorkspaceLayout.vue')),
}
