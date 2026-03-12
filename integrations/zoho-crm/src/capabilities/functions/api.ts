import { BaseCrmApiService } from '../../base-crm-api.service.ts'
import { PaginationParams, PromisePaginatedResult, Result } from '@zoho-studio/utils'
import {
    CrmFunctionLogDetails,
    CrmFunctionLogDetailsRequestParams,
    CrmFunctionLogDetailsResponse,
    CrmFunctionLogsRequestParams,
    CrmFunctionLogsResponse,
    ZohoCrmFunction,
} from '../../types'

export class CrmFunctionsApiService extends BaseCrmApiService {
    async listFunctions(pagination: PaginationParams): PromisePaginatedResult<ZohoCrmFunction> {
        const start = pagination.page <= 1 ? 0 : (pagination.page - 1) * pagination.per_page
        const limit = pagination.per_page

        try {
            const response = await this.httpRequest<{ functions: ZohoCrmFunction[] }>({
                url: `/crm/v2/settings/functions?type=org&start=${start}&limit=${limit}`,
                method: 'GET',
            })

            if (!response.data || !Array.isArray(response.data.functions)) {
                return { ok: false, error: 'Invalid response format' }
            }

            const functions = response.data.functions

            return {
                ok: true,
                data: functions,
                meta: {
                    total: functions.length,
                    page: pagination.page,
                    per_page: pagination.per_page,
                    has_more: functions.length >= pagination.per_page,
                },
            }
        } catch (error) {
            console.error('[ZohoCrm][CrmFunctionsApiService@listFunctions] API request failed', {
                error,
                pagination,
                start,
                limit,
            })

            return { ok: false, error: 'Failed to fetch functions' }
        }
    }

    async functionDetails(functionId: string): Promise<Result<ZohoCrmFunction>> {
        try {
            const query = new URLSearchParams({
                category: 'automation',
                source: 'crm',
                language: 'deluge',
            }).toString()

            const response = await this.httpRequest<{ functions: ZohoCrmFunction[] }>({
                url: `/crm/v2/settings/functions/${functionId}?${query}`,
                method: 'GET',
            })

            if (!response.data || !Array.isArray(response.data.functions)) {
                return { ok: false, error: 'Invalid response format' }
            }

            const fx = response.data.functions[0]
            if (!fx) {
                return { ok: false, error: 'Function not found' }
            }

            return { ok: true, value: fx }
        } catch (error) {
            console.error(
                `[ZohoCrm][CrmFunctionsApiService@functionDetails] API request failed for function ID ${functionId}`,
                {
                    functionId,
                    error,
                }
            )

            return { ok: false, error: 'Failed to fetch function details' }
        }
    }

    async loadFunctionsDetails(functions: ZohoCrmFunction[]): Promise<ZohoCrmFunction[]> {
        const functionsMap = Object.fromEntries(functions.map((fx) => [fx.id, fx]))

        const responses = await Promise.allSettled(functions.map((fx) => this.functionDetails(fx.id)))

        for (const res of responses) {
            if (res.status === 'fulfilled' && res.value.ok) {
                functionsMap[res.value.value.id] = res.value.value
            }
        }

        return Object.values(functionsMap)
    }

    async listFunctionLogs(
        functionId: string,
        params: CrmFunctionLogsRequestParams
    ): Promise<Result<CrmFunctionLogsResponse>> {
        try {
            const query = new URLSearchParams()

            query.set('period', params.period)
            query.set('page', String(params.page))
            query.set('per_page', String(params.per_page))
            query.set('language', params.language)

            if (params.start_datetime) {
                query.set('start_datetime', params.start_datetime)
            }

            if (params.end_datetime) {
                query.set('end_datetime', params.end_datetime)
            }

            const response = await this.httpRequest<CrmFunctionLogsResponse>({
                url: `/crm/v2.2/settings/functions/${functionId}/logs?${query.toString()}`,
                method: 'GET',
            })

            if (!response.data || !Array.isArray(response.data.function_logs) || !response.data.info) {
                return { ok: false, error: 'Invalid response format' }
            }

            return { ok: true, value: response.data }
        } catch (error) {
            console.error(
                `[ZohoCrm][CrmFunctionsApiService@listFunctionLogs] API request failed for function ID ${functionId}`,
                {
                    functionId,
                    params,
                    error,
                }
            )

            return { ok: false, error: 'Failed to fetch function logs' }
        }
    }

    async functionLogDetails(
        functionId: string,
        logId: string,
        params?: CrmFunctionLogDetailsRequestParams
    ): Promise<Result<CrmFunctionLogDetails>> {
        try {
            const queryParts: string[] = []

            if (params?.start_datetime) {
                queryParts.push(`start_datetime=${params.start_datetime}`)
            }

            if (params?.end_datetime) {
                queryParts.push(`end_datetime=${params.end_datetime}`)
            }

            if (params?.period) {
                queryParts.push(`period=${params.period}`)
            }

            const queryString = queryParts.join('&')

            const response = await this.httpRequest<CrmFunctionLogDetailsResponse>({
                url: `/crm/v2.2/settings/functions/${functionId}/logs/${logId}${queryString ? `?${queryString}` : ''}`,
                method: 'GET',
            })

            if (!response.data || !Array.isArray(response.data.function_logs)) {
                return { ok: false, error: 'Invalid response format' }
            }

            const log = response.data.function_logs[0]
            if (!log) {
                return { ok: false, error: 'Log not found' }
            }

            return { ok: true, value: log }
        } catch (error) {
            console.error(
                `[ZohoCrm][CrmFunctionsApiService@functionLogDetails] API request failed for function ID ${functionId} and log ID ${logId}`,
                {
                    functionId,
                    logId,
                    params,
                    error,
                }
            )

            return { ok: false, error: 'Failed to fetch function log details' }
        }
    }
}
