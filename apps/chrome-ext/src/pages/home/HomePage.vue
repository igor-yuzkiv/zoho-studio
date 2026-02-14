<script setup lang="ts">
import { integrationsRegistry } from '../../integrations.registry.ts'
import { useProvidersRuntimeStore } from '../../store'
import { AppRouteName } from '../../app/router'
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const providersStore = useProvidersRuntimeStore()
const { providersList } = storeToRefs(providersStore)

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
        <div class="app-card flex h-full w-full items-center justify-center">
            <div class="flex h-3/4 flex-col p-3">
                <div class="flex flex-col">
                    <div class="flex items-center gap-x-2 text-4xl">
                        <Icon icon="logos:zoho" />
                        <h1 class="font-bold">Zoho Studio</h1>
                    </div>
                    <h3 class="mt-2 text-lg font-medium text-gray-700 dark:text-gray-400">
                        Development Environment for Zoho
                    </h3>
                </div>

                <div class="mt-14 flex flex-col">
                    <h3 class="text-2xl font-medium">Services</h3>
                    <div class="flex items-center gap-x-2 text-gray-700 dark:text-gray-400">
                        <Icon icon="material-symbols:info-outline" />
                        To make a service appear in the list, simply open any Zoho service in a neighboring browser tab.
                    </div>

                    <div class="mt-3 grid grid-cols-2">
                        <div v-for="provider in itemsForDisplay" :key="provider.id">
                            <router-link
                                :to="{ name: AppRouteName.workspaceIndex, params: { providerId: provider.id } }"
                                class="flex cursor-pointer items-center gap-x-2 rounded px-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                                :class="{
                                    'text-gray-500': !provider.isOnline,
                                }"
                            >
                                <Icon :icon="provider.icon" class="h-5 w-5" />
                                <div>{{ provider.title }}</div>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
