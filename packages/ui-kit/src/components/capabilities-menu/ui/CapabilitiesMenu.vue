<script setup lang="ts">
import type { CapabilitiesMenuProps } from '../types.ts'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import CapabilitiesItem from './CapabilitiesItem.vue'

const props = defineProps<CapabilitiesMenuProps>()
const route = useRoute()

const itemsForDisplay = computed(() => {
    return props.capabilities
        .filter((capability) => !capability.hidden)
        .map((capability) => ({
            ...capability,
            isActive: route.path.includes(capability.activeMatch ?? capability.id),
        }))
})
</script>

<template>
    <ul>
        <li v-for="capability in itemsForDisplay" :key="capability.id" class="p-2">
            <CapabilitiesItem :capability="capability" :is-active="capability.isActive" />
        </li>
    </ul>
</template>

<style scoped></style>
