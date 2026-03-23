<script setup lang="ts">
import { AppRouteName } from './router'
import { useAppStateStore, useBrowserTabsStore, useProvidersRuntimeStore, useSecurityRequirementsStore } from '../store'
import { AppLayoutComponentMap } from './layouts'
import { LoadingOverlay, useAppThemeStore } from '@zoho-studio/ui-kit'
import Button from 'primevue/button'
import { storeToRefs } from 'pinia'
import ConfirmDialog from 'primevue/confirmdialog'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const appState = useAppStateStore()
const tabsStore = useBrowserTabsStore()
const providersStore = useProvidersRuntimeStore()
const securityRequirementsStore = useSecurityRequirementsStore()

const { tabsMap } = storeToRefs(tabsStore)
const { hasAcceptedRequirements } = storeToRefs(securityRequirementsStore)

const layoutComponent = computed(() => {
    const layoutName = route.meta?.layout
    if (layoutName && layoutName in AppLayoutComponentMap) {
        return AppLayoutComponentMap[layoutName]
    }

    return AppLayoutComponentMap.default
})

providersStore.initialize()
tabsStore.initialize()
useAppThemeStore().initialize()

watch(tabsMap, (newData) => providersStore.handleBrowserTabsChange(newData), { immediate: true })
watch(
    [hasAcceptedRequirements, () => route.name],
    ([isAccepted, routeName]) => {
        if (!isAccepted && routeName !== AppRouteName.home) {
            router.replace({ name: AppRouteName.home })
        }
    },
    { immediate: true }
)

function acceptSecurityRequirements() {
    securityRequirementsStore.acceptRequirements()
}
</script>

<template>
    <component :is="layoutComponent" />
    <LoadingOverlay v-if="appState.loadingOverlay" />
    <Toast />
    <ConfirmDialog />
    <Dialog
        :visible="!hasAcceptedRequirements"
        modal
        header="Welcome to Zoho Studio"
        class="w-[92vw] max-w-xl"
        content-class="overflow-hidden"
        :draggable="false"
        :closable="false"
        :dismissable-mask="false"
        :close-on-escape="false"
    >
        <div class="space-y-4">
            <p class="text-sm leading-6 text-gray-700 dark:text-gray-300">
                <b class="text-primary-500">Zoho Studio</b> is a browser extension that adds a developer-oriented
                workspace next to your Zoho tabs.
            </p>
            <p class="text-sm leading-6 text-gray-700 dark:text-gray-300">
                It uses your current browser session and may rely on unofficial Zoho APIs.
                <b>Please use this tool only in environments and with services you are authorized to access.</b>
            </p>
            <p class="text-sm leading-6 font-bold text-gray-900 dark:text-gray-100">
                By continuing, you acknowledge how the extension works and accept responsibility for how it is used.
            </p>

            <a href="https://github.com/igor-yuzkiv/zoho-studio" target="_blank" class="hover:underline">
                <p class="text-sm leading-6 text-gray-700 dark:text-gray-300">
                    For more details, please refer to our <b class="text-primary-500">documentation</b>.
                </p>
            </a>
        </div>

        <template #footer>
            <div class="flex w-full justify-end">
                <Button label="I understand and continue" size="small" @click="acceptSecurityRequirements" />
            </div>
        </template>
    </Dialog>
</template>

<style scoped></style>
