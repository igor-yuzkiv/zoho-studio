import { integrationsRegistry } from '../integrations'
import type { BrowserTab, ServiceProvider, ServiceProviderId } from '@zoho-studio/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useProvidersRuntimeStore = defineStore('providers.runtime', () => {
    const providersMap = ref<Map<ServiceProviderId, ServiceProvider>>(new Map())
    const providersList = computed(() => Array.from(providersMap.value.values()))

    function resolveFromBrowserTabs(browserTabs: Array<BrowserTab>) {
        const nextProvidersMap = new Map(providersMap.value)

        for (const browserTab of browserTabs) {
            for (const manifest of integrationsRegistry.list()) {
                const instance = manifest.resolveFromBrowserTab(browserTab)
                if (instance.ok) {
                    nextProvidersMap.set(instance.value.id, instance.value)
                }
            }
        }

        providersMap.value = nextProvidersMap
    }

    return {
        providersMap,
        providersList,
        resolveFromBrowserTabs,
    }
})
