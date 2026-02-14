import type { CapabilityType, IArtifact } from '@zoho-studio/core'

export type ArtifactGroupBy = ((artifact: IArtifact) => string) | string

export type ArtifactGroup<TCapabilityType extends CapabilityType = CapabilityType> = {
    key: string
    title: string
    items: IArtifact<TCapabilityType>[]
}
