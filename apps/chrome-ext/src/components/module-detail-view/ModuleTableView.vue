<script setup lang="ts">
import type { IArtifact } from '@zoho-studio/core'
import { CopyText } from '@zoho-studio/ui-kit'
import { computed, ref } from 'vue'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import InputText from 'primevue/inputtext'

const props = defineProps<{
    module: IArtifact<'modules'>
    fields: IArtifact<'fields'>[]
}>()

const searchTerm = ref('')

const filteredFields = computed(() => {
    if (!searchTerm.value) return props.fields

    const query = searchTerm.value.toLowerCase()
    return props.fields.filter(
        (field) =>
            field.display_name?.toLowerCase().includes(query) ||
            field.api_name?.toLowerCase().includes(query) ||
            field.payload.display_data_type?.toLowerCase().includes(query)
    )
})
</script>

<template>
    <DataTable :value="filteredFields" striped-rows row-hover size="small" scrollable scroll-height="flex">
        <template #empty> No fields available for module {{ module?.display_name || '' }}</template>
        <template #header>
            <div class="flex items-center justify-end">
                <InputText v-model.lazy="searchTerm" placeholder="Search" size="small" />
            </div>
        </template>

        <Column field="display_name" header="Display Name" />
        <Column field="payload.display_data_type" header="Type" />
        <Column field="api_name" header="Api Name">
            <template #body="slotProps">
                <CopyText v-if="slotProps.data.api_name" :value="slotProps.data.api_name" />
            </template>
        </Column>
    </DataTable>
</template>
