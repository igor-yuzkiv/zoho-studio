<script setup lang="ts">
import { integrationsRegistry } from '../../../integrations'
import { useBrowserTabsStore, useProvidersRuntimeStore } from '../../../store'
import { AppRouteName } from '../../router'
import { Icon } from '@iconify/vue'
import { ServiceProviderId } from '@zoho-studio/core'
import { storeToRefs } from 'pinia'
import { Button } from 'primevue'
import { computed } from 'vue'

const providersStore = useProvidersRuntimeStore()
const tabsStore = useBrowserTabsStore()

const { providersList, providersMap } = storeToRefs(providersStore)
const { tabsMap } = storeToRefs(tabsStore)

async function test(providerId: ServiceProviderId) {
    console.log('test', providerId)
    if (!providersMap.value.has(providerId)) {
        return
    }

    const provider = providersMap.value.get(providerId)
    if (!provider || !provider.browserTabId || !tabsMap.value.has(provider.browserTabId)) {
        return
    }

    const caps = integrationsRegistry.getCapabilitiesByType(provider.type)
    if (!caps?.length) {
        return
    }

    const tab = tabsMap.value.get(provider.browserTabId)
    if (!tab) {
        return
    }

    const cap = caps[0]
    const adapter = new cap.adapter({ provider, tab })

    console.log('adapter', adapter)

    const response = await adapter.list({
        page: 1,
        per_page: 50,
    })

    console.log(response);
}

const itemsForDisplay = computed(() => {
    return providersList.value.map((provider) => {
        return {
            id: provider.id,
            title: provider.title,
            icon: integrationsRegistry.getByType(provider.type)?.icon || 'mdi:application',
            isOnline: Boolean(provider.browserTabId),
        }
    })
})
</script>

<template>
    <div class="flex h-full w-full items-center justify-center overflow-hidden">
        <div class="flex w-full h-full items-center justify-center app-card">
            <div class="flex flex-col p-3 h-3/4">
                <div class="flex flex-col">
                    <div class="flex items-center gap-x-2 text-4xl">
                        <Icon icon="logos:zoho" />
                        <h1 class="font-bold">Zoho Studio</h1>
                    </div>
                    <h3 class="mt-2 text-lg font-medium text-gray-700 dark:text-gray-400">
                        Development Environment for Zoho
                    </h3>
                </div>

                <div class="flex flex-col mt-14">
                    <h3 class="text-2xl font-medium">Services</h3>
                    <div class="flex items-center gap-x-2 text-gray-700 dark:text-gray-400">
                        <Icon icon="material-symbols:info-outline" />
                        To make a service appear in the list, simply open any Zoho service in a neighboring browser tab.
                    </div>

                    <div class="grid grid-cols-2 mt-3">
                        <div v-for="provider in itemsForDisplay" :key="provider.id">
                            <router-link
                                :to="{ name: AppRouteName.workspaceIndex, params: { providerId: provider.id } }"
                                class="flex items-center gap-x-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer px-2"
                                :class="{
                                    'text-gray-500': !provider.isOnline,
                                }"
                            >
                                <Icon :icon="provider.icon" class="w-5 h-5" />
                                <div>{{ provider.title }}</div>
                            </router-link>

                            <Button @click="test(provider.id)">Test: {{ provider.id }}</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
