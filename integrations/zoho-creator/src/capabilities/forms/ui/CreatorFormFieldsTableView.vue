<script setup lang="ts">
import type { IArtifact } from '@zoho-studio/core'
import { CopyText } from '@zoho-studio/ui-kit'
import { computed, ref } from 'vue'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import InputText from 'primevue/inputtext'
import { ZohoCreatorForm, ZohoCreatorFormField } from '../../../types'

type CreatorFormFieldRow = ZohoCreatorFormField & {
    id: string
}

const props = defineProps<{
    artifact: IArtifact
}>()

const searchTerm = ref('')

const fields = computed<CreatorFormFieldRow[]>(() => {
    const origin = props.artifact.origin as ZohoCreatorForm
    const items = origin.fields ?? {}

    return Object.entries(items).map(([key, field]) => ({
        id: key,
        ...field,
    }))
})

const filteredFields = computed(() => {
    if (!searchTerm.value) {
        return fields.value
    }

    const query = searchTerm.value.toLowerCase()

    return fields.value.filter(
        (field) =>
            field.displayName?.toLowerCase().includes(query) ||
            field.linkName?.toLowerCase().includes(query) ||
            field.type?.toLowerCase().includes(query) ||
            field.componentType?.toLowerCase().includes(query)
    )
})
</script>

<template>
    <DataTable :value="filteredFields" striped-rows row-hover size="small" scrollable scroll-height="flex">
        <template #empty>No fields available for form {{ artifact?.display_name || '' }}</template>
        <template #header>
            <div class="flex items-center justify-end">
                <InputText v-model.lazy="searchTerm" placeholder="Search" size="small" />
            </div>
        </template>

        <Column field="displayName" header="Display Name" />
        <Column field="type" header="Type" />
        <Column field="componentType" header="Component" />
        <Column field="linkName" header="API Name">
            <template #body="slotProps">
                <CopyText v-if="slotProps.data.linkName" :value="slotProps.data.linkName" />
            </template>
        </Column>
        <Column field="isMandatory" header="Required">
            <template #body="slotProps">
                {{ slotProps.data.isMandatory ? 'Yes' : 'No' }}
            </template>
        </Column>
        <Column field="isSystemField" header="System">
            <template #body="slotProps">
                {{ slotProps.data.isSystemField ? 'Yes' : 'No' }}
            </template>
        </Column>
    </DataTable>
</template>
