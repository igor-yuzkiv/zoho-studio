import { IArtifact } from '../artifact'

export interface IArtifactsStorage {
    bulkUpsert(artifacts: IArtifact[]): Promise<boolean>
}

export const ArtifactStorageToken = Symbol('IArtifactStorage')
