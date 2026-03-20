<script setup lang="ts">
import type { Primitive } from '@zoho-studio/utils'

defineProps<{
    label?: string
    value?: Primitive
}>()
</script>

<template>
    <div class="flex flex-col gap-1">
        <div class="text-gray-600 uppercase dark:text-gray-400">
            <slot name="label">{{ label }}</slot>
        </div>
        <slot name="value">
            <span class="text-black dark:text-white">{{ value }}</span>
        </slot>
    </div>
</template>

<style scoped></style>
