<script setup lang="ts">
import type { IGitRepository } from '../types.ts'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

defineProps<{
    repositories: IGitRepository[]
}>()
</script>

<template>
    <DataTable :value="repositories" striped-rows row-hover size="small" scrollable scroll-height="flex">
        <template #empty>No git repositories added yet.</template>

        <Column field="name" header="Name" />

        <Column field="description" header="Description" />
    </DataTable>
</template>

<style scoped></style>
