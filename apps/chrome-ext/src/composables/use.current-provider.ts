import { useProvidersRuntimeStore } from '../store'
import { useRouteParams } from '@vueuse/router'
import { CapabilityDescriptor, CapabilityType, ServiceProvider, ServiceProviderId } from '@zoho-studio/core'
import type { Maybe } from '@zoho-studio/utils'
import { computed } from 'vue'
import { useCapabilities } from './use.capabilities.ts'

export function useCurrentProvider() {
    const providersStore = useProvidersRuntimeStore()
    const providerId = useRouteParams<ServiceProviderId>('providerId')
    const capabilities = useCapabilities()

    const provider = computed<Maybe<ServiceProvider>>(() => {
        if (!providerId.value || !providersStore.providersMap.has(providerId.value)) {
            return
        }

        return providersStore.providersMap.get(providerId.value)
    })

    const isOnline = computed(() => Boolean(provider.value?.browserTabId))

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

    return {
        providerId,
        provider,
        isOnline,
        providerCapabilities,
        findProviderCapability,
    }
}
