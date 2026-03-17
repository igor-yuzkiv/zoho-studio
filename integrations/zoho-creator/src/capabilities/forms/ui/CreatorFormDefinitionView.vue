<script setup lang="ts">
import type { IArtifact } from '@zoho-studio/core'
import { useAppThemeStore } from '@zoho-studio/ui-kit'
import { computed } from 'vue'
import { ZohoCreatorForm } from '../../../types'

const props = defineProps<{
    artifact: IArtifact
}>()

const appTheme = useAppThemeStore()

const definition = computed(() => {
    const origin = props.artifact.origin as ZohoCreatorForm
    return origin.definition ?? ''
})
</script>

<template>
    <vue-monaco-editor language="javascript" :value="definition" :theme="appTheme.isDark ? 'vs-dark' : 'vs'" />
</template>
