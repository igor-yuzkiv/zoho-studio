import type { CapabilityType, IArtifact } from '@zoho-studio/core'

export type ArtifactGroupBy = string | ((artifact: IArtifact) => string) | null

export type ArtifactGroup<TCapabilityType extends CapabilityType = CapabilityType> = {
    key: string
    title: string
    items: IArtifact<TCapabilityType>[]
}
