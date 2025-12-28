<script setup lang="ts">
import { useBrowserTabsStore } from '../store/use.browser-tabs.store.ts'
import { useProvidersRuntimeStore } from '../store/use.providers-runtime.store.ts'
import { useAppStateStore } from './store/useAppStateStore.ts'
import { LoadingOverlay, useAppThemeStore } from '@zoho-studio/ui-kit'
import { storeToRefs } from 'pinia'
import ConfirmDialog from 'primevue/confirmdialog'
import Toast from 'primevue/toast'
import { watch } from 'vue'

const appState = useAppStateStore()
const tabsStore = useBrowserTabsStore()
const providersStore = useProvidersRuntimeStore()

const { tabsList } = storeToRefs(tabsStore)
const { providersList } = storeToRefs(providersStore)

tabsStore.initialize()
useAppThemeStore().initialize()

watch(tabsList, (newData) => providersStore.resolveFromBrowserTabs(newData), { immediate: true })
</script>

<template>
    <pre>
        {{ providersList }}
    </pre>
    <router-view />
    <LoadingOverlay v-if="appState.loadingOverlay" />
    <Toast />
    <ConfirmDialog />
</template>

<style scoped></style>
