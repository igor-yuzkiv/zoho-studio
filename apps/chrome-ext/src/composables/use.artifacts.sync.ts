import { ServiceProvider } from '@zoho-studio/core'
import { useArtifactsFetcher } from './use.artifacts.fetcher.ts'
import { ref } from 'vue'
import { useCapabilitiesManager } from './use.capabilities.manager.ts'
import { useArtifactsStorage } from './use.artifacts.storage.ts'

export function useArtifactsSync() {
    const artifactsStorage = useArtifactsStorage();
    const capabilities = useCapabilitiesManager()
    const fetcher = useArtifactsFetcher()
    const isSyncing = ref(false)

    async function syncProviderArtifacts(provider: ServiceProvider) {
        try {
            isSyncing.value = true

            const artifacts = await fetcher.fetchProviderArtifacts(
                provider,
                capabilities.getProviderCapabilities(provider)
            )

            await artifactsStorage.bulkUpsert(artifacts)
        } finally {
            isSyncing.value = false
        }
    }

    return {
        isSyncing,
        syncProviderArtifacts,
    }
}
