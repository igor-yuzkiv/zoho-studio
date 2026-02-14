import { integrationsRegistry } from '../integrations.registry.ts'
import { type Serializer, useStorage } from '@vueuse/core'
import type { BrowserTab, ServiceProvider, ServiceProviderId } from '@zoho-studio/core'
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

    function resolveFromBrowserTabs(browserTabs: Array<BrowserTab>) {
        const next = new Map<ServiceProviderId, ServiceProvider>()
        for (const [id, provider] of providersMap.value.entries()) {
            next.set(id, { ...provider, browserTabId: undefined })
        }

        for (const manifest of integrationsRegistry.list()) {
            for (const tab of browserTabs) {
                const instance = manifest.resolveFromBrowserTab(tab)
                if (!instance.ok) continue

                next.set(instance.value.id, instance.value)
            }
        }

        providersMap.value = next
        cachedProviders.value = Array.from(next.values())
    }

    return {
        providersMap,
        providersList,
        initialize,
        resolveFromBrowserTabs,
    }
})
