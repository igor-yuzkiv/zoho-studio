import { integrationsRegistry } from '../integrations.registry.ts'
import { type Serializer, useStorage } from '@vueuse/core'
import { BrowserTab, BrowserTabId, ServiceProvider, ServiceProviderId } from '@zoho-studio/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const LocalStorageSerializer: Serializer<ServiceProvider[]> = {
    read(raw) {
        try {
            const parsed = JSON.parse(raw || '[]')
            return Array.isArray(parsed) ? parsed : []
        } catch (error) {
            console.error('Failed to parse service providers from localStorage:', error)
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

function resolveFromBrowserTabs(
    browserTabs: Array<BrowserTab>,
    prev = new Map<ServiceProviderId, ServiceProvider>()
): Map<ServiceProviderId, ServiceProvider> {
    return integrationsRegistry.list().reduce<Map<ServiceProviderId, ServiceProvider>>((acc, manifest) => {
        for (const tab of browserTabs) {
            const result = manifest.resolveFromBrowserTab(tab)
            if (!result.ok) {
                continue
            }

            const instance = prev.get(result.value.id) || result.value

            instance.browserTabId = tab.id
            acc.set(instance.id, instance)
        }

        return acc
    }, prev)
}

export const useProvidersRuntimeStore = defineStore('providers.runtime', () => {
    const providersMap = ref<Map<ServiceProviderId, ServiceProvider>>(new Map())
    const providersList = computed(() => Array.from(providersMap.value.values()))
    const cachedProviders = useStorage('service-providers', [], undefined, { serializer: LocalStorageSerializer })

    function initialize() {
        if (!cachedProviders.value.length) {
            return
        }

        providersMap.value = new Map<ServiceProviderId, ServiceProvider>(
            cachedProviders.value.map((provider) => [provider.id, { ...provider, browserTabId: undefined }])
        )
    }

    function handleBrowserTabsChange(browserTabs: Map<BrowserTabId, BrowserTab>) {
        const prev = new Map(providersMap.value)
        const next = resolveFromBrowserTabs(Array.from(browserTabs.values()), prev)

        for (const sp of next.values()) {
            if (sp.browserTabId && !browserTabs.has(sp.browserTabId)) {
                sp.browserTabId = undefined
            }
        }

        providersMap.value = next
        cachedProviders.value = Array.from(next.values())
    }

    function updateProvider(id: ServiceProviderId, data: Partial<ServiceProvider>) {
        const existing = providersMap.value.get(id)
        if (!existing) {
            console.warn(`Trying to update non-existing provider with id "${id}"`)
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

    return {
        providersMap,
        providersList,
        initialize,
        handleBrowserTabsChange,
        updateProvider,
        updateProviderLastSyncedAt,
    }
})
