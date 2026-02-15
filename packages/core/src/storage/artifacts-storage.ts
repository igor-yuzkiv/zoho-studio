import { IArtifact } from '../artifact'
import type { CapabilityType } from '../capability'

export interface IArtifactsStorage {
    bulkUpsert(artifacts: IArtifact[]): Promise<boolean>

    findById<T extends CapabilityType = CapabilityType>(id: string): Promise<IArtifact<T> | null>

    findByProviderId<T extends CapabilityType = CapabilityType>(providerId: string): Promise<IArtifact<T>[]>

    findByParentId<T extends CapabilityType = CapabilityType>(parentId: string): Promise<IArtifact<T>[]>

    findByProviderIdAndCapabilityType<T extends CapabilityType = CapabilityType>(
        providerId: string,
        capabilityType: string
    ): Promise<IArtifact<T>[]>

    countByProviderId(providerId: string): Promise<number>

    deleteByProviderId(providerId: string): Promise<number>
}

export const ArtifactStorageToken = Symbol('IArtifactStorage')
