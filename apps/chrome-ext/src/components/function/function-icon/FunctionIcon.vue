<script setup lang="ts">
import { FunctionTypeMetadataMap } from '@zoho-studio/core'
import type { FunctionMetadata, FunctionType } from '@zoho-studio/core'
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps<{ type?: FunctionType }>()

const typeMetadata = computed<FunctionMetadata>(() => {
    return props.type && FunctionTypeMetadataMap[props.type]
        ? FunctionTypeMetadataMap[props.type]
        : FunctionTypeMetadataMap.unknown
})
</script>

<template>
    <Icon :icon="typeMetadata.icon" />
</template>

<style scoped></style>
