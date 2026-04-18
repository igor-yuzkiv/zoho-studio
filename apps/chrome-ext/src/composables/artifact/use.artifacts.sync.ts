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

    async function purgeStatelessProviderArtifacts(provider: ServiceProvider) {
        const statelessCapabilities = capabilitiesManager.getStatelessProviderCapabilities(provider)

        if (!statelessCapabilities.length) {
            return 0
        }

        return artifactsStorage.deleteByProviderIdAndCapabilityTypes(
            provider.id,
            statelessCapabilities.map((capability) => capability.type)
        )
    }

    async function syncAllProviderArtifacts(provider: ServiceProvider) {
        try {
            isSyncing.value = true

            await purgeStatelessProviderArtifacts(provider)

            const providerCapabilities = capabilitiesManager.getStatefulProviderCapabilities(provider)

            if (!providerCapabilities.length) {
                return
            }

            const { independent, dependent } = capabilitiesManager.splitCapabilitiesByDependency(providerCapabilities)

            const phase1Artifacts = await fetcher.fetchProviderArtifacts(provider, independent)
            if (phase1Artifacts.length) {
                await artifactsStorage.bulkUpsert(phase1Artifacts)
            }

            if (dependent.length > 0) {
                const phase2Artifacts = await fetcher.fetchProviderArtifacts(provider, dependent)
                if (phase2Artifacts.length) {
                    await artifactsStorage.bulkUpsert(phase2Artifacts)
                }
            }
        } finally {
            isSyncing.value = false
        }
    }

    async function syncOneProviderArtifact(provider: ServiceProvider, artifact: IArtifact) {
        try {
            isSyncing.value = true

            await purgeStatelessProviderArtifacts(provider)

            const providerCapabilities = capabilitiesManager.getProviderCapabilities(provider)
            const capability = providerCapabilities.find((cap) => cap.type === artifact.capability_type)

            if (!capability) {
                logger.warn(
                    `No capability descriptor found for artifact ${artifact.id} of type ${artifact.capability_type} skipping sync`
                )
                return
            }

            if (capability.stateless) {
                logger.info(
                    `Capability ${capability.type} is stateless for provider ${provider.id}, skipping artifact sync`
                )
                return
            }

            const childCapabilities = providerCapabilities.filter(
                (cap) => cap.dependsOn === artifact.capability_type && !cap.stateless
            )

            const newArtifact = await fetcher.findOneArtifact(provider, capability, artifact)
            const artifactsToUpsert = newArtifact ? [newArtifact] : []

            if (childCapabilities.length) {
                for (const depCap of childCapabilities) {
                    const dependentArtifacts = await fetcher.fetchArtifactsByParent(provider, depCap, artifact)
                    artifactsToUpsert.push(...dependentArtifacts)
                }
            }

            if (artifactsToUpsert.length) {
                await artifactsStorage.bulkUpsert(artifactsToUpsert)
            }
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
