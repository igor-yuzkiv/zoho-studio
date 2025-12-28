<script setup lang="ts">
import { useBrowserTabsStore } from '../store/use.browser-tabs.store.ts'
import { useAppStateStore } from './store/useAppStateStore.ts'
import { LoadingOverlay, useAppThemeStore } from '@zoho-studio/ui-kit'
import ConfirmDialog from 'primevue/confirmdialog'
import Toast from 'primevue/toast'

const appState = useAppStateStore()
const tabsStore = useBrowserTabsStore();

tabsStore.initialize()
useAppThemeStore().initialize()
</script>

<template>
    <pre>
        {{tabsStore.tabsList}}
    </pre>
    <router-view />
    <LoadingOverlay v-if="appState.loadingOverlay" />
    <Toast />
    <ConfirmDialog />
</template>

<style scoped></style>
