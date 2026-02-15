import { ServiceProvider } from '@zoho-studio/core'
import { useArtifactsFetcher } from './use.artifacts.fetcher.ts'
import { ref } from 'vue'
import { useCapabilitiesManager } from './use.capabilities.manager.ts'
import { useArtifactsStorage } from './use.artifacts.storage.ts'

export function useArtifactsSync() {
    const artifactsStorage = useArtifactsStorage()
    const capabilitiesManager = useCapabilitiesManager()
    const fetcher = useArtifactsFetcher()
    const isSyncing = ref(false)

    async function syncProviderArtifacts(provider: ServiceProvider) {
        try {
            isSyncing.value = true

            const providerCapabilities = capabilitiesManager.getProviderCapabilities(provider)
            const { independent, dependent } = capabilitiesManager.splitCapabilitiesByDependency(providerCapabilities)

            const phase1Artifacts = await fetcher.fetchProviderArtifacts(provider, independent)
            await artifactsStorage.bulkUpsert(phase1Artifacts)

            if (dependent.length > 0) {
                const phase2Artifacts = await fetcher.fetchProviderArtifacts(provider, dependent)
                await artifactsStorage.bulkUpsert(phase2Artifacts)
            }
        } finally {
            isSyncing.value = false
        }
    }

    return {
        isSyncing,
        syncProviderArtifacts,
    }
}
