<script setup lang="ts">
import { useArtifactsZipExport, useCurrentProvider, useProviderCacheManager } from '../../composables'
import { useProvidersRuntimeStore } from '../../store'
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
import { useCommitProviderArtifacts } from '../../composables'
import { useConsoleLogger } from '@zoho-studio/utils'
import { ZodError } from 'zod'
import { CommitProviderArtifactsDialog } from '../../components/provider'
import { isGitFeatureEnabled } from '../../feature-flags.ts'

const logger = useConsoleLogger('WorkspaceIndexPage')
const toast = useToast()
const confirm = useConfirm()

const providersStore = useProvidersRuntimeStore()
const { providerId, providerManifest, provider, isOnline, updateProviderTitle, isCachingInProgress } =
    useCurrentProvider()
const providerTitle = ref<string>(provider.value?.title ?? 'Unknown Provider')
const { refreshProviderCache } = useProviderCacheManager()

const { exportProviderArtifacts, isExporting } = useArtifactsZipExport()

const commitDialog = useCommitProviderArtifacts()

const actionsMenuItems = computed<MenuItem[]>(() => {
    const items: MenuItem[] = [
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
    ]

    if (isGitFeatureEnabled) {
        items.push({
            label: 'Commit',
            icon: 'ph:git-commit-bold',
            command: () => {
                if (provider.value) {
                    commitDialog.openDialog(provider.value)
                }
            },
        })
    }

    return items
})

async function handleRefreshProviderCache() {
    if (isCachingInProgress.value) {
        toast.info({ detail: 'Cache refresh is already in progress. Please wait for it to complete.' })
        return
    }

    if (!provider.value || !isOnline.value) {
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
                        logger.error('Failed to clear cache', error)
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

async function handleGitCommit() {
    try {
        await commitDialog.commit()

        providersStore.updateProvider(providerId.value, { gitRepository: commitDialog.repository.value })

        toast.success({ detail: 'Committed successfully.' })

        commitDialog.closeDialog()
    } catch (error) {
        logger.error('Failed to commit provider artifacts', error)

        if (error instanceof ZodError) {
            const [first, ...rest] = error.issues
            if (!first) {
                toast.error({ detail: 'Validation failed. Please check your input and try again.' })
                return
            }

            const errorMessage = rest.length > 0 ? `${first.message} (and ${rest.length} more errors)` : first.message

            toast.error({ detail: errorMessage })
        } else {
            toast.error({
                detail: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
            })
        }
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

        <CommitProviderArtifactsDialog
            v-if="isGitFeatureEnabled"
            v-model:visible="commitDialog.visible.value"
            v-model:filter-term="commitDialog.filterTerm.value"
            v-model:repository="commitDialog.repository.value"
            v-model:message="commitDialog.message.value"
            :artifacts="commitDialog.filteredArtifacts.value"
            :loading="commitDialog.isLoading.value"
            @commit="handleGitCommit"
            @cancel="commitDialog.closeDialog"
        />
    </div>
</template>

<style scoped></style>
