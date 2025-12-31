import { IArtifact } from '@zoho-studio/core'

export interface IArtifactsStorage {
    bulkUpsert(artifacts: IArtifact[]): Promise<boolean>
}

export const ArtifactStorageToken = Symbol('IArtifactStorage')
