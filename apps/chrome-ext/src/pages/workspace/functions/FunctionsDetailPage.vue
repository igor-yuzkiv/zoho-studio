<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { useArtifactByIdQuery } from '../../../queries'
import { defineAsyncComponent } from 'vue'
import { NoDataMessage, PageHeader, useViewModeSelect, ViewModeSelect } from '@zoho-studio/ui-kit'

const artifactId = useRouteParams<string>('artifactId')
const { data } = useArtifactByIdQuery<'functions'>(artifactId)

const viewMode = useViewModeSelect(
    [
        {
            value: 'code',
            icon: 'mdi:code',
            component: defineAsyncComponent(
                () => import('../../../components/function-detail-view/FunctionCodeView.vue')
            ),
        },
        {
            value: 'json metadata',
            icon: 'si:json-duotone',
            component: defineAsyncComponent(
                () => import('../../../components/function-detail-view/FunctionMetadataJsonView.vue')
            ),
        },
    ],
    'code'
)
</script>

<template>
    <div v-if="data" class="flex h-full w-full flex-col overflow-hidden gap-1">
        <PageHeader :title="data.display_name">
            <template #description>
                <p class="text-gray-500 text-xs">{{ data.payload.type }}</p>
            </template>

            <template #actions>
                <ViewModeSelect :options="viewMode.options" v-model="viewMode.current.value" />
            </template>
        </PageHeader>

        <div class="flex h-full w-full flex-col overflow-auto app-card">
            <component :is="viewMode.currentComponent.value" :artifact="data" />
        </div>
    </div>

    <NoDataMessage
        v-else
        class="h-full w-full app-card"
        title="Function Not Selected"
        message="Please select a function to view its details."
    />
</template>
