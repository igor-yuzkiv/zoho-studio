<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { useArtifactByIdQuery } from '../../../queries'
import { useArtifactsSync, useCurrentProvider } from '../../../composables'
import { computed, ref, watch } from 'vue'
import { IconButton, NoDataMessage, PageHeader, ViewModeSelect, ViewModeComponent } from '@zoho-studio/ui-kit'
import type { ViewModeOption } from '@zoho-studio/ui-kit'
import { useClipboard } from '@vueuse/core'
import { artifactDetailConfigMap } from '../../../components/artifact-details/artifacts-default-details-views.config.ts'
import { ArtifactDetailViewConfig, CapabilityType } from '@zoho-studio/core'
import { useConsoleLogger } from '@zoho-studio/utils'
import Button from 'primevue/button'
import { useQueryClient } from '@tanstack/vue-query'
import { ArtifactsQueryKeys } from '../../../config.ts'

const logger = useConsoleLogger('ArtifactDetailPage')
const artifactId = useRouteParams<string>('artifactId')
const capabilityType = useRouteParams<CapabilityType>('capabilityType')

const queryClient = useQueryClient()
const { data, isPending } = useArtifactByIdQuery(artifactId)
const { copy } = useClipboard()
const { findProviderCapability, provider, isOnline } = useCurrentProvider()

const { syncOneProviderArtifact } = useArtifactsSync()

const config = computed((): ArtifactDetailViewConfig | undefined => {
    const descriptor = findProviderCapability(capabilityType.value)
    const defaultConfig = artifactDetailConfigMap[capabilityType.value]

    if (!defaultConfig) {
        logger.warn(`No default artifact detail view config found for capability type: ${capabilityType.value}`)
        return undefined
    }

    if (!descriptor?.artifactDetailViewSettings) {
        return defaultConfig
    }

    const artifactConfig = descriptor.artifactDetailViewSettings

    return {
        header: {
            title: artifactConfig.header?.title ?? defaultConfig?.header.title ?? '',
            subtitle: artifactConfig.header?.subtitle ?? defaultConfig?.header.subtitle ?? '',
        },
        viewModes: defaultConfig.viewModes.concat(artifactConfig.viewModes ?? []),
    }
})

const viewModes = computed<ViewModeOption[]>(() => config.value?.viewModes ?? [])
const currentMode = ref<string>('')

async function refreshArtifact() {
    if (!provider.value || !data.value) return

    await syncOneProviderArtifact(provider.value, data.value)
    await queryClient.invalidateQueries({ queryKey: ArtifactsQueryKeys.all })
}

watch(
    capabilityType,
    () => {
        currentMode.value = viewModes.value[0]?.value ?? ''
    },
    { immediate: true }
)

const resolvedTitle = computed(() => {
    if (!data.value || !config.value) return ''
    const titleConfig = config.value.header.title
    return typeof titleConfig === 'function' ? titleConfig(data.value) : titleConfig
})

const resolvedSubtitle = computed(() => {
    if (!data.value || !config.value?.header.subtitle) return ''
    const subtitleConfig = config.value.header.subtitle
    return typeof subtitleConfig === 'function' ? subtitleConfig(data.value) : subtitleConfig
})
</script>

<template>
    <div v-if="artifactId && data && config" class="flex h-full w-full flex-col gap-1 overflow-hidden">
        <PageHeader :title="resolvedTitle" :description="resolvedSubtitle">
            <template #prepend>
                <IconButton class="p-0" text icon="si:copy-fill" severity="secondary" @click="copy(resolvedTitle)" />
            </template>

            <template #actions>
                <Button :disabled="!isOnline || isPending" text size="small" @click="refreshArtifact"> Refresh </Button>
                <ViewModeSelect v-if="viewModes.length >= 2" :options="viewModes" v-model="currentMode" />
            </template>
        </PageHeader>

        <div class="app-card flex h-full w-full flex-col overflow-auto">
            <ViewModeComponent :options="viewModes" v-model="currentMode" :artifact="data" :provider="provider" />
        </div>
    </div>

    <NoDataMessage
        v-else-if="!artifactId"
        class="app-card h-full w-full"
        title="No Artifact Selected"
        message="Please select an artifact to view its details."
    />
</template>
