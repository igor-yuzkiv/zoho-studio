import { useProvidersRuntimeStore } from '../../store'
import { useRouteParams } from '@vueuse/router'
import {
    CapabilityDescriptor,
    CapabilityType,
    type IIntegrationManifest,
    ServiceProvider,
    ServiceProviderId,
} from '@zoho-studio/core'
import type { Maybe } from '@zoho-studio/utils'
import { computed } from 'vue'
import { useCapabilitiesManager } from '../capability'
import { integrationsRegistry } from '../../integrations.registry.ts'
import { format } from 'date-fns'

export function useCurrentProvider() {
    const providersStore = useProvidersRuntimeStore()
    const providerId = useRouteParams<ServiceProviderId>('providerId')
    const capabilities = useCapabilitiesManager()
    const isCachingInProgress = computed<boolean>(() => providersStore.isProviderCacheInProgress(providerId.value))


    const provider = computed<Maybe<ServiceProvider>>(() => {
        if (!providerId.value || !providersStore.providersMap.has(providerId.value)) {
            return
        }

        return providersStore.providersMap.get(providerId.value)
    })

    const providerManifest = computed<Maybe<IIntegrationManifest>>(() => {
        if (!provider.value) {
            return
        }

        return integrationsRegistry.getManifest(provider.value.type)
    })

    const isOnline = computed(() => Boolean(provider.value?.browserTabId))

    const lastSyncedAtFormatted = computed(() => {
        if (!provider.value?.lastSyncedAt) {
            return 'Never'
        }

        return format(new Date(provider.value.lastSyncedAt), 'PPpp')
    })

    const providerCapabilities = computed<CapabilityDescriptor[]>(() => {
        if (!provider.value) {
            return []
        }

        return capabilities.getProviderCapabilities(provider.value)
    })

    function findProviderCapability(capabilityType: CapabilityType): Maybe<CapabilityDescriptor> {
        if (!provider.value) {
            return
        }

        return capabilities.findProviderCapability(provider.value, capabilityType)
    }

    function updateProviderTitle(newTitle: string) {
        if (!provider.value) {
            return
        }

        providersStore.updateProvider(provider.value.id, { title: newTitle })
    }

    return {
        providerId,
        provider,
        providerManifest,
        isCachingInProgress,
        isOnline,
        providerCapabilities,
        findProviderCapability,
        lastSyncedAtFormatted,
        updateProviderTitle,
    }
}
