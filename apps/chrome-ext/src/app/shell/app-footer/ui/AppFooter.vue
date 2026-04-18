<script setup lang="ts">
import { IconButton, ToggleThemeButton, useAppThemeStore } from '@zoho-studio/ui-kit'
import { storeToRefs } from 'pinia'
import { useAppStateStore } from '../../../../store'

const reportIssueUrl = import.meta.env.VITE_GITHUB_REPO_URL
    ? `${import.meta.env.VITE_GITHUB_REPO_URL}/issues/new?assignees=&labels=bug&template=bug_report.md&title=%5BBUG%5D+Short+description+of+the+issue`
    : null

const appTheme = useAppThemeStore()

const { isLeftSidebarCollapsed } = storeToRefs(useAppStateStore())

function fullScreen() {
    chrome.tabs.create({ url: chrome.runtime.getURL(`index.html${window.location.hash || ''}`) })
}
</script>

<template>
    <footer class="flex w-full justify-between px-2">
        <div class="flex items-center gap-x-1">
            <slot name="start"></slot>
        </div>
        <div class="flex items-center justify-end gap-x-2">
            <slot name="end"></slot>

            <a
                v-if="reportIssueUrl"
                target="_blank"
                :href="reportIssueUrl"
                class="text-primary-500 text-sm hover:underline"
            >
                Report Issue
            </a>

            <IconButton
                class="p-0"
                text
                size="small"
                @click="isLeftSidebarCollapsed = !isLeftSidebarCollapsed"
                :icon="isLeftSidebarCollapsed ? 'mingcute:layout-11-fill' : 'mingcute:layout-top-fill'"
                title="Toggle Left Sidebar"
            />
            <IconButton
                class="p-0"
                text
                size="small"
                @click="fullScreen"
                icon="mingcute:fullscreen-fill"
                title="Open in Full Screen"
            />
            <ToggleThemeButton :is-dark="appTheme.isDark" @click="appTheme.toggle" />
        </div>
    </footer>
</template>

<style scoped></style>
