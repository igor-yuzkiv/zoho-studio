import type { IArtifact, CapabilityType, ArtifactDetailViewConfig } from '@zoho-studio/core'
import { defineAsyncComponent } from 'vue'

export const artifactDetailConfigMap: Partial<Record<CapabilityType | string, ArtifactDetailViewConfig>> = {
    functions: {
        header: {
            title: (a) => a.display_name,
            subtitle: (a) => {
                const { type, display_name } = (a as IArtifact<'functions'>).payload
                return [display_name, type].filter(Boolean).join(' - ')
            },
        },
        viewModes: [
            {
                label: 'Code',
                value: '__default_code',
                icon: 'mdi:code',
                component: defineAsyncComponent(() => import('./ui/defaults/function/FunctionCodeView.vue')),
            },
            {
                label: 'Metadata',
                value: '__default_json_metadata',
                icon: 'si:json-duotone',
                component: defineAsyncComponent(() => import('./ui/defaults/function/FunctionMetadataJsonView.vue')),
            },
        ],
    },
    modules: {
        header: {
            title: (a) => a.api_name ?? a.display_name,
        },
        viewModes: [
            {
                label: 'Table',
                value: '__default_json_table',
                icon: 'material-symbols:table-sharp',
                component: defineAsyncComponent(() => import('./ui/defaults/module/ModuleTableView.vue')),
            },
            {
                label: 'Metadata',
                value: '__default_json_json_metadata',
                icon: 'si:json-duotone',
                component: defineAsyncComponent(() => import('./ui/defaults/module/ModuleMetadataJsonView.vue')),
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
                label: 'Metadata',
                value: '__default_json_metadata',
                icon: 'si:json-duotone',
                component: defineAsyncComponent(() => import('./ui/defaults/workflow/WorkflowMetadataJsonView.vue')),
            },
        ],
    },
    forms: {
        header: {
            title: (a) => a.display_name,
            subtitle: (a) => a.api_name ?? '',
        },
        viewModes: [],
    },
}
