<script setup lang="ts">
import type { CapabilitiesMenuItem } from '../types.ts'
import { Icon } from '@iconify/vue'

withDefaults(
    defineProps<{
        capability: CapabilitiesMenuItem
        isActive?: boolean
    }>(),
    {
        isActive: false,
    }
)
</script>

<template>
    <router-link
        :to="capability.route"
        v-tooltip="{ value: capability.title }"
        class="hover:bg-selection flex cursor-pointer items-center justify-center p-2 rounded-lg"
        :class="{ 'app-list-item-active': isActive }"
    >
        <Icon :icon="capability.icon" class="h-4 w-4" />
    </router-link>
</template>

<style scoped></style>
