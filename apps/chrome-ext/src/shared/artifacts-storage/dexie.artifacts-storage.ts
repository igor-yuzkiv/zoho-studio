import type { IArtifact, IArtifactsStorage } from '@zoho-studio/core'
import { artifactsDexieDB } from './artifacts.dexie-db.ts'

export class DexieArtifactsStorage implements IArtifactsStorage {
    async bulkUpsert(artifacts: IArtifact[]): Promise<boolean> {
        artifactsDexieDB.records.bulkPut(artifacts)

        return true
    }
}
