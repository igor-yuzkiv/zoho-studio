import type { IEntity } from '@zoho-studio/utils'

export interface ZohoCrmFunction extends IEntity {
    id: string
    api_name?: string
    name?: string | null
    display_name?: string
    category: string
    createdTime: number
    updatedTime: number | null
    description: string | null
    language: string
    source: string
    params?: Array<{
        name: string
        type: string
    }> | null
    return_type?: string | null
    script?: string | null
    workflow?: string | null
}

export interface CrmFunctionLog extends IEntity {
    id: string
    component_type: string
    function_name: string
    status: string
    execution_time: number
    executed_time?: string
    start_datetime?: string
    end_datetime?: string

    // details
    arguments?: Record<string, unknown>
    info_message?: string[]
}

export type CrmFunctionsLogsPeriod = 'past_24_hours' | 'today' | 'yesterday' | 'last_month' | 'specific_date' | 'custom'

export type CrmFunctionLogsRequestParams = {
    period: CrmFunctionsLogsPeriod

    // if period = specific_date
    start_datetime?: string // 2026-03-11T00:00:00-04:00
    end_datetime?: string // 2026-03-11T23:30:59-04:00

    page: number
    per_page: number
    language: string // deluge
}

export type CrmFunctionLogsResponse = {
    function_logs: CrmFunctionLog[]
    info: {
        per_page: number
        count: number
        page: number
        more_records: boolean
        timezone?: string
    }
}

export type CrmFunctionLogDetailsRequestParams = {
    period?: CrmFunctionsLogsPeriod
    start_datetime?: string
    end_datetime?: string
}

export type CrmFunctionLogDetailsResponse = {
    function_logs: CrmFunctionLog[]
}
