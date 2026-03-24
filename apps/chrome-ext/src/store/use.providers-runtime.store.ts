import { integrationsRegistry } from '../integrations.registry.ts'
import { type Serializer, useStorage } from '@vueuse/core'
import { BrowserTab, BrowserTabId, ServiceProvider, ServiceProviderId, UpdateProviderDto } from '@zoho-studio/core'
import { useConsoleLogger } from '@zoho-studio/utils'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const logger = useConsoleLogger('useProvidersRuntimeStore')

const LocalStorageSerializer: Serializer<ServiceProvider[]> = {
    read(raw) {
        try {
            const parsed = JSON.parse(raw || '[]')
            return Array.isArray(parsed) ? parsed : []
        } catch (error) {
            logger.error('Failed to parse service providers from localStorage:', error)
            return []
        }
    },
    write(value) {
        return JSON.stringify(
            value.map((sp) => ({
                ...sp,
                tabId: undefined,
            }))
        )
    },
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
    const cachedProviders = useStorage('service-providers', [], undefined, { serializer: LocalStorageSerializer })

    const providersCacheInProgressMap = ref<Map<ServiceProviderId, boolean>>(new Map())

    function initialize() {
        if (!cachedProviders.value.length) {
            return
        }

        providersMap.value = new Map<ServiceProviderId, ServiceProvider>(
            cachedProviders.value.map((provider) => [provider.id, { ...provider, browserTabId: undefined }])
        )
    }

    async function handleBrowserTabsChange(browserTabs: Map<BrowserTabId, BrowserTab>) {
        const prev = new Map(providersMap.value)
        const next = await resolveFromBrowserTabs(Array.from(browserTabs.values()), prev)

        for (const sp of next.values()) {
            if (sp.browserTabId && !browserTabs.has(sp.browserTabId)) {
                sp.browserTabId = undefined
            }
        }

        providersMap.value = next
        cachedProviders.value = Array.from(next.values())
    }

    function updateProvider(id: ServiceProviderId, data: Partial<UpdateProviderDto>) {
        const existing = providersMap.value.get(id)
        if (!existing) {
            logger.warn(`Trying to update non-existing provider with id "${id}"`)
            return
        }

        const updated = { ...existing, ...data }
        const next = new Map(providersMap.value)
        next.set(id, updated)
        providersMap.value = next
        cachedProviders.value = Array.from(next.values())
    }

    function updateProviderLastSyncedAt(providerId: ServiceProviderId, timestamp: number) {
        updateProvider(providerId, { lastSyncedAt: timestamp })
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
