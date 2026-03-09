<script setup lang="ts">
import { useArtifactsZipExport, useCurrentProvider, useProviderCacheManager } from '../../composables'
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import Menu from 'primevue/menu'
import type { MenuItem } from 'primevue/menuitem'
import { useConfirm, useToast } from '@zoho-studio/ui-kit'

const toast = useToast()
const confirm = useConfirm()

const { providerId, providerManifest, provider, isOnline } = useCurrentProvider()
const { refreshProviderCache, isProviderInProgress } = useProviderCacheManager()
const { exportProviderArtifacts, isExporting } = useArtifactsZipExport()

const isCachingInProgress = computed<boolean>(() => isProviderInProgress(providerId.value))

const items = computed<MenuItem[]>(() => {
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
            label: 'Git Commit',
            icon: 'teenyicons:git-commit-solid',
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
    if (!provider.value) {
        return
    }

    exportProviderArtifacts(provider.value)
}
</script>

<template>
    <div class="app-card flex h-full w-full items-center justify-center">
        <div v-if="providerManifest && provider" class="flex h-[30%] flex-col p-3">
            <div class="flex flex-col">
                <h3 class="text-gray-700 dark:text-gray-400">Service Provider</h3>
                <div class="flex items-center gap-x-2 text-2xl">
                    <Icon :icon="providerManifest.icon" />
                    <h1 class="font-bold">{{ provider.title }}</h1>
                </div>

                <Menu :model="items" class="mt-2 border-none bg-transparent">
                    <template #itemicon="{ item }">
                        <Icon :icon="item?.icon ?? 'icon-park-outline:dot'" />
                    </template>
                </Menu>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
