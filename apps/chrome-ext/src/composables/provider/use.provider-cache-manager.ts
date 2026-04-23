import { ServiceProvider } from '@zoho-studio/core'
import { useConsoleLogger } from '@zoho-studio/utils'
import { useArtifactsSync, useArtifactsStorage } from '../artifact'
import { useProvidersRuntimeStore } from '../../store'
import { useQueryClient } from '@tanstack/vue-query'
import { ArtifactsQueryKeys, PROVIDER_CACHE_TTL_MS } from '../../config.ts'
import { useCapabilitiesManager } from '../capability'

export function useProviderCacheManager() {
    const logger = useConsoleLogger('useProviderCacheManager')
    const artifactsStorage = useArtifactsStorage()
    const { syncAllProviderArtifacts } = useArtifactsSync()
    const providersStore = useProvidersRuntimeStore()
    const queryClient = useQueryClient()
    const capabilitiesManager = useCapabilitiesManager()

    function isCacheStale(provider: ServiceProvider) {
        if (!provider.lastSyncedAt) return true

        const ttl = provider.cacheTtlInMs || PROVIDER_CACHE_TTL_MS

        return Date.now() - provider.lastSyncedAt > ttl
    }

    async function isSyncRequired(provider: ServiceProvider) {
        const statefulCapabilities = capabilitiesManager.getStatefulProviderCapabilities(provider)
        const statelessCapabilities = capabilitiesManager.getStatelessProviderCapabilities(provider)
        const cacheStale = isCacheStale(provider)

        const [statefulArtifactsCount, statelessArtifactsCount] = await Promise.all([
            artifactsStorage.countByProviderIdAndCapabilityTypes(
                provider.id,
                statefulCapabilities.map((capability) => capability.type)
            ),
            artifactsStorage.countByProviderIdAndCapabilityTypes(
                provider.id,
                statelessCapabilities.map((capability) => capability.type)
            ),
        ])

        if (statelessArtifactsCount > 0) {
            return true
        }

        if (!statefulCapabilities.length) {
            return false
        }

        return statefulArtifactsCount <= 0 || cacheStale
    }

    async function invalidateProviderQueries(providerId: string) {
        await queryClient
            .invalidateQueries({ queryKey: ArtifactsQueryKeys.byProviderId(providerId) })
            .catch((error) => logger.error('Failed to invalidate capability queries for provider', providerId, error))
    }

    async function ensureSyncArtifacts(provider: ServiceProvider): Promise<void> {
        if (providersStore.isProviderCacheInProgress(provider.id)) {
            logger.warn('Cache operation is already in progress for provider', provider.id, ', skipping sync request.')
            return
        }

        if (!providersStore.isOnline(provider.id)) {
            logger.warn('Provider', provider.id, 'is currently offline, skipping sync.')
            return
        }

        const isRequired = await isSyncRequired(provider)

        if (!isRequired) {
            logger.info('Cache is fresh for provider', provider.id, ', skipping sync.')
            return
        }

        try {
            providersStore.toggleProviderCacheInProgress(provider.id, true)

            await syncAllProviderArtifacts(provider)
            await invalidateProviderQueries(provider.id)
            await providersStore.updateProviderLastSyncedAt(provider.id, Date.now())
        } finally {
            providersStore.toggleProviderCacheInProgress(provider.id, false)
        }
    }

    async function refreshProviderCache(provider: ServiceProvider, force = false): Promise<void> {
        if (providersStore.isProviderCacheInProgress(provider.id)) {
            logger.warn(
                'Cache operation is already in progress for provider',
                provider.id,
                ', skipping refresh request.'
            )
            return
        }

        try {
            providersStore.toggleProviderCacheInProgress(provider.id, true)

            if (force) {
                await Promise.all([
                    artifactsStorage.deleteByProviderId(provider.id),
                    invalidateProviderQueries(provider.id),
                ])
            }

            await syncAllProviderArtifacts(provider)
            await invalidateProviderQueries(provider.id)

            await providersStore.updateProviderLastSyncedAt(provider.id, Date.now())
        } finally {
            providersStore.toggleProviderCacheInProgress(provider.id, false)
        }
    }

    return {
        ensureSyncArtifacts,
        refreshProviderCache,
    }
}
