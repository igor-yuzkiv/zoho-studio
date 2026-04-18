<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { useArtifactsSync, useCurrentProvider } from '../../../composables'
import { computed, watch } from 'vue'
import { type CapabilityType } from '@zoho-studio/core'
import { useArtifactDetailView, WorkspaceCapabilityIndexView } from '../../../components/workspace'
import { useClipboard } from '@vueuse/core'
import { useQueryClient } from '@tanstack/vue-query'
import { useArtifactByIdQuery } from '../../../queries'
import { Maybe } from '@zoho-studio/utils'
import { ArtifactsQueryKeys } from '../../../config.ts'
import { IconButton, PageHeader, ViewModeComponent, ViewModeSelect } from '@zoho-studio/ui-kit'

const { copy } = useClipboard()
const queryClient = useQueryClient()

const artifactId = useRouteParams<string>('artifactId')
const capabilityType = useRouteParams<CapabilityType>('capabilityType')

const { findProviderCapability, provider } = useCurrentProvider()

const capabilityDescriptor = computed(() => findProviderCapability(capabilityType.value))

const { viewConfig, viewModes, currentViewMode } = useArtifactDetailView(capabilityDescriptor)

const { data: artifactData, isPending } = useArtifactByIdQuery(artifactId)

const { syncOneProviderArtifact } = useArtifactsSync()

const artifactServiceUrl = computed<Maybe<string>>(() => {
    if (!provider.value || !artifactData.value || !capabilityDescriptor.value) {
        return null
    }

    if (typeof capabilityDescriptor.value?.getArtifactServiceUrl !== 'function') {
        return null
    }

    return capabilityDescriptor.value.getArtifactServiceUrl(provider.value, artifactData.value)
})

async function refreshArtifact() {
    if (!provider.value || !artifactData.value) return

    await syncOneProviderArtifact(provider.value, artifactData.value)
    await queryClient.invalidateQueries({ queryKey: ArtifactsQueryKeys.all })
}

const resolvedTitle = computed(() => {
    if (!artifactData.value || !viewConfig.value) return ''
    const titleConfig = viewConfig.value.header.title
    return typeof titleConfig === 'function' ? titleConfig(artifactData.value) : titleConfig
})

const resolvedSubtitle = computed(() => {
    if (!artifactData.value || !viewConfig.value?.header.subtitle) return ''
    const subtitleConfig = viewConfig.value.header.subtitle
    return typeof subtitleConfig === 'function' ? subtitleConfig(artifactData.value) : subtitleConfig
})

watch(
    capabilityType,
    () => {
        currentViewMode.value = viewModes.value[0]?.value ?? ''
    },
    { immediate: true }
)
</script>

<template>
    <div v-if="provider && capabilityDescriptor" class="flex h-full w-full flex-col overflow-hidden">
        <div v-if="artifactData" class="flex h-full w-full flex-col gap-1 overflow-hidden">
            <PageHeader :title="resolvedTitle" :description="resolvedSubtitle">
                <template #prepend>
                    <IconButton
                        class="p-0"
                        text
                        icon="si:copy-fill"
                        severity="secondary"
                        @click="copy(resolvedTitle)"
                    />
                </template>

                <template #actions>
                    <IconButton
                        as="a"
                        icon="majesticons:open"
                        v-if="artifactServiceUrl"
                        :href="artifactServiceUrl"
                        target="_blank"
                        text
                        :title="`Open in ${provider.type}`"
                    />
                    <IconButton
                        icon="prime:sync"
                        :disabled="!provider.browserTabId || isPending"
                        text
                        @click="refreshArtifact"
                        title="Resync artifact data from provider"
                    >
                        Refresh
                    </IconButton>

                    <ViewModeSelect v-if="viewModes.length >= 2" :options="viewModes" v-model="currentViewMode" />
                </template>
            </PageHeader>

            <div class="app-card flex h-full w-full flex-col overflow-auto">
                <ViewModeComponent
                    :options="viewModes"
                    v-model="currentViewMode"
                    :artifact="artifactData"
                    :provider="provider"
                />
            </div>
        </div>

        <WorkspaceCapabilityIndexView v-else :provider="provider" :capability-descriptor="capabilityDescriptor" />
    </div>
</template>
