<script setup lang="ts">
defineProps<{
    title?: string
}>()
</script>

<template>
    <div class="border-l-[3px] border-orange-500 pl-2">
        <slot>
            <h2 class="font-semibold">{{ title }}</h2>
        </slot>
    </div>
</template>

<style scoped></style>
