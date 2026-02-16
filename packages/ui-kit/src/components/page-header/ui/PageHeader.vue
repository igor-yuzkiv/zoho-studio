<script setup lang="ts">
defineProps<{
    title?: string
    description?: string
}>()
</script>

<template>
    <div class="app-card flex items-center justify-between px-2">
        <slot>
            <div class="flex items-center gap-x-1">
                <slot name="prepend" />
                <div class="flex flex-col">
                    <h1 class="text-lg font-bold">
                        <slot name="title">{{ title }}</slot>
                    </h1>

                    <slot name="description">
                        <span class="text-xs text-gray-500">{{ description }}</span>
                    </slot>
                </div>
            </div>
        </slot>

        <div class="flex items-center gap-x-1">
            <slot name="actions" />
        </div>
    </div>
</template>

<style scoped></style>
