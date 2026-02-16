<script setup lang="ts">
import type { IArtifact } from '@zoho-studio/core'
import { MetadataJsonView } from '@zoho-studio/ui-kit'
import { computed } from 'vue'
import { useArtifactsByParentIdQuery } from '../../../../../queries'

const props = defineProps<{
    artifact: IArtifact<'modules'>
}>()

const artifactId = computed(() => props.artifact.id)
const { data: fields } = useArtifactsByParentIdQuery<'fields'>(artifactId)

const jsonData = computed(() => {
    return { module: props.artifact, fields: fields.value ?? [] }
})
</script>

<template>
    <MetadataJsonView :data="jsonData" />
</template>
