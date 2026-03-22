<script setup lang="ts" generic="TCapabilityType extends CapabilityType = CapabilityType">
import type { CapabilityType, IArtifact } from '@zoho-studio/core'
import { Icon } from '@iconify/vue'

const props = withDefaults(
    defineProps<{
        artifact: IArtifact<TCapabilityType>
        active: boolean
        icon?: string
    }>(),
    {
        active: false,
        icon: 'mage:file',
    }
)

const emit = defineEmits<{
    (e: 'select', artifact: IArtifact<TCapabilityType>): void
}>()

function handleSelect() {
    emit('select', props.artifact)
}
</script>

<template>
    <button
        type="button"
        class="hover:bg-selection flex w-full cursor-pointer items-center gap-x-2 px-3 text-left text-sm"
        :class="active ? 'app-list-item-active' : ''"
        @click="handleSelect"
    >
        <span class="flex h-4 w-4 items-center justify-center">
            <slot name="icon">
                <Icon v-if="icon" :icon="icon" class="h-4 w-4" />
            </slot>
        </span>

        <span class="truncate">{{ artifact.display_name }}</span>
    </button>
</template>

<style scoped></style>
