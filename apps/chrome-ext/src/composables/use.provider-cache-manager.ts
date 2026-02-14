import { ServiceProvider, ServiceProviderId } from '@zoho-studio/core'
import { useArtifactsSync } from './use.artifacts.sync.ts'
import { PROVIDER_CACHE_TTL_MS } from '../config/provider-cache.config.ts'
import { useProvidersRuntimeStore } from '../store'
import { useQueryClient } from '@tanstack/vue-query'
import { ArtifactsQueryKeys } from '../config/query-keys.config.ts'
import { ref } from 'vue'
import { useArtifactsStorage } from './use.artifacts.storage.ts'

export function useProviderCacheManager() {
    const artifactsStorage = useArtifactsStorage()
    const { syncProviderArtifacts } = useArtifactsSync()
    const providersStore = useProvidersRuntimeStore()
    const queryClient = useQueryClient()

    const providersInProgress = ref(new Set<ServiceProviderId>())
    const isProviderInProgress = (providerId: ServiceProviderId) => providersInProgress.value.has(providerId)
    const addProviderInProgress = (providerId: ServiceProviderId) => providersInProgress.value.add(providerId)
    const removeProviderInProgress = (providerId: ServiceProviderId) => providersInProgress.value.delete(providerId)

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
            .catch((e) => console.error('Failed to invalidate capability queries for provider', providerId, e))
    }

    async function ensureSyncArtifacts(provider: ServiceProvider): Promise<void> {
        if (isProviderInProgress(provider.id)) {
            console.warn('Cache operation is already in progress for provider', provider.id, ', skipping sync request.')
            return
        }

        const isRequired = await isSyncRequired(provider)
        if (!isRequired) {
            console.info('Cache is fresh for provider', provider.id, ', skipping sync.')
            return
        }

        try {
            addProviderInProgress(provider.id)

            await syncProviderArtifacts(provider)
            await invalidateProviderQueries(provider.id)
            providersStore.updateProviderLastSyncedAt(provider.id, Date.now())
        } finally {
            removeProviderInProgress(provider.id)
        }
    }

    async function clearProviderCache(providerId: string): Promise<void> {
        if (isProviderInProgress(providerId)) {
            console.warn('Cache operation is already in progress for provider', providerId, ', skipping sync request.')
            return
        }

        try {
            addProviderInProgress(providerId)
            await Promise.all([artifactsStorage.deleteByProviderId(providerId), invalidateProviderQueries(providerId)])
        } finally {
            removeProviderInProgress(providerId)
        }
    }

    async function refreshProviderCache(provider: ServiceProvider): Promise<void> {
        if (isProviderInProgress(provider.id)) {
            console.warn(
                'Cache operation is already in progress for provider',
                provider.id,
                ', skipping refresh request.'
            )
            return
        }

        try {
            addProviderInProgress(provider.id)
            await artifactsStorage.deleteByProviderId(provider.id)
            await syncProviderArtifacts(provider)
            await invalidateProviderQueries(provider.id)

            providersStore.updateProviderLastSyncedAt(provider.id, Date.now())
        } finally {
            removeProviderInProgress(provider.id)
        }
    }

    return {
        isProviderInProgress,
        ensureSyncArtifacts,
        clearProviderCache,
        refreshProviderCache,
    }
}
