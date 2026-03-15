<script setup lang="ts">
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

import { useAppThemeStore } from '../../../useAppThemeStore.ts'
import { computed } from 'vue'

withDefaults(
    defineProps<{
        data: string | number | boolean | unknown[] | Record<string, unknown> | null
        depth?: number
    }>(),
    {
        depth: 6,
    }
)

const appTheme = useAppThemeStore()
const theme = computed(() => (appTheme.isDark ? 'dark' : 'light'))
</script>

<template>
    <VueJsonPretty
        class="p-2"
        :data="data"
        :theme="theme"
        show-icon
        show-key-value-space
        show-length
        :indent="6"
        :deep="depth"
    />
</template>

<style scoped></style>
