import { container } from 'tsyringe'
import { ArtifactStorageToken, IArtifactsStorage, ServiceProvider } from '@zoho-studio/core'
import { useArtifactsFetcher } from './use.artifacts.fetcher.ts'
import { ref } from 'vue'
import { useCapabilitiesManager } from './use.capabilities.manager.ts'

const artifactsStorage = container.resolve<IArtifactsStorage>(ArtifactStorageToken)

export function useArtifactsSync() {
    const capabilities = useCapabilitiesManager()
    const fetcher = useArtifactsFetcher()
    const isSyncing = ref(false)

    async function syncProviderArtifacts(provider: ServiceProvider) {
        try {
            const artifacts = await fetcher.fetchProviderArtifacts(
                provider,
                capabilities.getProviderCapabilities(provider)
            )

            await artifactsStorage.bulkUpsert(artifacts)
        } catch (error) {
            console.error(error)
        } finally {
            isSyncing.value = false
        }
    }

    return {
        isSyncing,
        syncProviderArtifacts,
    }
}
