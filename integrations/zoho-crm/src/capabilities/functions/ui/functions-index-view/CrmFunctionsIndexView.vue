<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<template>
    <div class="flex flex-col items-center justify-center text-gray-400">
        <Icon icon="cil:functions" class="h-12 w-12" />
        <div class="mt-3 flex max-w-md flex-col items-center gap-2">
            <h1 class="text-2xl font-bold">No Functions Selected</h1>
            <p>Please select a function to view its details.</p>
        </div>
    </div>
</template>

<style scoped></style>
