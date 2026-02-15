<script setup lang="ts">
import { computed } from 'vue'
import { useAppThemeStore } from '../../../useAppThemeStore.ts'

const props = defineProps<{
    data: Record<string, unknown>
}>()

const appTheme = useAppThemeStore()

const jsonData = computed(() => {
    return JSON.stringify(props.data, null, 2)
})
</script>

<template>
    <vue-monaco-editor language="json" :value="jsonData" :theme="appTheme.isDark ? 'vs-dark' : 'vs'" />
</template>
