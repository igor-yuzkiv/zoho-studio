<script setup lang="ts">
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import { useRoute, useRouter } from 'vue-router'
import { useCurrentProvider, useProviderCacheManager } from '../../../composables'
import { ProviderCapabilitiesMenu } from '../../../components/provider-capabilities-menu'
import { AppFooter } from '../../shell/app-footer'
import { AppHeader } from '../../shell/app-header'
import { computed, onMounted } from 'vue'
import { AppRouteName } from '../../router'
import { Icon } from '@iconify/vue'
import { IconButton, useConfirm, useToast } from '@zoho-studio/ui-kit'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const confirm = useConfirm()
const { providerId, provider, providerCapabilities, lastSyncedAtFormatted, isOnline } = useCurrentProvider()
const { ensureSyncArtifacts, refreshProviderCache, isProviderInProgress } = useProviderCacheManager()
const isCachingInProgress = computed<boolean>(() => isProviderInProgress(providerId.value))

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
                refreshProviderCache(provider.value).catch((error) => {
                    console.error('Failed to clear cache', error)
                    toast.error({ detail: 'Failed to refresh provider cache. Please try again.' })
                })
            }
        },
    })
}

onMounted(() => {
    if (!provider.value) {
        router.push({
            name: AppRouteName.error,
            query: { code: 404, message: 'Something went wrong. Provider not found.' },
        })
        return
    }

    ensureSyncArtifacts(provider.value).catch((error) => {
        console.error(error)

        router.push({
            name: AppRouteName.error,
            query: { code: 500, message: 'Failed to sync provider artifacts. Please try again.' },
        })
    })
})
</script>

<template>
    <div class="bg-secondary relative flex h-screen w-full flex-col overflow-hidden">
        <AppHeader />

        <main
            class="flex h-full w-full overflow-hidden px-2"
            :class="{
                'pt-2': route.meta?.hideTopbar,
                'pb-2': route.meta?.hideFooter,
            }"
        >
            <ProviderCapabilitiesMenu :provider-id="providerId" :capabilities="providerCapabilities" />

            <Splitter
                class="flex h-full w-full overflow-hidden bg-transparent"
                :pt="{ gutter: { class: 'bg-transparent' } }"
            >
                <SplitterPanel
                    v-if="!route.meta?.hideSidebarMenu"
                    class="flex h-full w-full overflow-hidden"
                    :size="5"
                    style="min-width: 10rem; max-width: 50rem"
                >
                    <div class="app-card flex h-full w-full flex-col overflow-hidden">
                        <router-view name="menu" />
                    </div>
                </SplitterPanel>

                <SplitterPanel class="flex h-full w-full flex-col overflow-hidden">
                    <router-view />
                </SplitterPanel>
            </Splitter>
        </main>

        <AppFooter>
            <template #start>
                <div v-if="isCachingInProgress" class="flex items-center gap-x-1 text-sm text-gray-500">
                    <Icon icon="line-md:loading-loop" />
                    <span>Caching...</span>
                </div>
                <div v-else class="text-sm text-gray-500">Last synced: {{ lastSyncedAtFormatted }}</div>
            </template>

            <template #end>
                <IconButton
                    class="p-0"
                    text
                    size="small"
                    severity="secondary"
                    icon="tdesign:clear-filled"
                    :disabled="isCachingInProgress"
                    @click="handleRefreshProviderCache"
                    v-tooltip="{ value: 'Refresh Cache', placement: 'top' }"
                />
            </template>
        </AppFooter>
    </div>
</template>

<style scoped></style>
