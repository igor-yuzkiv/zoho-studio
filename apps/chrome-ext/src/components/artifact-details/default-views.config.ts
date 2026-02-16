import type { IArtifact, CapabilityType, ArtifactDetailViewConfig } from '@zoho-studio/core'
import { defineAsyncComponent } from 'vue'

export const artifactDetailConfigMap: Partial<Record<CapabilityType, ArtifactDetailViewConfig>> = {
    functions: {
        header: {
            title: (a) => a.display_name,
            subtitle: (a) => (a as IArtifact<'functions'>).payload.type,
        },
        viewModes: [
            {
                value: 'code',
                icon: 'mdi:code',
                component: defineAsyncComponent(
                    () => import('./ui/defaults/function/FunctionCodeView.vue')
                ),
            },
            {
                value: 'json metadata',
                icon: 'si:json-duotone',
                component: defineAsyncComponent(
                    () => import('./ui/defaults/function/FunctionMetadataJsonView.vue')
                ),
            },
        ],
    },
    modules: {
        header: {
            title: (a) => a.display_name,
        },
        viewModes: [
            {
                value: 'table',
                icon: 'material-symbols:table-sharp',
                component: defineAsyncComponent(
                    () => import('./ui/defaults/module/ModuleTableView.vue')
                ),
            },
            {
                value: 'json metadata',
                icon: 'si:json-duotone',
                component: defineAsyncComponent(
                    () => import('./ui/defaults/module/ModuleMetadataJsonView.vue')
                ),
            },
        ],
    },
    workflows: {
        header: {
            title: (a) => a.display_name,
            subtitle: (a) => (a as IArtifact<'workflows'>).payload.module_api_name ?? '',
        },
        viewModes: [
            {
                value: 'json metadata',
                icon: 'si:json-duotone',
                component: defineAsyncComponent(
                    () => import('./ui/defaults/workflow/WorkflowMetadataJsonView.vue')
                ),
            },
        ],
    },
}
