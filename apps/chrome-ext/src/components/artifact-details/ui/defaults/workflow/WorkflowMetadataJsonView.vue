<script setup lang="ts">
import type { IArtifact } from '@zoho-studio/core'
import { JsonViewer } from '@zoho-studio/ui-kit'

defineProps<{
    artifact: IArtifact<'workflows'>
}>()
</script>

<template>
    <JsonViewer :data="artifact" />
</template>
