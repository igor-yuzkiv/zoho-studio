<script setup lang="ts">
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import { IconButton } from '../../button'

import { useAppThemeStore } from '../../../useAppThemeStore.ts'
import { computed } from 'vue'
import { useClipboard } from '@vueuse/core'

const props = withDefaults(
    defineProps<{
        data: string | number | boolean | unknown[] | Record<string, unknown> | null
        depth?: number
        title?: string
        headerClass?: string
        contentClass?: string
    }>(),
    {
        depth: 6,
        title: 'Json Object',
    }
)

const { copy: copyToClipboard } = useClipboard()
const appTheme = useAppThemeStore()
const theme = computed(() => (appTheme.isDark ? 'dark' : 'light'))

function handleCopy() {
    copyToClipboard(JSON.stringify(props.data, null, 2))
}
</script>

<template>
    <div class="flex flex-col">
        <div class="flex items-center justify-between gap-x-2 border-b px-2 py-1" :class="headerClass">
            <div class="flex items-center gap-x-1">
                <span v-if="title" class="dark:text-anakiwa-200 text-anakiwa-500 text-sm">{{ title }}</span>
            </div>
            <div v-if="data" class="flex items-center gap-x-1">
                <IconButton @click="handleCopy" icon="boxicons:copy" text class="p-0" severity="secondary" />
            </div>
        </div>
        <VueJsonPretty
            :class="contentClass"
            :data="data"
            :theme="theme"
            show-icon
            show-key-value-space
            show-length
            :indent="6"
            :deep="depth"
        />
    </div>
</template>

<style scoped></style>
