import Dexie, { type EntityTable } from 'dexie'

import { type IArtifact } from '@zoho-studio/core'

class ArtifactsDexieDb extends Dexie {
    records!: EntityTable<IArtifact, 'id'>

    constructor() {
        super('artifacts-records-storage')

        this.version(1).stores({
            records:
                '&id, parent_id, capability_type, provider_id, display_name, api_name, [provider_id+capability_type]',
        })
    }
}

export const artifactsDexieDB = new ArtifactsDexieDb()
