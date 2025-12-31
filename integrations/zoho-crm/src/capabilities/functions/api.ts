import { CrmApiService } from '../../services'
import { PaginationParams, PromisePaginatedResult, Result } from '@zoho-studio/utils'
import { ZohoCrmFunction } from '../../types'

export class CrmFunctionsApiService extends CrmApiService {
    async listFunctions(pagination: PaginationParams): PromisePaginatedResult<ZohoCrmFunction> {
        const start = pagination.page <= 1 ? 0 : (pagination.page - 1) * pagination.per_page
        const limit = pagination.per_page
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
    }

    async functionDetails(functionId: string): Promise<Result<ZohoCrmFunction>> {
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
}
