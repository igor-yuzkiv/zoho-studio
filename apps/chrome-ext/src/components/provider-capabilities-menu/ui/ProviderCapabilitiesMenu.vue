<script setup lang="ts">
import type { CapabilityDescriptor } from '@zoho-studio/core'
import { CapabilitiesMenu, type CapabilitiesMenuItem } from '@zoho-studio/ui-kit'
import { computed } from 'vue'

const props = defineProps<{
    providerId: string
    capabilities: CapabilityDescriptor[]
}>()

const itemsForDisplay = computed<CapabilitiesMenuItem[]>(() => {
    return props.capabilities.map((capability) => ({
        id: capability.type,
        title: capability.title,
        icon: capability.icon,
        route: `/workspace/${props.providerId}/capabilities/${capability.type}`,
        hidden: capability.hideInMenu,
        activeMatch: capability.type,
    }))
})
</script>

<template>
    <CapabilitiesMenu :capabilities="itemsForDisplay" />
</template>

<style scoped></style>
