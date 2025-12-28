<script setup lang="ts">
import { Button } from 'primevue'
import type { ButtonProps } from 'primevue/button'
import { Icon } from '@iconify/vue'

interface IconButtonProps extends /* @vue-ignore */ ButtonProps {
    icon: string
}

defineProps<IconButtonProps>()
</script>

<template>
    <Button v-bind="$attrs">
        <template #icon>
            <Icon v-if="icon" :icon="icon" />
        </template>
    </Button>
</template>

<style scoped></style>
