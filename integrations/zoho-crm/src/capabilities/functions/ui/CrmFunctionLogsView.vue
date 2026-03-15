<script setup lang="ts">
import type { IArtifact, ServiceProvider } from '@zoho-studio/core'
import { useConsoleLogger } from '@zoho-studio/utils'
import { useToast, NoDataMessage } from '@zoho-studio/ui-kit'
import { ZohoCrmFunction, CrmFunctionLog, CrmFunctionsLogsPeriod, CrmFunctionLogsResponse } from '../../../types'
import { computed, ref, watch } from 'vue'
import Select from 'primevue/select'
import Button from 'primevue/button'
import ToggleSwitch from 'primevue/toggleswitch'
import { CrmFunctionsApiService } from '../api.ts'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { Icon } from '@iconify/vue'
import { buildLogDetailsParams, PERIOD_OPTIONS, getDefaultPaginationState } from './function-logs.utils.ts'

const props = defineProps<{
    artifact: IArtifact<'functions', ZohoCrmFunction>
    provider: ServiceProvider
}>()

const toast = useToast()
const logger = useConsoleLogger('[ZohoCrm|CrmFunctionLogsView]')
const apiService = new CrmFunctionsApiService(props.provider)

const isPendingList = ref(false)
const isPendingDetails = ref(false)
const isPending = computed(() => isPendingList.value || isPendingDetails.value)

const period = ref<CrmFunctionsLogsPeriod>('past_24_hours')
const preserveLogsOnReload = ref(true)
const pagination = ref<CrmFunctionLogsResponse['info']>(getDefaultPaginationState())

const logsById = ref<Map<string, CrmFunctionLog>>(new Map())
const logsList = computed<CrmFunctionLog[]>(() => Array.from(logsById.value.values()))
const selectedLog = ref<CrmFunctionLog | null>(null)

async function loadLogsPage() {
    try {
        isPendingList.value = true

        const response = await apiService.listFunctionLogs(props.artifact.source_id, {
            period: period.value,
            page: pagination.value.page,
            per_page: pagination.value.per_page,
            language: 'deluge',
        })

        if (!response.ok) {
            toast.error({ detail: logger.message(`Failed to fetch log: ${response.error}`) })
            logger.error('Failed to fetch log', response, {
                pagination: pagination.value,
                artifact: props.artifact,
                provider: props.provider,
            })

            return
        }

        const { function_logs, info } = response.value

        pagination.value = { ...pagination.value, ...info }

        for (const item of function_logs) {
            if (!logsById.value.has(item.id)) {
                logsById.value.set(item.id, item)
            }
        }
    } catch (error) {
        toast.error({ detail: logger.message(`Failed to fetch log.`) })

        logger.error('Failed to fetch log', error, {
            pagination: pagination.value,
            artifact: props.artifact,
            provider: props.provider,
        })
    } finally {
        isPendingList.value = false
    }
}

function resetLogsListState() {
    logsById.value = new Map()
    pagination.value = getDefaultPaginationState()
    selectedLog.value = null;
}

async function reloadLogs() {
    if (!preserveLogsOnReload.value) {
        resetLogsListState()
    }

    await loadLogsPage()
}

async function loadNextLogsPage() {
    if (!pagination.value.more_records) return

    pagination.value.page += 1
    await loadLogsPage()
}

async function handleSelectLog(log: CrmFunctionLog) {
    if (isPending.value) {
        return
    }

    if (log?.info_message) {
        selectedLog.value = log
        return
    }

    try {
        isPendingDetails.value = true

        const params = buildLogDetailsParams(log)
        const response = await apiService.functionLogDetails(props.artifact.source_id, log.id, params)

        if (!response.ok) {
            toast.error({ detail: logger.message(`Failed to fetch log details: ${response.error}`) })
            logger.error('Failed to fetch log', response, {
                log: log,
                artifact: props.artifact,
                provider: props.provider,
            })

            return
        }

        const logDetails: CrmFunctionLog = {
            ...log,
            ...response.value,
        }

        selectedLog.value = logDetails
        logsById.value.set(log.id, logDetails)
    } catch (error) {
        toast.error({ detail: logger.message(`Failed to fetch log details.`) })

        logger.error('Failed to fetch log details', error, {
            log: log,
            artifact: props.artifact,
            provider: props.provider,
        })
    } finally {
        isPendingDetails.value = false
    }
}

function handleExportLogs() {
    const jsonContent = JSON.stringify(logsList.value, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `function_logs_${props.artifact.display_name}_${new Date().toISOString()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

watch([() => props.artifact, () => props.provider], () => {
    if (!preserveLogsOnReload.value) {
        logsById.value = new Map()
        pagination.value = { page: 1, per_page: 40, timezone: '', count: 0, more_records: true }
    }
})
</script>

<template>
    <div class="flex h-full w-full flex-col overflow-hidden px-3 py-2">
        <div class="flex w-full items-center justify-between">
            <div class="flex flex-col gap-1">
                <div class="flex items-center gap-1">
                    <Icon icon="eos-icons:loading" class="h-6 w-6 text-orange-500" v-if="isPending" />
                    <h1 class="text-lg font-semibold">Function logs</h1>
                </div>
                <div v-if="pagination.timezone" class="text-surface-400 text-xs">{{ pagination.timezone }}</div>
            </div>

            <div class="flex items-center gap-4">
                <Select
                    class="border-none bg-transparent text-sm shadow-none"
                    :options="PERIOD_OPTIONS"
                    v-model="period"
                    option-label="label"
                    option-value="value"
                />

                <Button text size="small" @click="reloadLogs" :disabled="isPending" :loading="isPending"> Load </Button>
            </div>
        </div>

        <Splitter
            class="flex h-full w-full overflow-hidden bg-transparent"
            :pt="{ gutter: { class: 'bg-transparent' } }"
        >
            <SplitterPanel class="flex h-full w-full flex-col overflow-hidden border-r">
                <DataTable
                    :value="logsList"
                    striped-rows
                    row-hover
                    size="small"
                    scrollable
                    scroll-height="flex"
                    data-key="id"
                    selectionMode="single"
                    :selection="selectedLog"
                    @update:selection="handleSelectLog"
                >
                    <template #header>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-x-2">
                                <Button
                                    text
                                    size="small"
                                    @click="handleExportLogs"
                                    :disabled="logsList.length === 0 || isPending"
                                >
                                    Export
                                </Button>
                            </div>
                            <div
                                class="flex items-center gap-x-2"
                                v-tooltip="{
                                    value: 'Keep previously loaded logs when fetching new ones. This allows comparing logs across different functions or periods.',
                                }"
                            >
                                <label for="keep_previous_logs">Preserve logs on reload</label>
                                <ToggleSwitch v-model="preserveLogsOnReload" />
                            </div>
                        </div>
                    </template>

                    <template #empty> No logs found for the selected period. </template>

                    <Column field="id">
                        <template #body="{ data }">
                            <Icon icon="akar-icons:eye" v-if="data?.info_message" />
                        </template>
                    </Column>
                    <Column field="status" header="status" :sortable="true">
                        <template #body="slotProps">
                            <span
                                :class="{
                                    'bg-green-300 text-green-900': slotProps.data.status === 'success',
                                    'bg-red-300 text-red-900': slotProps.data.status === 'failure',
                                    'bg-gray-300 text-gray-900': slotProps.data.status === 'pending',
                                }"
                                class="inline-flex h-6 items-center rounded-full px-2 text-xs font-medium"
                            >
                                {{ slotProps.data.status }}
                            </span>
                        </template>
                    </Column>
                    <Column field="executed_time" header="executed_time" :sortable="true" />
                    <Column field="execution_time" header="execution_time" :sortable="true" />
                    <Column field="function_name" header="function_name" />
                    <Column field="component_type" header="component_type" />
                </DataTable>

                <div class="flex w-full justify-center border-t">
                    <Button
                        v-if="logsList.length > 0 && pagination.more_records"
                        text
                        size="small"
                        @click="loadNextLogsPage"
                        :disabled="isPending"
                    >
                        Load next page
                    </Button>
                </div>
            </SplitterPanel>

            <SplitterPanel
                class="flex h-full w-full overflow-hidden"
                :size="5"
                style="min-width: 10rem; max-width: 50rem"
            >
                <!-- Empty -->

                <div v-if="!selectedLog" class="flex h-full w-full flex-col items-center justify-around">
                    <NoDataMessage
                        title="Select a log to see details"
                        message="Click on any log entry from the left to view its details here."
                        icon="tabler:logs"
                    />
                </div>

                <div v-else class="flex h-full w-full flex-col overflow-auto">
                    <pre>{{ selectedLog }}</pre>
                </div>
            </SplitterPanel>
        </Splitter>
    </div>
</template>

<style scoped></style>
