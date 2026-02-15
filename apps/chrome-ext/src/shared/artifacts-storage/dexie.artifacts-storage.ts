import type { CapabilityType, IArtifact, IArtifactsStorage } from '@zoho-studio/core'
import { artifactsDexieDB } from './artifacts.dexie-db.ts'

export class DexieArtifactsStorage implements IArtifactsStorage {
    async bulkUpsert(artifacts: IArtifact[]): Promise<boolean> {
        await artifactsDexieDB.records.bulkPut(artifacts)

        return true
    }

    async findById<T extends CapabilityType = CapabilityType>(id: string): Promise<IArtifact<T> | null> {
        const result = await artifactsDexieDB.records.get(id)

        if (!result) {
            return null
        }

        return result as IArtifact<T>
    }

    async findByProviderId<T extends CapabilityType = CapabilityType>(providerId: string): Promise<IArtifact<T>[]> {
        const result = await artifactsDexieDB.records.where('provider_id').equals(providerId).toArray()

        return result as IArtifact<T>[]
    }

    async findByParentId<T extends CapabilityType = CapabilityType>(parentId: string): Promise<IArtifact<T>[]> {
        const result = await artifactsDexieDB.records.where('parent_id').equals(parentId).toArray()

        return result as IArtifact<T>[]
    }

    async findByProviderIdAndCapabilityType<T extends CapabilityType = CapabilityType>(
        providerId: string,
        capabilityType: string
    ): Promise<IArtifact<T>[]> {
        const result = await artifactsDexieDB.records
            .where(['provider_id', 'capability_type'])
            .equals([providerId, capabilityType])
            .toArray()

        return result as IArtifact<T>[]
    }

    async countByProviderId(providerId: string): Promise<number> {
        return artifactsDexieDB.records.where('provider_id').equals(providerId).count()
    }

    async deleteByProviderId(providerId: string): Promise<number> {
        return artifactsDexieDB.records.where('provider_id').equals(providerId).delete()
    }
}
