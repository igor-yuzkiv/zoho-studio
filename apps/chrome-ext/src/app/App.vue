<script setup lang="ts">
import {
    useAppStore,
    useBrowserTabsStore,
    useProvidersRuntimeStore,
    useSecurityRequirementsStore,
} from '../store'
import { AppRouteName } from './router'
import { AppLayoutComponentMap } from './layouts'
import { LoadingOverlay, useAppThemeStore } from '@zoho-studio/ui-kit'
import { storeToRefs } from 'pinia'
import ConfirmDialog from 'primevue/confirmdialog'
import Toast from 'primevue/toast'
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const appState = useAppStore()
const tabsStore = useBrowserTabsStore()
const providersStore = useProvidersRuntimeStore()
const securityRequirementsStore = useSecurityRequirementsStore()
const appThemeStore = useAppThemeStore()

const { tabsMap } = storeToRefs(tabsStore)
const { profileId, profileName } = storeToRefs(appState)
const { hasAcceptedRequirements } = storeToRefs(securityRequirementsStore)

const layoutComponent = computed(() => {
    const layoutName = route.meta?.layout
    if (layoutName && layoutName in AppLayoutComponentMap) {
        return AppLayoutComponentMap[layoutName]
    }

    return AppLayoutComponentMap.default
})

watch(
    tabsMap,
    (newData) => {
        void providersStore.handleBrowserTabsChange(newData)
    },
    { immediate: true }
)

watch(
    [hasAcceptedRequirements, profileId, profileName, () => route.name],
    ([isAccepted, currentProfileId, currentProfileName, routeName]) => {
        const hasProfile = Boolean(currentProfileId && currentProfileName)
        const isWelcomeRoute =
            routeName === AppRouteName.welcome || routeName === AppRouteName.welcomeProfileSetup

        if ((!isAccepted || !hasProfile) && !isWelcomeRoute) {
            void router.replace({ name: AppRouteName.welcome })
        }
    },
    { immediate: true }
)

async function initializeApp() {
    appThemeStore.initialize()
    await providersStore.initialize()
    await tabsStore.initialize()
}

void initializeApp()
</script>

<template>
    <component :is="layoutComponent" />
    <LoadingOverlay v-if="appState.loadingOverlay" />
    <Toast />
    <ConfirmDialog />
</template>

<style scoped></style>
