import { MaybeRef, ComputedRef, computed, toValue, ref } from 'vue'
import { Maybe } from '@zoho-studio/utils'
import { ArtifactDetailViewConfig, CapabilityDescriptor, type IArtifact } from '@zoho-studio/core'
import { artifactDetailConfigMap } from './artifacts-default-details-views.config.ts'
import type { ViewModeOption } from '@zoho-studio/ui-kit'

type MaybeRefOrGetter<T> = MaybeRef<T> | ComputedRef<T>

export function useArtifactDetailView(capabilityDescriptor: MaybeRefOrGetter<Maybe<CapabilityDescriptor>>) {
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
