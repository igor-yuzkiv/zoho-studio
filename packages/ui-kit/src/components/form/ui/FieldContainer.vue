<script setup lang="ts">
import { computed } from 'vue'
import { IftaLabel, Message } from 'primevue'

const props = defineProps<{
    label: string
    errorMessage?: string | string[]
    inputId: string
}>()

const hasErrors = computed(() => {
    return Array.isArray(props.errorMessage) ? props.errorMessage.length > 0 : !!props.errorMessage
})

const message = computed(() => {
    if (Array.isArray(props.errorMessage)) {
        return props.errorMessage.join(', ')
    }
    return props.errorMessage
})
</script>

<template>
    <IftaLabel>
        <slot></slot>
        <label :for="inputId">
            <slot name="label">{{ label }}</slot>
        </label>
        <Message v-show="hasErrors" class="ml-1" size="small" variant="simple" severity="error">{{ message }}</Message>
    </IftaLabel>
</template>

<style scoped></style>
