import { CapabilityType, IArtifact, ServiceProviderId } from '@zoho-studio/core'
import { computed, MaybeRef, toValue } from 'vue'
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { ArtifactsQueryKeys } from '../config.ts'
import { useArtifactsStorage } from '../composables'

export function useCapabilityArtifactsListQuery<T extends CapabilityType = CapabilityType>(
    providerId: MaybeRef<ServiceProviderId>,
    capabilityType: MaybeRef<T>
) {
    const artifactsStorage = useArtifactsStorage()
    const { isPending, data } = useQuery<IArtifact<T>[]>({
        queryKey: ArtifactsQueryKeys.byProviderIdAndType(providerId, capabilityType),
        placeholderData: keepPreviousData,
        queryFn: () => {
            return artifactsStorage.findByProviderIdAndCapabilityType<T>(toValue(providerId), toValue(capabilityType))
        },
        initialData: [],
        enabled: computed(() => !!toValue(providerId) && !!toValue(capabilityType)),
    })

    return {
        isPending,
        data,
    }
}
