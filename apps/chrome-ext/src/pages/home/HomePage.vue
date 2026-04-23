<script setup lang="ts">
import { integrationsRegistry } from '../../integrations.registry.ts'
import { useAppStore, useProvidersRuntimeStore } from '../../store'
import { AppRouteName } from '../../app/router'
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const appStore = useAppStore()
const providersStore = useProvidersRuntimeStore()
const { profileId } = storeToRefs(appStore)
const { providersList } = storeToRefs(providersStore)

const providerGroups = computed(() => {
    const groups = new Map<
        string,
        {
            profileId: string
            profileName: string
            providers: Array<{
                id: string
                title: string
                icon: string
                isOnline: boolean
                type: string
            }>
        }
    >()

    for (const provider of providersList.value) {
        const existingGroup = groups.get(provider.app_profile.id)

        const item = {
            id: provider.id,
            title: provider.title,
            icon: integrationsRegistry.getManifest(provider.type)?.icon || 'mdi:application',
            isOnline: Boolean(provider.browserTabId),
            type: provider.type,
        }

        if (existingGroup) {
            existingGroup.providers.push(item)
            continue
        }

        groups.set(provider.app_profile.id, {
            profileId: provider.app_profile.id,
            profileName: provider.app_profile.name,
            providers: [item],
        })
    }

    return Array.from(groups.values())
        .map((group) => {
            return {
                ...group,
                providers: group.providers.sort((left, right) => left.title.localeCompare(right.title)),
            }
        })
        .sort((left, right) => {
            const leftIsCurrentProfile = left.profileId === profileId.value
            const rightIsCurrentProfile = right.profileId === profileId.value

            if (leftIsCurrentProfile !== rightIsCurrentProfile) {
                return leftIsCurrentProfile ? -1 : 1
            }

            return left.profileName.localeCompare(right.profileName)
        })
})
</script>

<template>
    <div class="flex h-full w-full items-center justify-center overflow-hidden">
        <div class="app-card flex h-full w-full items-center justify-center">
            <div class="flex h-3/4 flex-col p-3">
                <div class="flex flex-col">
                    <div class="flex items-center gap-x-2 text-4xl">
                        <img src="/logo.png" alt="logo" />
                        <h1><span class="font-bold">Zoho Studio</span> Chrome Extension</h1>
                    </div>
                    <h3 class="mt-2 text-lg font-medium text-gray-700 dark:text-gray-400">
                        Open-source development environment for Zoho services.
                    </h3>
                </div>

                <div class="mt-14 flex flex-col">
                    <h3 class="text-2xl font-medium">Services</h3>
                    <div class="flex items-center gap-x-2 text-gray-700 dark:text-gray-400">
                        <Icon icon="material-symbols:info-outline" />
                        To make a service appear in the list, simply open any Zoho service in a neighboring browser tab.
                    </div>

                    <div class="mt-4 flex flex-col gap-4">
                        <div v-for="group in providerGroups" :key="group.profileId" class="rounded-lg border p-3">
                            <div class="mb-3 flex items-center justify-between gap-3">
                                <div>
                                    <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {{ group.profileName }}
                                    </h4>
                                    <p class="text-xs text-gray-500">
                                        {{ group.profileId }}
                                    </p>
                                </div>
                                <div class="text-sm text-gray-500">{{ group.providers.length }} services</div>
                            </div>

                            <div class="grid grid-cols-2 gap-2">
                                <div v-for="provider in group.providers" :key="provider.id">
                                    <router-link
                                        :to="{ name: AppRouteName.workspaceHome, params: { providerId: provider.id } }"
                                        class="flex cursor-pointer items-center gap-x-2 rounded px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    >
                                        <Icon
                                            :icon="
                                                provider.isOnline
                                                    ? 'fluent:plug-connected-32-filled'
                                                    : 'tabler:plug-connected-x'
                                            "
                                            class="h-5 w-5"
                                            :class="{
                                                'text-gray-500': !provider.isOnline,
                                            }"
                                        />
                                        <div>{{ provider.title }}</div>
                                        <div>({{ provider.type }})</div>
                                    </router-link>
                                </div>
                            </div>
                        </div>

                        <div
                            v-if="providerGroups.length === 0"
                            class="rounded-lg border border-dashed p-4 text-sm text-gray-500"
                        >
                            No services found for the current app profile yet.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
