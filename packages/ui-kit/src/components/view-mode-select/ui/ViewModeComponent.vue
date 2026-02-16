<script setup lang="ts">
import type { ViewModeOption } from '../type.ts'
import { computed, useAttrs } from 'vue'

defineOptions({
    inheritAttrs: false,
})

const props = defineProps<{ options: ViewModeOption[] }>()
const modelValue = defineModel<ViewModeOption['value']>()
const attrs = useAttrs()

const currentOption = computed<ViewModeOption | undefined>(() => {
    return props.options.find((o) => o.value === modelValue.value)
})
</script>

<template>
    <component v-if="currentOption?.component" :is="currentOption.component" v-bind="attrs" />
</template>
