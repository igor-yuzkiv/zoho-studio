<script setup lang="ts">
import { CrmServiceProviderMetadata } from '../../types'
import { computed } from 'vue'
import { resolveCrmUrl } from '../utils.ts'

const props = defineProps<{
    metadata: CrmServiceProviderMetadata
    path: string
    label?: string
}>()

const href = computed(() => resolveCrmUrl(props.metadata, props.path))
</script>

<template>
    <a :href="href" class="text-blue-500 hover:underline" target="_blank">
        <slot>{{ label }}</slot>
    </a>
</template>

<style scoped></style>
