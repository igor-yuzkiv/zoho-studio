import { useProvidersRuntimeStore } from '../store'
import { useRouteParams } from '@vueuse/router'
import type { CapabilityDescriptor, ServiceProvider, ServiceProviderId } from '@zoho-studio/core'
import type { Maybe } from '@zoho-studio/utils'
import { computed } from 'vue'
import { integrationsRegistry } from '../integrations.registry.ts'

export function useCurrentProvider() {
    const providersStore = useProvidersRuntimeStore()
    const providerId = useRouteParams<ServiceProviderId>('providerId')

    const provider = computed<Maybe<ServiceProvider>>(() => {
        if (!providerId.value || !providersStore.providersMap.has(providerId.value)) {
            return
        }

        return providersStore.providersMap.get(providerId.value)
    })

    const isOnline = computed(() => Boolean(provider.value?.browserTabId))

    const providerCapabilities = computed<CapabilityDescriptor[]>(() => {
        if (!provider.value) {
            return [];
        }

        return integrationsRegistry.getCapabilitiesByServiceProviderType(provider.value.type);
    })

    return {
        providerId,
        provider,
        isOnline,
        providerCapabilities
    }
}
