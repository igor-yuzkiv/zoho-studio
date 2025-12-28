<script setup lang="ts">
import { ListItemProps } from '../lib/list.props.ts'
import { Icon } from '@iconify/vue'

defineProps<ListItemProps>()
</script>

<template>
    <component
        class="flex items-center justify-between w-full cursor-pointer hover:bg-selection px-2"
        :is="as || 'div'"
        v-tooltip="{ value: tooltip || title }"
    >
        <div class="flex items-center gap-x-2 w-full">
            <slot name="icon">
                <Icon v-if="icon" :icon="icon" class="shrink-0" />
            </slot>

            <slot>
                <div class="truncate">{{ title }}</div>
            </slot>
        </div>
        <div class="flex items-center gap-x-2">
            <slot name="actions" />
        </div>
    </component>
</template>

<style scoped></style>
