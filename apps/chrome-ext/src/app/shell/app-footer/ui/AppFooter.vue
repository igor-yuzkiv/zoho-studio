<script setup lang="ts">
import { IconButton, ToggleThemeButton, useAppThemeStore } from '@zoho-studio/ui-kit'

const appTheme = useAppThemeStore()

function fullScreen() {
    chrome.tabs.create({ url: chrome.runtime.getURL('index.html') })
}
</script>

<template>
    <footer class="flex w-full justify-between px-2">
        <div class="flex items-center gap-x-1">
            <slot name="start"></slot>
        </div>
        <div class="flex items-center justify-end gap-x-2">
            <slot name="end"></slot>
            <IconButton class="p-0" text size="small" @click="fullScreen" icon="mingcute:fullscreen-fill"></IconButton>
            <ToggleThemeButton :is-dark="appTheme.isDark" @click="appTheme.toggle" />
        </div>
    </footer>
</template>

<style scoped></style>
