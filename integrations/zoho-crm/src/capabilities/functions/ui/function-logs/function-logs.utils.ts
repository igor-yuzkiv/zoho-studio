import {
    CrmFunctionLog,
    CrmFunctionLogDetailsRequestParams,
    CrmFunctionLogsResponse,
    CrmFunctionsLogsPeriod,
} from '../../../../types'
import { addMinutes, format, parse, parseISO, subMinutes } from 'date-fns'

export const PERIOD_OPTIONS: Array<{ label: string; value: CrmFunctionsLogsPeriod }> = [
    { label: 'Past 24 hours', value: 'past_24_hours' },
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last Month', value: 'last_month' },
]

export const getDefaultPaginationState = (): CrmFunctionLogsResponse['info'] => ({
    page: 1,
    per_page: 40,
    timezone: '',
    count: 0,
    more_records: true,
})

export function formatLogDatetime(date: Date): string {
    return format(date, "yyyy-MM-dd'T'HH:mm:ssxxx")
}

export function parseLogDateString(value: string): Date | null {
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

export function resolveLogExecutionDate(log: CrmFunctionLog): Date {
    if (log.executed_time) {
        const parsed = parseLogDateString(log.executed_time)
        if (parsed) {
            return parsed
        }
    }

    return new Date()
}

export function buildLogDetailsParams(log: CrmFunctionLog): CrmFunctionLogDetailsRequestParams {
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
