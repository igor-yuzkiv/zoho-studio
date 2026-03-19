import { ServiceProvider } from '@zoho-studio/core'
import { useConsoleLogger } from '@zoho-studio/utils'
import { useArtifactsSync, useArtifactsStorage } from '../artifact'
import { useProvidersRuntimeStore } from '../../store'
import { useQueryClient } from '@tanstack/vue-query'
import { ArtifactsQueryKeys, PROVIDER_CACHE_TTL_MS } from '../../config.ts'

export function useProviderCacheManager() {
    const logger = useConsoleLogger('useProviderCacheManager')
    const artifactsStorage = useArtifactsStorage()
    const { syncAllProviderArtifacts } = useArtifactsSync()
    const providersStore = useProvidersRuntimeStore()
    const queryClient = useQueryClient()

    function isCacheStale(provider: ServiceProvider) {
        if (!provider.lastSyncedAt) return true

        return Date.now() - provider.lastSyncedAt > PROVIDER_CACHE_TTL_MS
    }

    async function isSyncRequired(provider: ServiceProvider) {
        const count = await artifactsStorage.countByProviderId(provider.id)
        const cacheStale = isCacheStale(provider)

        return count <= 0 || cacheStale
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
            providersStore.updateProviderLastSyncedAt(provider.id, Date.now())
        } finally {
            providersStore.toggleProviderCacheInProgress(provider.id, false)
        }
    }

    async function clearProviderCache(providerId: string): Promise<void> {
        if (providersStore.isProviderCacheInProgress(providerId)) {
            logger.warn('Cache operation is already in progress for provider', providerId, ', skipping sync request.')
            return
        }

        try {
            providersStore.toggleProviderCacheInProgress(providerId, true)
            await Promise.all([artifactsStorage.deleteByProviderId(providerId), invalidateProviderQueries(providerId)])
        } finally {
            providersStore.toggleProviderCacheInProgress(providerId, false)
        }
    }

    async function refreshProviderCache(provider: ServiceProvider): Promise<void> {
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
            await artifactsStorage.deleteByProviderId(provider.id)
            await syncAllProviderArtifacts(provider)
            await invalidateProviderQueries(provider.id)

            providersStore.updateProviderLastSyncedAt(provider.id, Date.now())
        } finally {
            providersStore.toggleProviderCacheInProgress(provider.id, false)
        }
    }

    return {
        ensureSyncArtifacts,
        clearProviderCache,
        refreshProviderCache,
    }
}
