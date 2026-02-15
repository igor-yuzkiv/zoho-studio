import { MaybeRefOrGetter } from 'vue'

export const ArtifactsQueryKeys = {
    all: ['artifacts'] as const,
    byProviderId: (providerId: MaybeRefOrGetter<string>) => {
        return [...ArtifactsQueryKeys.all, 'provider', providerId] as const
    },
    byProviderIdAndType: (providerId: MaybeRefOrGetter<string>, capabilityType: MaybeRefOrGetter<string>) => {
        return [
            ...ArtifactsQueryKeys.byProviderId(providerId),
            'capability',
            capabilityType,
        ] as const
    },
    byId: (id: MaybeRefOrGetter<string>) => {
        return [...ArtifactsQueryKeys.all, 'by-id', id] as const
    },
    byParentId: (parentId: MaybeRefOrGetter<string>) => {
        return [...ArtifactsQueryKeys.all, 'by-parent-id', parentId] as const
    },
}

export const PROVIDER_CACHE_TTL_MS = 2 * 60 * 60 * 1000 // 2 hours
