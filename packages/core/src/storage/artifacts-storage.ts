import { IArtifact } from '../artifact'
import type { CapabilityType } from '../capability'

export interface IArtifactsStorage {
    bulkUpsert(artifacts: IArtifact[]): Promise<boolean>

    findById(id: string): Promise<IArtifact | null>

    findByParentId(parentId: string): Promise<IArtifact[]>

    findByProviderIdAndCapabilityType<TCapabilityType extends CapabilityType = CapabilityType>(
        providerId: string,
        capabilityType: string
    ): Promise<IArtifact<TCapabilityType>[]>

    countByProviderId(providerId: string): Promise<number>

    deleteByProviderId(providerId: string): Promise<number>
}

export const ArtifactStorageToken = Symbol('IArtifactStorage')
