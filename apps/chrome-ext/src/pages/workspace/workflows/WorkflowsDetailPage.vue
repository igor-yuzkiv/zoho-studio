<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { useArtifactByIdQuery } from '../../../queries'
import { MetadataJsonView, NoDataMessage, PageHeader } from '@zoho-studio/ui-kit'

const artifactId = useRouteParams<string>('artifactId')
const { data } = useArtifactByIdQuery<'workflows'>(artifactId)
</script>

<template>
    <div v-if="data" class="flex h-full w-full flex-col overflow-hidden gap-1">
        <PageHeader :title="data.display_name">
            <template #description>
                <p class="text-gray-500 text-xs">{{ data.payload.module_api_name }}</p>
            </template>
        </PageHeader>

        <div class="flex h-full w-full flex-col overflow-auto app-card">
            <MetadataJsonView :data="data" />
        </div>
    </div>

    <NoDataMessage
        v-else
        class="h-full w-full app-card"
        title="Workflow Not Selected"
        message="Please select a workflow to view its details."
    />
</template>
