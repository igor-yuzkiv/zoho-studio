<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
    defineProps<{
        value?: string
    }>(),
    {
        value: 'unknown',
    }
)

const STATUS_CLASS_MAP: Record<string, string> = {
    success: 'bg-green-300 text-green-900',
    failure: 'bg-red-300 text-red-900',
    default: 'bg-gray-300 text-gray-900',
}

const statusClass = computed(() => STATUS_CLASS_MAP[props.value] || STATUS_CLASS_MAP['default'])
</script>

<template>
    <span :class="statusClass" class="inline-flex h-6 items-center rounded-full px-2 text-xs font-medium">
        {{ value }}
    </span>
</template>

<style scoped></style>
