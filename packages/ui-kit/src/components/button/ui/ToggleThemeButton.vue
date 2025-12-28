<script setup lang="ts">
import IconButton from './IconButton.vue'

defineProps<{ isDark: boolean }>()
</script>

<template>
    <IconButton class="p-0" text :icon="isDark ? 'ix:light-dark' : 'circum:dark'" size="small" />
</template>

<style scoped></style>
