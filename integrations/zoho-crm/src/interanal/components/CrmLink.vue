<script setup lang="ts">
import { CrmServiceProviderMetadata } from '../../types'
import { computed } from 'vue'

const props = defineProps<{
    metadata: CrmServiceProviderMetadata
    path: string
    label?: string
}>()

function replaceStart(originalString: string, search: string, replace: string): string {
    if (originalString.startsWith(search)) {
        return replace + originalString.substring(search.length)
    }
    return originalString
}

const href = computed(() => {
    const org = props.metadata?.isSandbox ? props.metadata.orgId : `org${props.metadata.orgId}`
    return `${props.metadata.host}/crm/${org}/${replaceStart(props.path, '/', '')}`
})
</script>

<template>
    <a :href="href" class="text-blue-500 hover:underline" target="_blank">
        <slot>{{ label }}</slot>
    </a>
</template>

<style scoped></style>
