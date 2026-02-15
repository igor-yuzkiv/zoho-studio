<script setup lang="ts">
import type { IArtifact } from '@zoho-studio/core'
import { MetadataJsonView } from '@zoho-studio/ui-kit'

defineProps<{
    artifact: IArtifact<'functions'>
}>()
</script>

<template>
    <MetadataJsonView :data="artifact" />
</template>
