<script setup lang="ts">
import type { IArtifact } from '@zoho-studio/core'
import { useAppThemeStore } from '@zoho-studio/ui-kit'
import { computed } from 'vue'

const props = defineProps<{
    artifact: IArtifact<'functions'>
}>()

const appTheme = useAppThemeStore()

const script = computed(() => {
    return props.artifact.payload.script ?? ''
})

</script>

<template>
    <vue-monaco-editor
        language="javascript"
        :value="script"
        :theme="appTheme.isDark ? 'vs-dark' : 'vs'"
    />
</template>
