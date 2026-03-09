<script setup lang="ts">
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import { useRoute, useRouter } from 'vue-router'
import { useCurrentProvider, useProviderCacheManager } from '../../../composables'
import { ProviderCapabilitiesMenu } from '../../../components/provider-capabilities-menu'
import { AppFooter } from '../../shell/app-footer'
import { AppTopMenu } from '../../shell/app-top-menu'
import { computed, onMounted } from 'vue'
import { AppRouteName } from '../../router'
import { Icon } from '@iconify/vue'

const route = useRoute()
const router = useRouter()

const { providerId, provider, providerManifest, providerCapabilities, lastSyncedAtFormatted } = useCurrentProvider()
const { ensureSyncArtifacts, isProviderInProgress } = useProviderCacheManager()

const isCachingInProgress = computed<boolean>(() => isProviderInProgress(providerId.value))

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
        <AppTopMenu />

        <main
            class="flex h-full w-full overflow-hidden pr-2"
            :class="{
                'pt-2': route.meta?.hideTopbar,
                'pb-2': route.meta?.hideFooter,
            }"
        >
            <ProviderCapabilitiesMenu :provider-id="providerId" :capabilities="providerCapabilities">
                <template #start>
                    <div v-if="provider && providerManifest" class="flex flex-col border-b py-1">
                        <router-link
                            v-tooltip="{ value: provider.title }"
                            :to="{ name: AppRouteName.workspaceIndex, params: { providerId } }"
                            class="hover:bg-selection flex cursor-pointer items-center justify-center rounded-lg p-2"
                            active-class="bg-orange-500 text-white"
                        >
                            <Icon :icon="providerManifest.icon" class="h-4 w-4" />
                        </router-link>
                    </div>
                </template>
            </ProviderCapabilitiesMenu>

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
        </AppFooter>
    </div>
</template>

<style scoped></style>
