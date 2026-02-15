import { computed, MaybeRefOrGetter, toValue } from 'vue'
import { useArtifactsStorage } from '../composables'
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { CapabilityType, IArtifact } from '@zoho-studio/core'
import { ArtifactsQueryKeys } from '../config.ts'

export function useArtifactsByParentIdQuery<T extends CapabilityType = CapabilityType>(
    parentId: MaybeRefOrGetter<string>
) {
    const artifactsStorage = useArtifactsStorage()

    const { isPending, data } = useQuery<IArtifact<T>[]>({
        queryKey: ArtifactsQueryKeys.byParentId(parentId),
        placeholderData: keepPreviousData,
        queryFn: () => {
            return artifactsStorage.findByParentId<T>(toValue(parentId))
        },
        initialData: [],
        enabled: computed(() => !!toValue(parentId)),
    })

    return {
        isPending,
        data,
    }
}
