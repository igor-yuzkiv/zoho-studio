import { container } from 'tsyringe'
import { ArtifactStorageToken, IArtifactsStorage } from '@zoho-studio/core'

export function useArtifactsStorage(): IArtifactsStorage {
    return container.resolve<IArtifactsStorage>(ArtifactStorageToken)
}
