import { IArtifact } from '../artifact'
import type { CapabilityType } from '../capability'

export interface IArtifactsStorage {
    bulkUpsert(artifacts: IArtifact[]): Promise<boolean>

    findByProviderIdAndCapabilityType<TCapabilityType extends CapabilityType = CapabilityType>(
        providerId: string,
        capabilityType: string
    ): Promise<IArtifact<TCapabilityType>[]>

    countByProviderId(providerId: string): Promise<number>

    deleteByProviderId(providerId: string): Promise<number>
}

export const ArtifactStorageToken = Symbol('IArtifactStorage')
