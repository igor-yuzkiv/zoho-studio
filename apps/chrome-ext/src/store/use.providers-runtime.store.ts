import { integrationsRegistry } from '../integrations.registry.ts'
import {
    BrowserTab,
    BrowserTabId,
    type IProvidersStorage,
    ProvidersStorageToken,
    ServiceProvider,
    ServiceProviderId,
    UpdateProviderDto,
} from '@zoho-studio/core'
import { type PaginationParams, useConsoleLogger } from '@zoho-studio/utils'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { container } from 'tsyringe'

const logger = useConsoleLogger('useProvidersRuntimeStore')
const PROVIDERS_LIST_PAGINATION: PaginationParams = {
    page: 1,
    per_page: 100,
}

async function resolveFromBrowserTabs(
    browserTabs: Array<BrowserTab>,
    prev = new Map<ServiceProviderId, ServiceProvider>()
): Promise<Map<ServiceProviderId, ServiceProvider>> {
    const result = new Map<ServiceProviderId, ServiceProvider>(prev)

    for (const manifest of integrationsRegistry.list()) {
        for (const tab of browserTabs) {
            const resolution = await manifest.resolveFromBrowserTab(tab)
            if (!resolution.ok) {
                continue
            }

            const instance = result.get(resolution.value.id) || resolution.value
            instance.browserTabId = tab.id
            result.set(instance.id, instance)
        }
    }

    return result
}

export const useProvidersRuntimeStore = defineStore('providers.runtime', () => {
    const providersMap = ref<Map<ServiceProviderId, ServiceProvider>>(new Map())
    const providersList = computed(() => Array.from(providersMap.value.values()))
    const providersCacheInProgressMap = ref<Map<ServiceProviderId, boolean>>(new Map())
    const providersStorage = container.resolve<IProvidersStorage>(ProvidersStorageToken)

    async function loadStoredProviders(): Promise<ServiceProvider[]> {
        const providers: ServiceProvider[] = []
        let pagination = { ...PROVIDERS_LIST_PAGINATION }

        while (true) {
            const response = await providersStorage.list(pagination)
            providers.push(...response.data)

            if (!response.meta.has_more) {
                return providers
            }

            pagination = { ...pagination, page: pagination.page + 1 }
        }
    }

    async function upsertProvider(provider: ServiceProvider): Promise<void> {
        try {
            await providersStorage.upsert(provider)
        } catch (error) {
            logger.error('Failed to persist provider', provider.id, error)
        }
    }

    async function upsertManyProviders(providers: Iterable<ServiceProvider>): Promise<void> {
        const entries = Array.from(providers)
        const results = await Promise.allSettled(entries.map((provider) => providersStorage.upsert(provider)))

        for (const [index, result] of results.entries()) {
            if (result.status === 'rejected') {
                logger.error('Failed to persist provider', entries[index]?.id, result.reason)
            }
        }
    }

    async function initialize() {
        try {
            const storedProviders = await loadStoredProviders()

            providersMap.value = new Map<ServiceProviderId, ServiceProvider>(
                storedProviders.map((provider) => [provider.id, provider])
            )
        } catch (error) {
            logger.error('Failed to initialize stored providers', error)
        }
    }

    async function handleBrowserTabsChange(browserTabs: Map<BrowserTabId, BrowserTab>) {
        try {
            const prev = new Map<ServiceProviderId, ServiceProvider>(
                Array.from(providersMap.value.entries()).map(([id, provider]) => [
                    id,
                    { ...provider, browserTabId: undefined },
                ])
            )
            const next = await resolveFromBrowserTabs(Array.from(browserTabs.values()), prev)

            providersMap.value = next
            await upsertManyProviders(next.values())
        } catch (error) {
            logger.error('Failed to reconcile providers with browser tabs', error)
        }
    }

    async function updateProvider(id: ServiceProviderId, data: Partial<UpdateProviderDto>) {
        const existing = providersMap.value.get(id)
        if (!existing) {
            logger.warn(`Trying to update non-existing provider with id "${id}"`)
            return
        }

        const updated = { ...existing, ...data }
        const next = new Map(providersMap.value)
        next.set(id, updated)
        providersMap.value = next
        await upsertProvider(updated)
    }

    async function updateProviderLastSyncedAt(providerId: ServiceProviderId, timestamp: number) {
        await updateProvider(providerId, { lastSyncedAt: timestamp })
    }

    function toggleProviderCacheInProgress(providerId: ServiceProviderId, inProgress: boolean) {
        const next = new Map(providersCacheInProgressMap.value)
        next.set(providerId, inProgress)

        providersCacheInProgressMap.value = next
    }

    function isProviderCacheInProgress(providerId: ServiceProviderId): boolean {
        return providersCacheInProgressMap.value.get(providerId) || false
    }

    function isOnline(providerId: ServiceProviderId): boolean {
        const provider = providersMap.value.get(providerId)
        if (!provider) {
            logger.warn(`Trying to check online status of non-existing provider with id "${providerId}"`)
            return false
        }

        return !!provider.browserTabId
    }

    return {
        providersMap,
        providersList,
        providersCacheInProgressMap,
        initialize,
        handleBrowserTabsChange,
        updateProvider,
        updateProviderLastSyncedAt,
        toggleProviderCacheInProgress,
        isProviderCacheInProgress,
        isOnline,
    }
})
