import { IArtifact, ServiceProvider } from '@zoho-studio/core'
import { useArtifactsFetcher } from './use.artifacts.fetcher.ts'
import { ref } from 'vue'
import { useCapabilitiesManager } from '../capability'
import { useArtifactsStorage } from './use.artifacts.storage.ts'
import { useConsoleLogger } from '@zoho-studio/utils'

export function useArtifactsSync() {
    const logger = useConsoleLogger('useArtifactsSync')
    const artifactsStorage = useArtifactsStorage()
    const capabilitiesManager = useCapabilitiesManager()
    const fetcher = useArtifactsFetcher()
    const isSyncing = ref(false)

    async function syncAllProviderArtifacts(provider: ServiceProvider) {
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

    async function syncOneProviderArtifact(provider: ServiceProvider, artifact: IArtifact) {
        try {
            isSyncing.value = true

            const capability = capabilitiesManager.findProviderCapability(provider, artifact.capability_type)

            if (!capability) {
                logger.warn(
                    'No capability descriptor found for artifact',
                    artifact.id,
                    'of type',
                    artifact.capability_type
                )
                return
            }

            const fetchedArtifacts = await fetcher.findOneArtifact(provider, capability, artifact)
            if (!fetchedArtifacts) {
                logger.warn('Artifact not found during sync', artifact.id)
                return
            }

            await artifactsStorage.updateById(artifact.id, fetchedArtifacts)
        } finally {
            isSyncing.value = false
        }
    }

    return {
        isSyncing,
        syncAllProviderArtifacts,
        syncOneProviderArtifact,
    }
}
