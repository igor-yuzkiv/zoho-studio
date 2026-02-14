import type { CapabilityType, IArtifact, IArtifactsStorage } from '@zoho-studio/core'
import { artifactsDexieDB } from './artifacts.dexie-db.ts'

export class DexieArtifactsStorage implements IArtifactsStorage {
    async bulkUpsert(artifacts: IArtifact[]): Promise<boolean> {
        await artifactsDexieDB.records.bulkPut(artifacts)

        return true
    }

    async findByProviderIdAndCapabilityType<TCapabilityType extends CapabilityType = CapabilityType>(
        providerId: string,
        capabilityType: string
    ): Promise<IArtifact<TCapabilityType>[]> {
        const result = await artifactsDexieDB.records
            .where(['provider_id', 'capability_type'])
            .equals([providerId, capabilityType])
            .toArray()

        return result as IArtifact<TCapabilityType>[]
    }

    async countByProviderId(providerId: string): Promise<number> {
        return artifactsDexieDB.records.where('provider_id').equals(providerId).count()
    }

    async deleteByProviderId(providerId: string): Promise<number> {
        return artifactsDexieDB.records.where('provider_id').equals(providerId).delete()
    }
}
