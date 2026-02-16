<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { useArtifactByIdQuery } from '../../../queries'
import { useCurrentProvider } from '../../../composables'
import { computed, ref, watch } from 'vue'
import { IconButton, NoDataMessage, PageHeader, ViewModeSelect, ViewModeComponent } from '@zoho-studio/ui-kit'
import type { ViewModeOption } from '@zoho-studio/ui-kit'
import { useClipboard } from '@vueuse/core'
import { artifactDetailConfigMap } from '../../../components/artifact-details/default-views.config.ts'
import type { CapabilityType } from '@zoho-studio/core'

const artifactId = useRouteParams<string>('artifactId')
const capabilityType = useRouteParams<CapabilityType>('capabilityType')

const { data } = useArtifactByIdQuery(artifactId)
const { copy } = useClipboard()
const { findProviderCapability } = useCurrentProvider()

const config = computed(() => {
    const descriptor = findProviderCapability(capabilityType.value)
    return descriptor?.artifactDetailView ?? artifactDetailConfigMap[capabilityType.value]
})
const viewModes = computed<ViewModeOption[]>(() => config.value?.viewModes ?? [])
const currentMode = ref<string>('')

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
                <IconButton
                    class="p-0"
                    text
                    icon="si:copy-fill"
                    severity="secondary"
                    @click="copy(resolvedTitle)"
                />
            </template>

            <template v-if="viewModes.length >= 2" #actions>
                <ViewModeSelect :options="viewModes" v-model="currentMode" />
            </template>
        </PageHeader>

        <div class="app-card flex h-full w-full flex-col overflow-auto">
            <ViewModeComponent :options="viewModes" v-model="currentMode" :artifact="data" />
        </div>
    </div>

    <NoDataMessage
        v-else-if="!artifactId"
        class="app-card h-full w-full"
        title="No Artifact Selected"
        message="Please select an artifact to view its details."
    />
</template>
