<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { useArtifactByIdQuery, useArtifactsByParentIdQuery } from '../../../queries'
import { defineAsyncComponent } from 'vue'
import { IconButton, NoDataMessage, PageHeader, useViewModeSelect, ViewModeSelect } from '@zoho-studio/ui-kit'
import { useClipboard } from '@vueuse/core'

const artifactId = useRouteParams<string>('artifactId')
const { data: moduleDetails } = useArtifactByIdQuery<'modules'>(artifactId)
const { data: fields } = useArtifactsByParentIdQuery<'fields'>(artifactId)

const { copy } = useClipboard()

const viewMode = useViewModeSelect(
    [
        {
            value: 'table',
            icon: 'material-symbols:table-sharp',
            component: defineAsyncComponent(() => import('../../../components/module-detail-view/ModuleTableView.vue')),
        },
        {
            value: 'json metadata',
            icon: 'si:json-duotone',
            component: defineAsyncComponent(
                () => import('../../../components/module-detail-view/ModuleMetadataJsonView.vue')
            ),
        },
    ],
    'table'
)
</script>

<template>
    <div v-if="moduleDetails" class="flex h-full w-full flex-col gap-1 overflow-hidden">
        <PageHeader>
            <template #title>
                <div v-if="moduleDetails.api_name" class="flex items-center gap-x-2">
                    <IconButton text icon="si:copy-fill" severity="secondary" @click="copy(moduleDetails.api_name)" />
                    <span>{{ moduleDetails.display_name }}</span>
                </div>

                <span v-else>{{ moduleDetails.display_name }}</span>
            </template>

            <template #actions>
                <ViewModeSelect :options="viewMode.options" v-model="viewMode.current.value" />
            </template>
        </PageHeader>

        <div class="app-card flex h-full w-full flex-col overflow-auto">
            <component :is="viewMode.currentComponent.value" :module="moduleDetails" :fields="fields ?? []" />
        </div>
    </div>

    <NoDataMessage
        v-else
        class="app-card h-full w-full"
        title="Module Not Selected"
        message="Please select a module to view its details."
    />
</template>
