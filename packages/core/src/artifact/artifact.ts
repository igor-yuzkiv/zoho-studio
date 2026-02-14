import type { CapabilityType, FieldArtifactPayload, FunctionArtifactPayload, ModuleArtifactPayload, WorkflowArtifactPayload } from '../capability'
import type { ServiceProviderId } from '../provider'
import type { IEntity, Maybe } from '@zoho-studio/utils'

export type ArtifactId = string

export type ArtifactPayloadMap = {
    functions: FunctionArtifactPayload
    workflows: WorkflowArtifactPayload
    modules: ModuleArtifactPayload
    fields: FieldArtifactPayload
}

export interface IArtifact<TCapabilityType extends CapabilityType = CapabilityType, TOrigin extends IEntity = IEntity> extends IEntity {
    id: ArtifactId
    source_id: string
    capability_type: TCapabilityType
    parent_id?: Maybe<ArtifactId>
    provider_id: ServiceProviderId
    display_name: string
    api_name?: Maybe<string>
    payload: ArtifactPayloadMap[TCapabilityType]
    origin: TOrigin
}
