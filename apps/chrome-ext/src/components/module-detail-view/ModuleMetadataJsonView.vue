<script setup lang="ts">
import type { IArtifact } from '@zoho-studio/core'
import { MetadataJsonView } from '@zoho-studio/ui-kit'
import { computed } from 'vue'

const props = defineProps<{
    module: IArtifact<'modules'>
    fields: IArtifact<'fields'>[]
}>()

const jsonData = computed(() => {
    return { module: props.module, fields: props.fields }
})
</script>

<template>
    <MetadataJsonView :data="jsonData" />
</template>
