import { MaybeRef, ComputedRef, computed, toValue, ref } from 'vue'
import type { Maybe } from '@zoho-studio/shared-types'
import type { IArtifact } from '@zoho-studio/core'
import type { ArtifactDetailViewConfig, UiCapabilityDescriptor, ViewModeOption } from '@zoho-studio/ui-kit'
import { artifactDetailConfigMap } from './artifacts-default-details-views.config.ts'

type MaybeRefOrGetter<T> = MaybeRef<T> | ComputedRef<T>

export function useArtifactDetailView(capabilityDescriptor: MaybeRefOrGetter<Maybe<UiCapabilityDescriptor>>) {
    const currentViewMode = ref<string>('')

    const viewConfig = computed((): ArtifactDetailViewConfig | undefined => {
        const descriptor = toValue(capabilityDescriptor)
        if (!descriptor) {
            return
        }

        const defaultConfig = artifactDetailConfigMap[descriptor.type]
        const artifactConfig = descriptor?.artifactDetailViewSettings

        if (!defaultConfig && !artifactConfig) {
            console.warn(`No artifact detail view config found for capability type: ${descriptor.type}`)
            return undefined
        }

        if (!defaultConfig) {
            return {
                header: {
                    title: artifactConfig?.header?.title ?? ((artifact: IArtifact) => artifact.display_name),
                    subtitle: artifactConfig?.header?.subtitle ?? '',
                },
                viewModes: artifactConfig?.viewModes ?? [],
            }
        }

        if (!artifactConfig) {
            return defaultConfig
        }

        return {
            header: {
                title: artifactConfig.header?.title ?? defaultConfig?.header.title ?? '',
                subtitle: artifactConfig.header?.subtitle ?? defaultConfig?.header.subtitle ?? '',
            },
            viewModes: defaultConfig.viewModes.concat(artifactConfig.viewModes ?? []),
        }
    })

    const viewModes = computed<ViewModeOption[]>(() => viewConfig.value?.viewModes ?? [])

    return {
        viewConfig,
        viewModes,
        currentViewMode,
    }
}
