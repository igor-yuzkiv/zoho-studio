<script setup lang="ts">
import type { Primitive } from '@zoho-studio/utils'

defineProps<{
    label?: string
    value?: Primitive
}>()
</script>

<template>
    <div class="flex flex-col gap-1">
        <div class="text-gray-600 dark:text-gray-400 uppercase">
            <slot name="label">{{ label }}</slot>
        </div>
        <div class="text-black dark:text-white">
            <slot name="value">{{ value }}</slot>
        </div>
    </div>
</template>

<style scoped></style>
