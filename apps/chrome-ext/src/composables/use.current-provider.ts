import { useProvidersRuntimeStore } from '../store'
import { useRouteParams } from '@vueuse/router'
import type { ServiceProvider, ServiceProviderId } from '@zoho-studio/core'
import type { Maybe } from '@zoho-studio/utils'
import { computed } from 'vue'

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

    return {
        providerId,
        provider,
        isOnline,
    }
}
