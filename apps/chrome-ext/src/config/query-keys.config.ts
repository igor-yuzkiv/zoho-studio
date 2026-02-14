import { MaybeRefOrGetter } from 'vue'

export const ArtifactsQueryKeys = {
    all: ['artifacts'] as const,
    byId: (id: MaybeRefOrGetter<string>) => {
        return [...ArtifactsQueryKeys.all, 'by-id', id] as const
    },
    byProviderId: (providerId: MaybeRefOrGetter<string>) => {
        return [...ArtifactsQueryKeys.all, 'by-provider-id', providerId] as const
    },
    byProviderIdAndType: (providerId: MaybeRefOrGetter<string>, capabilityType: MaybeRefOrGetter<string>) => {
        return [...ArtifactsQueryKeys.all, 'by-provider-id-and-type', providerId, capabilityType]
    },
}
