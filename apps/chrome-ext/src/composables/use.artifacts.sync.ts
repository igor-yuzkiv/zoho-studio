import { CapabilityDescriptor, ServiceProvider } from '@zoho-studio/core'
import { useArtifactsFetcher } from './use.artifacts.fetcher.ts'
import { ref } from 'vue'
import { useCapabilitiesManager } from './use.capabilities.manager.ts'
import { useArtifactsStorage } from './use.artifacts.storage.ts'

export function useArtifactsSync() {
    const artifactsStorage = useArtifactsStorage()
    const capabilities = useCapabilitiesManager()
    const fetcher = useArtifactsFetcher()
    const isSyncing = ref(false)

    function splitByDependency(caps: CapabilityDescriptor[]): [CapabilityDescriptor[], CapabilityDescriptor[]] {
        const independent: CapabilityDescriptor[] = []
        const dependent: CapabilityDescriptor[] = []

        for (const cap of caps) {
            if (cap.dependsOn) {
                dependent.push(cap)
            } else {
                independent.push(cap)
            }
        }

        return [independent, dependent]
    }

    async function syncProviderArtifacts(provider: ServiceProvider) {
        try {
            isSyncing.value = true

            const providerCapabilities = capabilities.getProviderCapabilities(provider)
            const [independent, dependent] = splitByDependency(providerCapabilities)

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
