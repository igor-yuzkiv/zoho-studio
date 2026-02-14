import { BaseCrmApiService } from '../../base-crm-api.service.ts'
import type { PaginationParams, PromisePaginatedResult } from '@zoho-studio/utils'
import type { ZohoCrmModule } from '../../types'

type ModulesListResponse = {
    modules: ZohoCrmModule[]
}

export class CrmModulesApiService extends BaseCrmApiService {
    async listModules(pagination: PaginationParams): PromisePaginatedResult<ZohoCrmModule> {
        const query = new URLSearchParams({
            include: 'team_spaces',
            status: 'user_hidden,system_hidden,scheduled_for_deletion,visible',
        }).toString()

        const response = await this.httpRequest<ModulesListResponse>({
            url: `/crm/v6/settings/modules?${query}`,
            method: 'GET',
        })

        if (!response.data || !Array.isArray(response.data.modules)) {
            return { ok: false, error: 'Invalid response format' }
        }

        const modules = response.data.modules

        return {
            ok: true,
            data: modules,
            meta: {
                total: modules.length,
                page: pagination.page,
                per_page: modules.length,
                has_more: false,
            },
        }
    }
}
