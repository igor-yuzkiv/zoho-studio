<script setup lang="ts">
defineProps<{
    title?: string
}>()
</script>

<template>
    <div class="border-l-[3px] border-orange-500">
        <slot>
            <h2 class="ml-2 font-semibold">{{ title }}</h2>
        </slot>
    </div>
</template>

<style scoped></style>
