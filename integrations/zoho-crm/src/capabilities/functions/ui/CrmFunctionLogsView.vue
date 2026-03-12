<script setup lang="ts">
import type { IArtifact } from '@zoho-studio/core'
import type { ServiceProvider } from '@zoho-studio/core'
import { addMinutes, format, parse, parseISO, subMinutes } from 'date-fns'
import Button from 'primevue/button'
import { CrmFunctionsApiService } from '../api.ts'
import {
    CrmFunctionLog,
    CrmFunctionLogDetails,
    CrmFunctionLogDetailsRequestParams,
    ZohoCrmFunction,
} from '../../../types'
import { ref } from 'vue'

const props = defineProps<{
    artifact: IArtifact<'functions', ZohoCrmFunction>
    provider: ServiceProvider
}>()

const isLoadingLogs = ref(false)
const isLoadingLogDetails = ref(false)
const errorMessage = ref<string | null>(null)
const logs = ref<CrmFunctionLog[]>([])
const selectedLog = ref<CrmFunctionLogDetails | null>(null)

function formatLogDatetime(date: Date): string {
    return format(date, "yyyy-MM-dd'T'HH:mm:ssxxx")
}

function parseLogDateString(value: string): Date | null {
    const isoDate = parseISO(value)
    if (!Number.isNaN(isoDate.getTime())) {
        return isoDate
    }

    const crmDate = parse(value, 'MMM d, yyyy hh:mm a', new Date())
    if (!Number.isNaN(crmDate.getTime())) {
        return crmDate
    }

    const nativeDate = new Date(value)
    if (!Number.isNaN(nativeDate.getTime())) {
        return nativeDate
    }

    return null
}

function createApiService(): CrmFunctionsApiService {
    if (!props.provider) {
        throw new Error(`Provider not found`)
    }

    return new CrmFunctionsApiService(props.provider)
}

function resolveLogExecutionDate(log: CrmFunctionLog): Date {
    if (log.executed_time) {
        const parsed = parseLogDateString(log.executed_time)
        if (parsed) {
            return parsed
        }
    }

    return new Date()
}

function buildLogDetailsParams(log: CrmFunctionLog): CrmFunctionLogDetailsRequestParams {
    if (log.start_datetime && log.end_datetime) {
        return {
            period: 'custom' as const,
            start_datetime: log.start_datetime,
            end_datetime: log.end_datetime,
        }
    }

    const executionDate = resolveLogExecutionDate(log)

    return {
        period: 'custom' as const,
        start_datetime: formatLogDatetime(subMinutes(executionDate, 1)),
        end_datetime: formatLogDatetime(addMinutes(executionDate, 5)),
    }
}

async function fetchLogs() {
    errorMessage.value = null
    isLoadingLogs.value = true

    try {
        const api = createApiService()
        const response = await api.listFunctionLogs(props.artifact.source_id, {
            period: 'yesterday',
            page: 1,
            per_page: 40,
            language: props.artifact.origin.language || 'deluge',
        })

        if (!response.ok) {
            errorMessage.value = response.error
            return
        }

        logs.value = response.value.function_logs
        console.log('[ZohoCrm][CrmFunctionLogsView] function logs', response.value)
    } catch (error) {
        errorMessage.value = error instanceof Error ? error.message : 'Failed to fetch logs'
        console.error('[ZohoCrm][CrmFunctionLogsView] fetchLogs failed', error)
    } finally {
        isLoadingLogs.value = false
    }
}

async function fetchLogDetails() {
    errorMessage.value = null

    const log = logs.value[0]
    if (!log?.id) {
        errorMessage.value = 'Load logs first to fetch a specific log'
        return
    }

    isLoadingLogDetails.value = true

    try {
        const api = createApiService()
        const params = buildLogDetailsParams(log)
        const response = await api.functionLogDetails(props.artifact.source_id, log.id, params)

        if (!response.ok) {
            errorMessage.value = response.error
            return
        }

        selectedLog.value = response.value
    } catch (error) {
        errorMessage.value = error instanceof Error ? error.message : 'Failed to fetch log details'
        console.error('[ZohoCrm][CrmFunctionLogsView] fetchLogDetails failed', error)
    } finally {
        isLoadingLogDetails.value = false
    }
}
</script>

<template>
    <div class="flex h-full w-full flex-col gap-4 p-4">
        <div class="flex flex-col gap-1">
            <h1 class="text-lg font-semibold">
                Function logs
            </h1>
            <div class="text-sm text-surface-500">
                {{ artifact.origin.api_name || artifact.display_name }}
            </div>
            <div class="text-xs text-surface-400">
                provider: {{ artifact.provider_id }}
            </div>
        </div>

        <div class="flex flex-wrap gap-2">
            <Button
                :disabled="!provider || isLoadingLogs"
                :loading="isLoadingLogs"
                label="Fetch logs"
                size="small"
                @click="fetchLogs"
            />

            <Button
                :disabled="!provider || isLoadingLogDetails || !logs.length"
                :loading="isLoadingLogDetails"
                label="Fetch first log details"
                severity="secondary"
                size="small"
                @click="fetchLogDetails"
            />
        </div>

        <div
            v-if="errorMessage"
            class="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
            {{ errorMessage }}
        </div>

        <div class="grid gap-4 md:grid-cols-2">
            <div class="rounded border border-surface-200 p-3">
                <div class="mb-2 text-sm font-medium">
                    Logs
                </div>
                <pre class="overflow-auto text-xs">{{ logs }}</pre>
            </div>

            <div class="rounded border border-surface-200 p-3">
                <div class="mb-2 text-sm font-medium">
                    Selected log
                </div>
                <pre class="overflow-auto text-xs">{{ selectedLog }}</pre>
            </div>
        </div>
    </div>
</template>

<style scoped>
pre {
    white-space: pre-wrap;
    word-break: break-word;
}
</style>
