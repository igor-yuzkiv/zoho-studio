import type { CapabilityType } from '../capability'
import type { ServiceProviderId } from '../provider'
import type { IEntity, Maybe } from '@zoho-studio/utils'

export type ArtifactId = string

export interface IArtifact extends IEntity {
    id: ArtifactId
    source_id: string
    capability_type: CapabilityType
    parent_id?: Maybe<ArtifactId>
    provider_id: ServiceProviderId
    display_name: string
    api_name?: string
}
