import { IArtifact, ServiceProviderId } from '@zoho-studio/core'
import { computed, MaybeRef, toValue } from 'vue'
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { ArtifactsQueryKeys } from '../config.ts'
import { useArtifactsStorage } from '../composables'
import { Maybe } from '@zoho-studio/utils'

export function useProviderArtifactsQuery(providerId: MaybeRef<Maybe<ServiceProviderId>>) {
    const artifactsStorage = useArtifactsStorage()
    const { isPending, data } = useQuery<IArtifact[]>({
        queryKey: ArtifactsQueryKeys.byProviderId(providerId as ServiceProviderId),
        placeholderData: keepPreviousData,
        queryFn: () => {
            return artifactsStorage.findByProviderId(toValue(providerId) as ServiceProviderId)
        },
        initialData: [],
        enabled: computed(() => !!toValue(providerId)),
    })

    return {
        isPending,
        data,
    }
}
