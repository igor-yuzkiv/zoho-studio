<script setup lang="ts">
import { Icon } from '@iconify/vue'

const props = defineProps({ value: { type: String, required: true } })

function copyToClipboard() {
    navigator.clipboard.writeText(props.value)
}
</script>

<template>
    <div @click.stop="copyToClipboard" class="relative block cursor-pointer group hover:underline" v-bind="$attrs">
        <slot>
            {{ value }}
        </slot>
        <Icon
            icon="si:copy-fill"
            class="absolute top-1 -left-5 w-4 h-4 opacity-50 hover:opacity-100 transition-opacity duration-200 invisible group-hover:visible"
        />
    </div>
</template>

<style scoped></style>
