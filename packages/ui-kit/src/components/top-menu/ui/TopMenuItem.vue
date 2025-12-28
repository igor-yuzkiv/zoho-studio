<script setup lang="ts">
import type { Component } from 'vue'

withDefaults(
    defineProps<{
        is?: string | Component
        title?: string
        disabled?: boolean
    }>(),
    {
        is: 'div',
    }
)
</script>

<template>
    <component
        :is="is"
        :title="title"
        class="hover:underline hover:bg-primary px-3 rounded-lg"
        :class="disabled ? 'is-disabled' : 'cursor-pointer'"
    >
        <slot>{{ title }}</slot>
    </component>
</template>

<style scoped>
.is-disabled {
    pointer-events: none;
    opacity: 0.5;
}
</style>
