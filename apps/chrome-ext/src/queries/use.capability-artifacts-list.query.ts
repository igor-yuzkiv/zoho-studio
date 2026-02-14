import {
    ArtifactStorageToken,
    CapabilityType,
    IArtifact,
    IArtifactsStorage,
    ServiceProviderId,
} from '@zoho-studio/core'
import { computed, MaybeRef, toValue } from 'vue'
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { container } from 'tsyringe'
import { ArtifactsQueryKeys } from '../config/query-keys.config.ts'

const artifactsStorage = container.resolve<IArtifactsStorage>(ArtifactStorageToken)

export function useCapabilityArtifactsListQuery<T extends CapabilityType = CapabilityType>(
    providerId: MaybeRef<ServiceProviderId>,
    capabilityType: MaybeRef<T>
) {
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
