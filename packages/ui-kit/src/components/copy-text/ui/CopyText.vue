<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useClipboard } from '@vueuse/core'

const props = defineProps({ value: { type: String, required: true } })

const { copy } = useClipboard()
function copyToClipboard() {
    copy(props.value)
}
</script>

<template>
    <div @click.stop="copyToClipboard" class="group relative block cursor-pointer hover:underline" v-bind="$attrs">
        <slot>
            {{ value }}
        </slot>
        <Icon
            icon="si:copy-fill"
            class="invisible absolute top-1 -left-5 h-4 w-4 opacity-50 transition-opacity duration-200 group-hover:visible hover:opacity-100"
        />
    </div>
</template>

<style scoped></style>
