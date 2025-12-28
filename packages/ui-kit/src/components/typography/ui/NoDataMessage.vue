<script setup lang="ts">
import { Icon } from '@iconify/vue'

withDefaults(
    defineProps<{
        title?: string
        message?: string
        icon?: string
    }>(),
    {
        title: 'No Data Available',
        message: 'There is currently no data to display here.',
        icon: 'rivet-icons:browser-window-solid',
    }
)
</script>

<template>
    <div class="flex flex-col items-center justify-center text-gray-400">
        <Icon :icon="icon" class="w-12 h-12" />
        <div class="flex flex-col items-center gap-2 max-w-md mt-3">
            <h1 class="text-2xl font-bold">{{ title }}</h1>
            <p>{{ message }}</p>
        </div>
    </div>
</template>

<style scoped></style>
