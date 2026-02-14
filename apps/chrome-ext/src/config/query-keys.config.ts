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
}
