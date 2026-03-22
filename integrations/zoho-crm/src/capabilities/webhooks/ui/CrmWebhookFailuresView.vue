<script setup lang="ts">
import type { IArtifact, ServiceProvider } from '@zoho-studio/core'
import { ZohoCrmWebhook, CrmServiceProviderMetadata, ZohoCrmWebhookFailEntry } from '../../../types'
import Button from 'primevue/button'
import { CrmWebhooksApiService } from '../api.ts'
import { ref, watch } from 'vue'
import { PagingResponseMeta, useConsoleLogger } from '@zoho-studio/utils'
import { useToast } from '@zoho-studio/ui-kit'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { CrmLink } from '../../../interanal/components'
import { subDays, format } from 'date-fns'

const getDefaultPagination = (): PagingResponseMeta => ({
    page: 1,
    per_page: 50,
    has_more: true,
    total: 0,
})

const props = defineProps<{
    artifact: IArtifact<'webhooks', ZohoCrmWebhook>
    provider: ServiceProvider<CrmServiceProviderMetadata>
}>()

const logger = useConsoleLogger('[ZohoCrm|CrmWebhookFailuresView]')
const toast = useToast()
const apiService = new CrmWebhooksApiService(props.provider)

const isLoading = ref(false)
const webhookFailures = ref<ZohoCrmWebhookFailEntry[]>([])
const pagination = ref<PagingResponseMeta>(getDefaultPagination())

async function loadWebhookFailuresPage() {
    try {
        const today = new Date()
        const thirtyDaysAgo = subDays(today, 20)

        isLoading.value = true
        const requestPayload = {
            webhook_id: props.artifact.source_id,
            page: pagination.value.page,
            per_page: pagination.value.per_page,
            from: format(thirtyDaysAgo, 'yyyy-MM-dd'),
            to: format(today, 'yyyy-MM-dd'),
        }

        const response = await apiService.fetchWebhookFailures(requestPayload)

        if (!response.ok) {
            logger.error('Failed to load webhook failures', { response, requestPayload })
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load webhook failures.' })
            return
        }

        webhookFailures.value = [...webhookFailures.value, ...(response.data || [])]
        pagination.value = {
            page: response.meta.page,
            per_page: response.meta.per_page,
            has_more: response.meta.has_more,
            total: response.meta.total,
        }
    } catch (error) {
        logger.error('Error while loading webhook failures', { error })
        toast.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while loading webhook failures.' })
    } finally {
        isLoading.value = false
    }
}

async function loadNextPage() {
    if (!pagination.value.has_more) {
        return
    }

    if (webhookFailures.value.length > 0) {
        pagination.value.page += 1
    }

    await loadWebhookFailuresPage()
}

watch([() => props.artifact, () => props.provider], () => {
    webhookFailures.value = []
    pagination.value = getDefaultPagination()
})
</script>

<template>
    <div class="flex h-full w-full flex-col overflow-hidden">
        <div class="flex items-center justify-between p-2">
            <h1 class="text-xl font-bold">Webhook failures over the last 30 days</h1>

            <Button text size="small" @click="loadNextPage" :disabled="isLoading || !pagination.has_more">
                Load
            </Button>
        </div>

        <div class="flex h-full w-full overflow-hidden">
            <DataTable
                class="w-full"
                :value="webhookFailures"
                striped-rows
                row-hover
                size="small"
                scrollable
                scroll-height="flex"
                data-key="id"
                selectionMode="single"
                pt:footer:class="bg-transparent"
            >
                <template #empty>
                    <span v-if="pagination.has_more">
                        No failures found for this webhook. Click <b class="text-primary-500">"Load"</b> to fetch data.
                    </span>
                    <span v-else>No failures found for this webhook.</span>
                </template>

                <Column field="failure_time" header="failure_time" :sortable="true" />
                <Column field="failure_reason" header="failure_reason" :sortable="true" />
                <Column field="webhook" header="webhook">
                    <template #body="{ data }">
                        <CrmLink
                            v-if="data?.webhook?.id"
                            :metadata="provider.metadata"
                            :path="`/settings/webhooks/${data.webhook.id}/edit`"
                            :label="data.webhook.name"
                        />
                    </template>
                </Column>
                <Column field="workflow_rule" header="workflow_rule">
                    <template #body="{ data }">
                        <CrmLink
                            v-if="data?.workflow_rule?.id"
                            :metadata="provider.metadata"
                            :path="`/settings/workflow-rules/${data.workflow_rule.id}`"
                            :label="data.workflow_rule.name"
                        />
                    </template>
                </Column>
                <Column field="entity_details.module.api_name" header="module"> </Column>
                <Column field="entity_details.id" header="record_id"> </Column>
                <Column field="entity_details.name" header="record_name"> </Column>
                <Column field="id" header="log_id" />
            </DataTable>
        </div>
    </div>
</template>

<style scoped></style>
