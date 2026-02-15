import { computed, MaybeRefOrGetter, toValue } from 'vue'
import { useArtifactsStorage } from '../composables'
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { CapabilityType, IArtifact } from '@zoho-studio/core'
import { ArtifactsQueryKeys } from '../config.ts'

export function useArtifactByIdQuery<T extends CapabilityType = CapabilityType>(artifactId: MaybeRefOrGetter<string>) {
    const artifactsStorage = useArtifactsStorage()

    const { isPending, data } = useQuery<IArtifact<T> | null>({
        queryKey: ArtifactsQueryKeys.byId(artifactId),
        placeholderData: keepPreviousData,
        queryFn: () => {
            return artifactsStorage.findById<T>(toValue(artifactId))
        },
        enabled: computed(() => !!toValue(artifactId)),
    })

    return {
        isPending,
        data,
    }
}
