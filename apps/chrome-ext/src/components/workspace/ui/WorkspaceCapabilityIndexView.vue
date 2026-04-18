<script setup lang="ts">
import { CapabilityDescriptor, ServiceProvider } from '@zoho-studio/core'
import { computed } from 'vue'
import { NoDataMessage } from '@zoho-studio/ui-kit'

const props = defineProps<{
    provider: ServiceProvider
    capabilityDescriptor: CapabilityDescriptor
}>()

const viewComponent = computed(() => {
    if (props.capabilityDescriptor?.indexView) {
        return props.capabilityDescriptor?.indexView
    }

    return NoDataMessage
})
</script>

<template>
    <component
        :is="viewComponent"
        class="app-card flex h-full w-full flex-col overflow-hidden"
        title="No Artifact Selected"
        message="Please select an artifact to view its details."
        :provider="provider"
    />
</template>

<style scoped></style>
