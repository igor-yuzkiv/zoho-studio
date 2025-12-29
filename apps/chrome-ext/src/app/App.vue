<script setup lang="ts">
import { useBrowserTabsStore, useProvidersRuntimeStore } from '../store'
import { useAppStateStore } from '../store'
import { AppLayoutComponentMap } from './layouts'
import { LoadingOverlay, useAppThemeStore } from '@zoho-studio/ui-kit'
import { storeToRefs } from 'pinia'
import ConfirmDialog from 'primevue/confirmdialog'
import Toast from 'primevue/toast'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const appState = useAppStateStore()
const tabsStore = useBrowserTabsStore()
const providersStore = useProvidersRuntimeStore()

const { tabsList } = storeToRefs(tabsStore)

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

watch(tabsList, (newData) => providersStore.resolveFromBrowserTabs(newData), { immediate: true })
</script>

<template>
    <component :is="layoutComponent" />
    <LoadingOverlay v-if="appState.loadingOverlay" />
    <Toast />
    <ConfirmDialog />
</template>

<style scoped></style>
