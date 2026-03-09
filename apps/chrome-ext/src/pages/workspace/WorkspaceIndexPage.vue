<script setup lang="ts">
import { useArtifactsZipExport, useCurrentProvider, useProviderCacheManager } from '../../composables'
import { Icon } from '@iconify/vue'
import { computed, ref, watch } from 'vue'
import Menu from 'primevue/menu'
import type { MenuItem } from 'primevue/menuitem'
import Inplace from 'primevue/inplace'
import InputText from 'primevue/inputtext'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import { IconButton } from '@zoho-studio/ui-kit'
import { useConfirm, useToast } from '@zoho-studio/ui-kit'

const toast = useToast()
const confirm = useConfirm()

const { providerId, providerManifest, provider, isOnline, updateProviderTitle } = useCurrentProvider()
const providerTitle = ref<string>(provider.value?.title ?? 'Unknown Provider')

const { refreshProviderCache, isProviderInProgress } = useProviderCacheManager()
const isCachingInProgress = computed<boolean>(() => isProviderInProgress(providerId.value))

const { exportProviderArtifacts, isExporting } = useArtifactsZipExport()

const actionsMenuItems = computed<MenuItem[]>(() => {
    return [
        {
            label: 'Refresh Cache',
            icon: isCachingInProgress.value ? 'line-md:loading-loop' : 'tdesign:clear-filled',
            disabled: isCachingInProgress.value,
            command: () => handleRefreshProviderCache(),
        },
        {
            label: 'Export ZIP',
            icon: isExporting.value ? 'line-md:loading-loop' : 'material-symbols:download',
            disabled: isExporting.value,
            command: () => handleExportArtifacts(),
        },
        {
            label: 'Commit',
            icon: 'ph:git-commit-bold',
        },
    ]
})

async function handleRefreshProviderCache() {
    if (!provider.value || isCachingInProgress.value) {
        return
    }

    if (!isOnline.value) {
        toast.error({ detail: 'Cannot refresh cache while provider is offline.' })
        return
    }

    confirm.require({
        header: 'Refresh Cache',
        message: 'This will clear and re-sync all artifacts for this provider. Are you sure you want to continue?',
        accept: async () => {
            if (provider.value) {
                refreshProviderCache(provider.value)
                    .then(() => {
                        toast.success({ detail: 'Provider cache refreshed successfully.' })
                    })
                    .catch((error) => {
                        console.error('Failed to clear cache', error)
                        toast.error({ detail: 'Failed to refresh provider cache. Please try again.' })
                    })
            }
        },
    })
}

function handleExportArtifacts() {
    if (provider.value) {
        exportProviderArtifacts(provider.value)
    }
}

function resetProviderTitle(closeInplace?: () => void) {
    providerTitle.value = provider.value?.title ?? 'Unknown Provider'
    if (closeInplace) {
        closeInplace()
    }
}

function saveProviderTitle(closeInplace?: () => void) {
    const newTitle = providerTitle.value.trim()
    if (!provider.value || !newTitle || newTitle === provider.value.title) {
        return
    }

    updateProviderTitle(newTitle)
    if (closeInplace) {
        closeInplace()
    }
}

watch(provider, () => resetProviderTitle())
</script>

<template>
    <div class="app-card flex h-full w-full items-center justify-center">
        <div v-if="providerManifest && provider" class="container mx-auto flex flex-col p-3 xl:max-w-3xl">
            <div class="flex w-full flex-col">
                <h3 class="text-gray-700 dark:text-gray-400">Service Provider</h3>
                <div class="flex w-full items-center gap-x-2 text-2xl">
                    <Icon :icon="providerManifest.icon" />
                    <Inplace class="w-full" unstyled>
                        <template #display>
                            <div class="group flex cursor-pointer items-center gap-x-2 hover:underline">
                                <h1 class="font-bold">{{ provider.title }}</h1>
                                <Icon
                                    class="text-gray-500 opacity-0 group-hover:opacity-100"
                                    icon="material-symbols:edit"
                                />
                            </div>
                        </template>

                        <template #content="{ closeCallback }">
                            <InputGroup>
                                <InputGroupAddon>
                                    <IconButton
                                        @click="resetProviderTitle(closeCallback)"
                                        icon="ic:baseline-close"
                                        size="small"
                                        text
                                        severity="secondary"
                                        class="p-0"
                                        rounded
                                    />
                                </InputGroupAddon>

                                <InputText v-model="providerTitle" class="w-full" size="small" />

                                <InputGroupAddon>
                                    <IconButton
                                        icon="material-symbols:check-rounded"
                                        size="small"
                                        text
                                        class="p-0"
                                        severity="success"
                                        rounded
                                        @click="saveProviderTitle(closeCallback)"
                                    />
                                </InputGroupAddon>
                            </InputGroup>
                        </template>
                    </Inplace>
                </div>

                <Menu :model="actionsMenuItems" class="mt-2 border-none bg-transparent">
                    <template #itemicon="{ item }">
                        <Icon :icon="item?.icon ?? 'icon-park-outline:dot'" />
                    </template>
                </Menu>

                <div class="app-card mt-4 p-1">
                    <pre>{{ provider }}</pre>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
